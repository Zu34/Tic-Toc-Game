// confetti.js
export function triggerConfetti() {
    const confetti = document.getElementById("confetti");
    if (!confetti) return;

    // Temporarily disable pointer events on the play area and game boxes during the confetti animation
    const elements = [playBoard, ...allBox];
    elements.forEach(el => {
        el.style.pointerEvents = 'none';
    });

    confetti.classList.add("active");

    // Automatically hide confetti after a few seconds
    setTimeout(() => {
        confetti.classList.remove("active");

        // Re-enable pointer events after confetti disappears
        elements.forEach(el => {
            el.style.pointerEvents = 'auto';
        });
    }, 5000); // Adjust duration as needed
}
