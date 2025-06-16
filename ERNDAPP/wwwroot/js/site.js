console.log("Site.JS is running!");

function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.classList.add('toast');
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => document.body.removeChild(toast), 500);
    }, duration);
}

if (typeof window.workoutListenerAttached === 'undefined') {
    window.workoutListenerAttached = false;
}

document.addEventListener('DOMContentLoaded', function () {

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
    if (historyContainer) {
        // Workout History Page logic
        const isLoggedIn = document.getElementById("isUserLoggedIn")?.value === "true";
        console.log("User is logged in:", isLoggedIn);

        // Logd from server or localStorage based on login
        if (isLoggedIn) {
            fetch('/api/workoutapi/userworkouts')
                .then(res => {
                    if (!res.ok) throw new Error("Failed to fetch workouts from server.");
                    return res.json();
                })
                .then(data => {
                    console.log("Workouts loaded from server:", data);
                    displayWorkoutHistory(data, historyContainer);
                })
                .catch(error => {
                    console.error("Error loading workouts from server:", error);
                    historyContainer.innerHTML = '<p>Could not load your workouts. Try again later.</p>';
                });
        } else {
            const localWorkouts = loadJSON('workoutHistory');
            console.log("Workouts loaded from localStorage:", localWorkouts);
            displayWorkoutHistory(localWorkouts, historyContainer);
        }

        return; // Don't run StartWorkout logic on workout history page
    }

    const onStartWorkoutPage = !!document.getElementById('openExerciseList');
    if (!onStartWorkoutPage) return;

    function displayWorkoutHistory(workouts, container) {
        if (!workouts || workouts.length === 0) {
            container.innerHTML = '<p>No Completed Workouts Have Been Logged Yet.</p>';
            return;
        }

        workouts.forEach((workout, index) => {
            const card = document.createElement('div');
            card.className = 'workout-card';

            const title = `<h3>Workout #${index + 1}</h3>`;
            const startTimeText = workout.startTime ? new Date(workout.startTime).toLocaleString() : "No Start Time";
            const endTimeText = workout.endTime ? new Date(workout.endTime).toLocaleString() : "No End Time";
            const start = `<p><strong>Start:</strong> ${startTimeText}</p>`;
            const end = `<p><strong>End:</strong> ${endTimeText}</p>`;

            let exerciseHTML = '<ul>';
            workout.exercises.forEach(ex => {
                if (Array.isArray(ex.sets)) {
                    exerciseHTML += `<li><strong>${ex.name}</strong><ul>`;
                    ex.sets.forEach((set, i) => {
                        exerciseHTML += `<li>Set ${i + 1}: ${set.reps} reps</li>`;
                    });
                    exerciseHTML += `</ul></li>`;
                } else {
                    exerciseHTML += `<li><strong>${ex.name}:</strong> No sets recorded</li>`;
                }
            });
            exerciseHTML += `</ul>`;

            card.innerHTML = title + start + end + exerciseHTML;
            container.appendChild(card);
        });
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
                    repData[exercise][index] = value;
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

    let workoutHandlerTriggerCount = 0;

    const finishWorkoutHandler = async (event) => {
        event?.preventDefault();    // Stop form submission fi button is inside a form
        
        // workoutHandlerTriggerCount++;
        // console.log(`Finish workout handler called ${workoutHandlerTriggerCount} times`);

        if (workoutFinished) return;
        workoutFinished = true;

        const endTime = new Date().toISOString();
        const startTime = localStorage.getItem('workoutStartTime');        
        // Prevent invalid date workout from being logged
        if (!startTime) {
            alert("No start time found. You must start a workout first");
            return;
        }

        const selectedExercises = loadJSON('selectedExercises');
        const repData = loadJSON('repData');

        // Update repData from the DOM before saving
        document.querySelectorAll('.exercise-block').forEach(block => {
        const exerciseName = block.querySelector('h3').textContent;
        const repsAndWeight = Array.from(block.querySelectorAll('input')).map(input => input.value || "0");
        repData[exerciseName] = repsAndWeight;
        });
        saveJSON('repData', repData);

        console.log("Selected exercises:", selectedExercises);
        console.log("repData at save time:", repData);

        const finishedWorkout = {
            startTime,
            endTime,
            exercises: selectedExercises
                .map(exerciseName => {
                    const sets = (repData[exerciseName] || [])
                        .filter(s => s && s.trim() !== '')  // remove empty strings
                        .map(s => {
                            const [repsString, weightString] = s.split('@').map(x => x?.trim());    // split the string --> 10 reps @ 135 lbs
                            const reps = parseInt(repsString, 10) || 0; // Convert reps to an integert, defaults to 0 if invalid
                            const weight = weightString ? parseFloat(weightString) : 0; // Convert weight to float, default to 0
                            return { reps, weight };
                        });

                    return { name: exerciseName, sets };
                })                    
                .filter(exercise => exercise.sets.length > 0)
        };

        // Read whether the user is signed in
        const isLoggedIn = document.getElementById("isUserLoggedIn")?.value === "true";

        if (isLoggedIn) {
            // SEND TO BACKEND CONTROLLER
            console.log("User is logged in - send to backend API.");
            
            try {
                console.log("Sending workout pkayload:", JSON.stringify(finishedWorkout, null, 2));
                const response = await fetch('/api/workoutapi/save', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(finishedWorkout)
                });

                if (response.ok) {
                    const data = await response.json();
                    alert(data.message || "Workout saved successfully!");
                } else {
                    const errorData = await response.json();
                    alert(`Failed to save workout: ${errorData.message || response.statusText}`);
                    console.error('Error data from backend:', errorData);

                    // Fallback to saving to localStorage
                    const allWorkouts = loadJSON('workoutHistory');
                    allWorkouts.push(finishedWorkout);
                    localStorage.setItem('workoutHistory', JSON.stringify(allWorkouts));
                }
            } catch (error) {
                alert(`Error saving workout: ${error.message}`);

                // Fall back to saving to localStorage
                const allWorkouts = loadJSON('workoutHistory');
                allWorkouts.push(finishedWorkout);
                localStorage.setItem('workoutHistory', JSON.stringify(allWorkouts));
            }
        } else {
            // Save to localStorage if user not logged in
            const allWorkouts = loadJSON('workoutHistory');
            allWorkouts.push(finishedWorkout);
            localStorage.setItem('workoutHistory', JSON.stringify(allWorkouts));
        }

        // Cleanup
        localStorage.removeItem('repData');
        localStorage.removeItem('selectedExercises');
        localStorage.removeItem('workoutStartTime');
        exerciseWorkoutList.innerHTML = '';
        currentWorkoutModal.classList.remove('show');

        // Workout finished flag reset
        setTimeout(() => workoutFinished = false, 2000);
    };

    if (finishWorkoutBtn && !window.workoutListenerAttached) {
        finishWorkoutBtn.addEventListener('click', finishWorkoutHandler);
        window.workoutListenerAttached = true;
    }
    
    // When someone clicks the button to add more exercises, show the exercise selection modal again.
    addExerciseBtn?.addEventListener('click', () => {
        showExerciseModal();
    });
});