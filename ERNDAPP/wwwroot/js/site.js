// Wait until the DOM fully loads before javascript code gets ran
document.addEventListener('DOMContentLoaded', function() {

    let repData = JSON.parse(localStorage.getItem('repData')) || {};
    let setData = {};
    let timedExerciseData = {};
    

    // Butten to open the exercise selection modal
    const openButton = document.getElementById('openExerciseList');
    if (!openButton) 
        return; // Exit early when not on the StartWorkout page

    // DOM elements for modals and buttons
    const exerciseModal = document.getElementById('exerciseModal');                 // Modal for selecting exercises
    const cancelButton = document.getElementById('cancelWorkoutBtn');               // Button for cacelling the exercise selection
    const currentWorkoutModal = document.getElementById('currentWorkoutModal');     // Modal that shows all selected exercises
    const exerciseWorkoutList = document.getElementById('exerciseWorkoutList');     // Container that holds exercise inputs
    const closeBtn = document.getElementById('closeCurrentWorkoutBtn');             // Button that closes current workout Modal
    const addExerciseBtn = document.getElementById('addMoreExercisesBtn');          // Button brings up the Exercise selection Modal
    const finishWorkoutBtn = document.getElementById('finishWorkoutBtn');           // Button that completes the current workout and saves (Not Finished)
    const startWorkoutBtn = document.getElementById('startWorkoutBtn');             // Button to start the workout with the selected exercises

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

    // Open the current workout modal function... Will dynamically generate UI based on the user's chosen exercises
    function openCurrentWorkoutModal() 
    {
            // Get the selected exercises from local storage or a empyt array will be used
            const selectedExercises = JSON.parse(localStorage.getItem('selectedExercises')) || [];
            
            // Clear previous content in the UI
            exerciseWorkoutList.innerHTML = '';

            // Each exercise will have a -->
            // Title
            // Sets with a field to input reps as a number
            // Add sets button
            selectedExercises.forEach((exercise) => 
            {
                const exerciseDiv = document.createElement('div');
                exerciseDiv.className = 'exercise-block';

                // Header for exercise name
                const title = document.createElement('h3');
                title.textContent = exercise;
                exerciseDiv.appendChild(title);

                // Container for sets input --> this is the reps
                const setsContainer = document.createElement('div');
                setsContainer.className = 'sets-container';

                // Button to add more sets
                const addSetBtn = document.createElement('button');

                // If the button is clicked, an input for reps will appear
                addSetBtn.textContent = '+ Add Set';
                addSetBtn.addEventListener('click', () => {
                    const setInput = document.createElement('input');
                    setInput.type = 'number';
                    setInput.placeholder = 'Reps';
                    setsContainer.appendChild(setInput);

                    // If data was already inputted, restore it
                    if (repData[exercise]) {
                        const index = setsContainer.querySelectorAll('input').length - 1;
                        if (repData[exercise][index]) {
                            setInput.value = repData[exercise][index];
                        }
                    }

                    // Save updated rep value on input
                    setInput.addEventListener('input', () => {
                        const value = setInput.value;
                        const index = Array.from(setsContainer.querySelectorAll('input')).indexOf(setInput);
                        if (!repData[exercise]) {
                            repData[exercise] = [];
                        }
                        repData[exercise][index] = value;
                        localStorage.setItem('repData', JSON.stringify(repData));
                    });
                });

                // Append sets container and add set button to the exercise block
                exerciseDiv.appendChild(setsContainer);
                exerciseDiv.appendChild(addSetBtn);

                // Add the complete exercise block to the workout list container
                exerciseWorkoutList.appendChild(exerciseDiv);
            });

            // Show the current workout modal with the inputs
            currentWorkoutModal.classList.add('show');

        }

        // When someone hits the button to open the exercise selection modal, Show the exercise selection modal
        openButton?.addEventListener('click', () => {
            exerciseModal.classList.add('show');
        });

        // When someone hits the cancel button, cancel showing the exercise selection modal
        cancelButton?.addEventListener('click', closeExerciseModal);

        // When someone starts their workout, save the selected exercises and open the current workout modal
        startWorkoutBtn?.addEventListener('click', () => {

            // Gets all the checked exercise from the exercise selection modal
            const selectedExercises = Array.from(
                document.querySelectorAll('#exerciseList input[type="checkbox"]:checked')
            ).map(cb => cb.value);


            // Save the selected exercises to local storage 
            localStorage.setItem('selectedExercises', JSON.stringify(selectedExercises));

            closeExerciseModal();
            console.log("Selected exercises:", selectedExercises);

            // Open the modal to log sets and reps for the exercises
            openCurrentWorkoutModal();

        });

        // When someone hits the x on the current workout modal, close the current workout modal
        closeBtn?.addEventListener('click', () => {
            currentWorkoutModal.classList.remove('show');
        });

        // When someone clicks the button to add more exercises, show the exercise selection modal again.
        addExerciseBtn?.addEventListener('click', () => {
            showExerciseModal();
        });
});