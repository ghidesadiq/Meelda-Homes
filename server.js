/* ============================================
   MEELDA HOMES — BACKEND SERVER (Paystack)
   ============================================
   Two jobs:
   1. Take the cart from the frontend, ask Paystack to
      initialize a transaction, and hand back the URL
      to redirect the customer to.
   2. After payment, verify the transaction actually
      succeeded before we trust it (never trust the
      frontend alone — anyone could visit success.html
      directly without paying).

   Paystack hosts the actual card-entry page — this
   server never sees or stores raw card numbers.

   Uses the built-in fetch() available in Node 18+,
   so no extra HTTP library needed.
   ============================================ */

require("dotenv").config();
const express = require("express");
const cors = require("cors");

if (!process.env.PAYSTACK_SECRET_KEY) {
  console.error(
    "\n❌ Missing PAYSTACK_SECRET_KEY.\n" +
    "   1. Copy .env.example to .env\n" +
    "   2. Paste your Paystack TEST secret key (starts with sk_test_...) into it\n" +
    "   Get it from your Paystack Dashboard → Settings → API Keys & Webhooks\n"
  );
  process.exit(1);
}

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const app = express();

// Allow your frontend (running on a different port/origin) to call this server
app.use(cors());
app.use(express.json());

// Simple health check — visit this in a browser to confirm the server is running
app.get("/", (req, res) => {
  res.send("Meelda Homes backend is running.");
});

/**
 * POST /initialize-payment
 * Body: { email, items: [{ id, name, price, qty }, ...] }
 * Returns: { url: "https://checkout.paystack.com/..." }
 */
app.post("/initialize-payment", async (req, res) => {
  try {
    const { email, items, successUrl } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty." });
    }

    // Basic validation — never trust prices/quantities from the browser blindly.
    // (Right now prices come from your own products-data.js on the frontend, which
    // is fine for a learning project — but note that a malicious user COULD edit
    // the request before it reaches this server. The next-level fix, once you're
    // ready for it, is to also store product prices on the backend and look them
    // up by id here, ignoring whatever price the frontend sends.)
    for (const item of items) {
      if (!item.name || typeof item.price !== "number" || !item.qty) {
        return res.status(400).json({ error: "Invalid cart item." });
      }
    }

    // Paystack wants the TOTAL amount in kobo (Naira's smallest unit — like cents)
    const totalNaira = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const amountKobo = Math.round(totalNaira * 100);

    // The frontend tells us the exact page to return to (this matters on hosts like
    // GitHub Pages, where the site lives at /Meelda-Homes/ rather than the domain root).
    // Fall back to guessing from the request origin if it isn't provided.
    const origin = req.headers.origin || `http://localhost:${process.env.FRONTEND_PORT || 5500}`;
    const returnUrl =
      typeof successUrl === "string" && /^https?:\/\//.test(successUrl)
        ? successUrl
        : `${origin}/success.html`;

    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        amount: amountKobo,
        currency: "NGN",
        callback_url: returnUrl,
        // Stash the cart items so you can see what was ordered when you look
        // at the transaction in your Paystack dashboard later
        metadata: { items: items },
      }),
    });

    const data = await paystackResponse.json();

    if (!data.status) {
      console.error("Paystack error:", data);
      return res.status(500).json({ error: data.message || "Could not start payment." });
    }

    res.json({ url: data.data.authorization_url });
  } catch (err) {
    console.error("Error initializing payment:", err);
    res.status(500).json({ error: "Something went wrong starting the payment." });
  }
});

/**
 * GET /verify-payment/:reference
 * Called by success.html after Paystack redirects back, to confirm
 * (server-to-server, so it can't be faked) that the payment actually succeeded.
 */
app.get("/verify-payment/:reference", async (req, res) => {
  try {
    const { reference } = req.params;

    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } }
    );

    const data = await paystackResponse.json();

    if (data.status && data.data && data.data.status === "success") {
      res.json({
        verified: true,
        amount: data.data.amount / 100,
        email: data.data.customer.email,
      });
    } else {
      res.json({ verified: false });
    }
  } catch (err) {
    console.error("Error verifying payment:", err);
    res.status(500).json({ error: "Could not verify payment." });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log(`✅ Meelda Homes backend running at http://localhost:${PORT}`);
});
