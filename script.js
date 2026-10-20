// Get all buttons (or links) that navigate to other pages
const buttons = document.querySelectorAll('a'); // or buttons if you are using buttons for navigation

// Function to add fade-out effect
function fadeOut() {
    document.body.classList.add('fade-out');
}

// Function to add fade-in effect after the transition
function fadeIn() {
    document.body.classList.remove('fade-out');
    document.body.classList.add('fade-in');
}

// Loop through each button and add event listener for page transition
buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        // Use currentTarget (the <a> this listener is attached to), not target
        // (whatever element was actually clicked inside it, e.g. an <img> or
        // <h4> inside a product card link). target has no .href and was
        // causing navigation to "undefined".
        const link = e.currentTarget;
        const href = link.getAttribute('href');

        // Skip placeholder links that don't go anywhere yet (About, Account, etc.)
        if (!href) {
            e.preventDefault();
            return;
        }

        // Prevent default behavior (immediate navigation)
        e.preventDefault();
        
        // Trigger the fade-out effect
        fadeOut();
        
        // Wait for the fade-out animation to complete before navigating
        setTimeout(() => {
            // Navigate to the target page
            window.location.href = link.href;
        }, 500); // This timeout should match the duration of the fade-out animation
    });
});

// Ensure fade-in effect happens when the page has loaded
window.addEventListener('load', fadeIn);


