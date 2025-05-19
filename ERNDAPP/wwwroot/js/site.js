// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
document.addEventListener('DOMContentLoaded', function() {
    const exerciseModal = document.getElementById('exerciseModal');
    const openButton = document.getElementById('openExerciseList');
    const cancelButton = document.getElementById('cancelWorkoutBtn');

    openButton.addEventListener('click', () => {
        exerciseModal.classList.add('show');
    });

    function closeExerciseModal() {
        exerciseModal.classList.remove('show');
    }

    cancelButton.addEventListener('click', closeExerciseModal);

    const startWorkoutBtn = document.getElementById('startWorkoutBtn');

    startWorkoutBtn.addEventListener('click', () => {
        // Get all boxes that are checked inside the modal exercise list
        const selectedExercises = Array.from(
            document.querySelectorAll('#exerciseList input[type="checkbox"]:checked')
            ).map(checkbox => checkbox.value);

            // Save Chosen Exercises to localStorage
            localStorage.setItem('selectedExercises', JSON.stringify(selectedExercises));

            // Close M9odal
            closeExerciseModal();

            // Log it, for now
            console.log("Selected exercises:", selectedExercises);

            // Could store them in memory, localStorage, or send to backend
            // Ex: localStorage.setItem('currentWorkout', JSON.stringify(selectedExercises));

            // TODO: Trigger next step (open second modal or navigate)
    });
});