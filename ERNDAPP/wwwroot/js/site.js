// Wait until the DOM fully loads before javascript code gets ran
// Workouts History Container Code
document.addEventListener('DOMContentLoaded', function () {

    // Workout finished flag will be set to false
    let workoutFinished = false;

    function loadJSON(key, fallback = []) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : fallback;
        } catch (error) {
            console.error(`Error parsing localStorage key "${key}":`, error);
            return fallback;
        }
    }

    function saveJSON(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    // Get the workout history container if on the workout history page
    const historyContainer = document.getElementById('workoutHistoryContainer');
    if (!historyContainer) {
        // Workout History Page logic
        const workouts = loadJSON('workoutHistory');
        console.log("Workouts loaded from localStorage:", workouts);

        // If there are no workouts that have been saved, show this message:
        if (workouts.length === 0) {
            historyContainer.innerHTML = '<p>No Completed Workouts Have Been Logged Yet.</p>';
            return;
        }

        // Loop through each saved workout and show it
        console.log("Loading workouts...")
        workouts.forEach((workout, index) => {
            const card = document.createElement('div'); // Create a workout card container
            card.className = 'workout-card';            // Apply styling class 

            // Checks for valid start time and end time
            const startTimeText = workout.startTime ? new Date(workout.startTime).toLocaleString() : "No Start Time";
            const endTimeText = workout.endTime ? new Date(workout.endTime).toLocaleString() : "No End Time";

            // Format and insert the workout details
            const title = `<h3>Workout #${index + 1}</h3>`;
            const startDate = `<p><strong>Date:</strong> ${new Date(workout.startTime).toLocaleDateString()}</p>`;
            const endDate = `<p><strong>Date:</strong> ${new Date(workout.startTime).toLocaleDateString()}</p>`;
            const start = `<p><strong>Start:</strong> ${new Date(workout.startTime).toLocaleTimeString()}</p>`;
            const end = `<p><strong>End:</strong> ${new Date(workout.endTime).toLocaleTimeString()}</p>`;

            // List the exercises and their sets
            let exerciseHTML = '<ul>';
            workout.exercises.forEach(ex => {
                exerciseHTML += `<li><strong>${ex.name}:</strong> ${ex.sets.join(', ')}</li>`;
            });
            exerciseHTML += `</ul>`;

            // Combine everything into the card
            card.innerHTML = title + startDate + start + end + exerciseHTML;

            // Add the card to the page
            historyContainer.appendChild(card);
        });

        return; // Don't run StartWorkout logic on workout history page
    }

    // If not on the workout history page
    const openButton = document.getElementById('openExerciseList');
    if (!openButton) 
        return; // Exit early when not on the StartWorkout page
    
    // Start Workout Page
    // Butten to open the exercise selection modal
    let repData = loadJSON('repData');
    let setData = {};
    let timedExerciseData = {};
    
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
        const selectedExercises = loadJSON('selectedExercises');
        
        // Clear previous content in the UI
        exerciseWorkoutList.innerHTML = '';

        // Each exercise will have a -->
        // Title
        // Sets with a field to input reps as a number
        // Add sets button
        selectedExercises.forEach((exercise) => {
            const exerciseDiv = document.createElement('div');
            exerciseDiv.className = 'exercise-block';

            // Header for exercise name
            const title = document.createElement('h3');
            title.textContent = exercise;
            exerciseDiv.appendChild(title);

            // Container for sets input --> this is the reps
            const setsContainer = document.createElement('div');
            setsContainer.className = 'sets-container';

            // Automatically create inputs for each saved set
            const savedReps = repData[exercise] || [];
            savedReps.forEach((rep, index) => {
                const setInput = document.createElement('input');
                setInput.type = 'number';
                setInput.placeholder = 'Reps';
                setInput.value = rep || 0;  // Defaults the input value of reps to 0 if left empty

                // Save on input
                setInput.addEventListener('input', () => {
                    const val = setInput.value || "0";
                    repData[exercise][index] = val;
                    localStorage.setItem('repData', JSON.stringify(repData));
                });

                setsContainer.appendChild(setInput);

            });

            // Button to add more sets
            const addSetBtn = document.createElement('button');

            // If the button is clicked, an input for reps will appear
            addSetBtn.textContent = '+ Add Set';
            addSetBtn.addEventListener('click', () => {
                const setInput = document.createElement('input');
                setInput.type = 'number';
                setInput.placeholder = 'Reps';
                setInput.value = '0';   // Default amount
                setsContainer.appendChild(setInput);

                // If data was already inputted, restore it
                const index = setsContainer.querySelectorAll('input').length - 1;
                if (!repData[exercise]) repData[exercise] = [];

                // Save updated rep value on input
                setInput.addEventListener('input', () => {
                    const value = setInput.value || "0";
                    const index = Array.from(setsContainer.querySelectorAll('input')).indexOf(setInput);
                    repData[exercise].push(value);
                    saveJSON('repData', repData);
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

        // Capture the start time of the workout after hitting start workout
        const startTime = new Date().toISOString();
        localStorage.setItem('workoutStartTime', startTime);
        console.log("Start time set to:", startTime);

        // Gets all the checked exercise from the exercise selection modal
        const selectedExercises = Array.from(
            document.querySelectorAll('#exerciseList input[type="checkbox"]:checked')
        ).map(cb => cb.value);


        // Save the selected exercises to local storage 
        localStorage.setItem('selectedExercises', JSON.stringify(selectedExercises));

        closeExerciseModal();

        // Open the modal to log sets and reps for the exercises
        openCurrentWorkoutModal();
    });

    // When someone hits the x on the current workout modal, close the current workout modal
    closeBtn?.addEventListener('click', () => {
        currentWorkoutModal.classList.remove('show');
    });

    finishWorkoutBtn?.addEventListener('click', () => {

        if (workoutFinished) return;
        workoutFinished = true;

        const endTime = new Date().toISOString();
        const startTime = localStorage.getItem('workoutStartTime');
        
        // Finish button clicked and retrieve the workout start time checker
        console.log("Finish button clicked. Retrieved startTime:", startTime);

        // Prevent invalid date workout from being logged
        if (!startTime) {
            alert("No start time found. You must start a workout first");
            return;
        }

        const selectedExercises = loadJSON('selectedExercises');
        const repData = loadJSON('repData');

        const finishedWorkout = {
            startTime,
            endTime,
            exercises: selectedExercises.map(ex => ({
                name: ex,
                sets: repData[ex] || []
                
            }))
        };
        
        const allWorkouts = loadJSON('workoutHistory');
        allWorkouts.push(finishedWorkout);
        localStorage.setItem('workoutHistory', JSON.stringify(allWorkouts));

        // Cleanup
        localStorage.removeItem('repData');
        localStorage.removeItem('selectedExercises');
        localStorage.removeItem('workoutStartTime');
        exerciseWorkoutList.innerHTML = '';
        currentWorkoutModal.classList.remove('show');

        // Workout finished flag reset
        setTimeout(() => workoutFinished = false, 2000);
    });

    // When someone clicks the button to add more exercises, show the exercise selection modal again.
    addExerciseBtn?.addEventListener('click', () => {
        showExerciseModal();
    });
});