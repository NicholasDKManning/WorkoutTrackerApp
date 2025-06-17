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

    // Function to save unsaved workouts to the server after login
    async function saveLocalWorkoutsToServer(workouts) {
        try {

            const payload = workouts;

            console.log("Payload being sent to server:", payload);

            let res = await fetch('/api/workoutapi/save', {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Failed to save workouts to server.");
            await res.json();

            console.log("Unsaved workouts transferred to server.");
            // Clear the workouts from localStorage after successful save
            localStorage.removeItem('workoutHistory');
            
            // After a successful save, reload workouts from server and update UI
            res = await fetch('/api/workoutapi/userworkouts')            
            
            if (!res.ok) throw new Error("Failed to fetch workouts from server.");
            const data = await res.json();

            const historyContainer = document.getElementById('workoutHistoryContainer');
            if(historyContainer) {
                historyContainer.innerHTML = '';    // clear old data
                displayWorkoutHistory(data, historyContainer);
            } 
            
        } catch (error) {
                console.error("Error saving workouts to server:", error);        
        }
    }
    
    // Get the workout history container if on the workout history page
    const historyContainer = document.getElementById('workoutHistoryContainer');
    if (historyContainer) {
        // Workout History Page logic
        const isLoggedIn = document.getElementById("isUserLoggedIn")?.value === "true";

        // Logd from server or localStorage based on login
        if (isLoggedIn) {
            // Check if there are unsaved workouts in localStorage
            const localWorkouts = loadJSON('workoutHistory');
            if (localWorkouts && localWorkouts.length > 0) {
                console.log("Sending payload to server:", JSON.stringify(localWorkouts.flat(), null, 2));
                saveLocalWorkoutsToServer(localWorkouts.flat());
            }

            // Check if logged in
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
            const localWorkouts = loadJSON('workoutHistory') || [];
            const flattenedWorkouts = localWorkouts.flat(); // flatten one level of nesting
            console.log("Workouts loaded from localStorage (flattened):", flattenedWorkouts);
            displayWorkoutHistory(flattenedWorkouts, historyContainer);
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
            console.log("Rendering workout:", workout);
            console.log("Workout ID:", workout.id);
            const card = document.createElement('div');
            card.className = 'workout-card';

            const isLoggedIn = document.getElementById("isUserLoggedIn")?.value === "true";
            console.log("Workout ID:", workout.id);            

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
                        const weightText = set.weight ? ` @ ${set.weight} lbs` : '';
                        exerciseHTML += `<li>Set ${i + 1}: ${set.reps} reps${weightText}</li>`;
                    });
                    exerciseHTML += `</ul></li>`;
                } else {
                    exerciseHTML += `<li><strong>${ex.name}:</strong> No sets recorded</li>`;
                }
            });
            exerciseHTML += `</ul>`;

            card.innerHTML = title + start + end + exerciseHTML;

            const allowDelete = isLoggedIn || !workout.id;

            if (allowDelete) {
                // Workout Card Delete Button
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'X';
                deleteBtn.className = 'delete-btn';
                deleteBtn.addEventListener('click', () => handleDeleteWorkout(workout));
                card.appendChild(deleteBtn);
            }

            console.log("Appending delete button");
            container.appendChild(card);
        });
    }

    async function handleDeleteWorkout(workout) {
        const isLoggedIn = document.getElementById("isUserLoggedIn")?.value === "true";

        if (isLoggedIn) {
            // Server-side deletion
            const confirmed = confirm("Are you sure you want to delete this workout from your account?");
            if (!confirmed) return;

            try {
                const response = await fetch(`/api/workoutapi/delete/${workout.id}`, {
                    method: 'DELETE'
                });

                if (!response.ok) throw new Error("Failed to delete workout from server");

                showToast("Workout deleted successfully!");

                // Relod updated workout list
                const res = await fetch('/api/workoutapi/userworkouts');
                if (!res.ok) throw new Error("Failed to fetch updated workouts after deletion");
                const updated = await res.json();
                displayWorkoutHistory(updated, document.getElementById('workoutHistoryContainer'));
            } catch (err) {
                console.error("Delete failed:", err);
                alert("Error deleting workout. Try again.");
            }
        } else {
            // LocalStorage deletion
            const confirmed = confirm("Delete this workout from localStorage?");
            if (!confirmed) return;

            let workouts = loadJSON('workoutHistory') || [];
            const flattenedWorkouts = workouts.flat();
            const filteredWorkouts = flattenedWorkouts.filter(w => w.startTime !== workout.startTime);
            saveJSON('workoutHistory', filteredWorkouts);

            const container = document.getElementById('workoutHistoryContainer');
            if (container) {
                container.innerHTML = '';
                displayWorkoutHistory(filteredWorkouts, container);
            }
        }
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
                const repsInput = document.createElement('input');
                repsInput.type = 'number';
                repsInput.placeholder = 'Reps';
                repsInput.value = rep?.reps || 0;
                
                const weightInput = document.createElement('input');
                weightInput.type = 'number';
                weightInput.placeholder = 'Weight (lbs)';
                weightInput.value = rep?.weight || 0;

                repsInput.addEventListener('input', () => {
                    repData[exercise][index].reps = parseInt(repsInput.value) || 0;
                    saveJSON('repData', repData);
                });

                weightInput.addEventListener('input', () => {
                    repData[exercise][index].weight = parseInt(weightInput.value) || 0;
                    saveJSON('repData', repData);
                });
                
                setsContainer.appendChild(repsInput)
                setsContainer.appendChild(weightInput);

            });

            // Button to add more sets
            const addSetBtn = document.createElement('button');

            // If the button is clicked, an input for reps will appear
            addSetBtn.textContent = '+ Add Set';
            addSetBtn.addEventListener('click', () => {
                const repsInput = document.createElement('input');
                repsInput.type = 'number';
                repsInput.placeholder = 'Reps';
                repsInput.value = '0';

                const weightInput = document.createElement('input');
                weightInput.type = 'number';
                weightInput.placeholder = 'Weight (lbs)';
                weightInput.value = '0';

                setsContainer.appendChild(repsInput);
                setsContainer.appendChild(weightInput);

                // Makes sure repData[exercise] exists
                if (!repData[exercise]) repData[exercise] = [];

                // Push initial set data
                repData[exercise].push({ reps: 0, weight: 0});
                saveJSON('repData', repData);

                // If data was already inputted, restore it
                const index = repData[exercise].length - 1;

                repsInput.addEventListener('input', () => {
                    repData[exercise][index].reps = parseInt(repsInput.value) || 0;
                    saveJSON('repData', repData);
                });

                weightInput.addEventListener('input', () => {
                    repData[exercise][index].weight = parseInt(weightInput.value) || 0;
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
        const inputs = Array.from(block.querySelectorAll('input'));
        const sets = [];

        // Input arranged as pairs: reps input followed by weight input
        for (let i = 0; i < inputs.length; i += 2) {
            const repsValue = parseInt(inputs[i].value, 10) || 0;
            const weightValue = parseFloat(inputs[i + 1]?.value) || 0;
            sets.push({ reps: repsValue, weight: weightValue });
        }

        repData[exerciseName] = sets;
        });

        console.log("Selected exercises:", selectedExercises);
        console.log("repData at save time:", repData);

        const finishedWorkout = [
            {
                startTime: startTime,
                endTime: endTime,
                exercises: selectedExercises
                    .map(exerciseName => {
                        const sets = (repData[exerciseName] || [])
                            .map(set => ({
                                reps: set.reps || 0,
                                // If weight is missing or blank, default to 0
                                weight: set.weight || 0
                            }));

                        if (sets.length === 0) return null;

                        return { name: exerciseName, sets };
                    })
                    .filter(exercise => exercise.sets.length > 0)
            }
        ];

        // Read whether the user is signed in
        const isLoggedIn = document.getElementById("isUserLoggedIn")?.value === "true";

        if (isLoggedIn) {
            // SEND TO BACKEND CONTROLLER
            console.log("User is logged in - send to backend API.");
            
            try {
                console.log("Sending workout payload:", JSON.stringify(finishedWorkout, null, 2));
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
                    console.error('Validation errors:', errorData.errors);
                    alert(`Failed to save workout: ${errorData.message || errorData.title}`);


                    // Fallback to saving to localStorage
                    const allWorkouts = loadJSON('workoutHistory');
                    allWorkouts.push(finishedWorkout);
                    localStorage.setItem('workoutHistory', JSON.stringify(allWorkouts));
                }
            } catch (error) {
                console.error('Error:', error);
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