// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
document.addEventListener('DOMContentLoaded', function() {

    const openButton = document.getElementById('openExerciseList');
    if (!openButton) 
        return; // Will exit early when not on the StartWorkout page

    const exerciseModal = document.getElementById('exerciseModal');
    const cancelButton = document.getElementById('cancelWorkoutBtn');
    const currentWorkoutModal = document.getElementById('currentWorkoutModal');
    const exerciseWorkoutList = document.getElementById('exerciseWorkoutList');
    const closeBtn = document.getElementById('closeCurrentWorkoutBtn');
    const addExerciseBtn = document.getElementById('addMoreExercisesBtn');
    const finishWorkoutBtn = document.getElementById('finishWorkoutBtn');
    const startWorkoutBtn = document.getElementById('startWorkoutBtn');

    // Hide the Modal
    function closeExerciseModal() {
        exerciseModal.classList.remove('show');
        exerciseModal.classList.add('hidden');
    }

    // Show the Modal
    function showExerciseModal() {
        exerciseModal.classList.add('show');
        exerciseModal.classList.remove('hidden');
    }

    function openCurrentWorkoutModal() {
            const selectedExercises = JSON.parse(localStorage.getItem('selectedExercises')) || [];
            
            // Clear previous content
            exerciseWorkoutList.innerHTML = '';

            selectedExercises.forEach((exercise) => {
                const exerciseDiv = document.createElement('div');
                exerciseDiv.className = 'exercise-block';

                const title = document.createElement('h3');
                title.textContent = exercise;
                exerciseDiv.appendChild(title);

                // Container for sets
                const setsContainer = document.createElement('div');
                setsContainer.className = 'sets-container';

                // Button to add sets
                const addSetBtn = document.createElement('button');
                addSetBtn.textContent = '+ Add Set';
                addSetBtn.addEventListener('click', () => {
                    const setInput = document.createElement('input');
                    setInput.type = 'number';
                    setInput.placeholder = 'Reps';
                    setsContainer.appendChild(setInput);
                });

                exerciseDiv.appendChild(setsContainer);
                exerciseDiv.appendChild(addSetBtn);
                exerciseWorkoutList.appendChild(exerciseDiv);
            });

            currentWorkoutModal.classList.add('show');

        }

        openButton?.addEventListener('click', () => {
            exerciseModal.classList.add('show');
        });

        cancelButton?.addEventListener('click', closeExerciseModal);

        startWorkoutBtn?.addEventListener('click', () => {
            const selectedExercises = Array.from(
                document.querySelectorAll('#exerciseList input[type="checkbox"]:checked')
            ).map(cb => cb.value);

            localStorage.setItem('selectedExercises', JSON.stringify(selectedExercises));
            closeExerciseModal();
            console.log("Selected exercises:", selectedExercises);
            openCurrentWorkoutModal();
        });

        closeBtn?.addEventListener('click', () => {
            currentWorkoutModal.classList.remove('show');
        });

        addExerciseBtn?.addEventListener('click', () => {
            // Show the exercise modal again when add more exercises is clicked
            showExerciseModal();
        });
});