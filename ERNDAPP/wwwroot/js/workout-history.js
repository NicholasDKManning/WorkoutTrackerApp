document.addEventListener('DOMContentLoaded', function () {
    const historyContainer = document.getElementById('workoutHistoryContainer');
    if (!historyContainer) return;

    async function saveLocalWorkoutsToServer(workouts) {
        try {
            const payload = workouts.flat();
            let res = await fetch('/api/workoutapi/save', {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Failed to save workouts to server.");
            await res.json();

            saveJSON('workoutHistory', payload);
            localStorage.removeItem('workoutHistory');

            res = await fetch('/api/workoutapi/userworkouts');
            if (!res.ok) throw new Error("Failed to fetch workouts from server.");
            const data = await res.json();

            historyContainer.innerHTML = '';
            displayWorkoutHistory(data, historyContainer);
        } catch (error) {
            console.error("Error saving workouts to server:", error);
        }
    }

    function displayWorkoutHistory(workouts, container) {
        if (Array.isArray(workouts[0])) workouts = workouts.flat();
        if (!workouts || workouts.length === 0) {
            container.innerHTML = '<p>No Completed Workouts Have Been Logged Yet.</p>';
            return;
        }

        // Sort completed workouts
        workouts.sort((mostRecentWorkout, oldestWorkout) => {
            const mostRecentWorkoutTime = new Date(mostRecentWorkout.startTime || 0).getTime();
            const oldestWorkoutTime = new Date(oldestWorkout.startTime || 0).getTime();
            return oldestWorkoutTime - mostRecentWorkoutTime; // Order from most recent to oldest
        });

        workouts.forEach((workout, index) => {
            const card = document.createElement('div');
            card.className = 'workout-card';
            const isLoggedIn = document.getElementById("isUserLoggedIn")?.value === "true";
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
                        const setNum = i + 1;
                        const weightText = set.weight ? ` @ ${set.weight} lbs` : '';
                        exerciseHTML += `<li>Set ${setNum}: ${set.reps} reps${weightText}</li>`;
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
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'X';
                deleteBtn.className = 'delete-btn';
                deleteBtn.addEventListener('click', () => handleDeleteWorkout(workout));
                card.appendChild(deleteBtn);
            }
            container.appendChild(card);
        });
    }

    async function handleDeleteWorkout(workout) {
        const isLoggedIn = document.getElementById("isUserLoggedIn")?.value === "true";
        if (isLoggedIn) {
            const confirmed = confirm("Are you sure you want to delete this workout from your account?");
            if (!confirmed) return;
            try {
                const response = await fetch(`/api/workoutapi/delete/${workout.id}`, { method: 'DELETE' });
                if (!response.ok) throw new Error("Failed to delete workout from server");
                showToast("Workout deleted successfully!");
                const res = await fetch('/api/workoutapi/userworkouts');
                if (!res.ok) throw new Error("Failed to fetch updated workouts after deletion");
                const updated = await res.json();
                displayWorkoutHistory(updated, document.getElementById('workoutHistoryContainer'));
            } catch (err) {
                console.error("Delete failed:", err);
                alert("Error deleting workout. Try again.");
            }
        } else {
            const confirmed = confirm("Delete this workout from localStorage?");
            if (!confirmed) return;
            let workouts = loadJSON('workoutHistory') || [];
            const filteredWorkouts = workouts.filter(w => w.startTime !== workout.startTime);
            saveJSON('workoutHistory', filteredWorkouts);
            const container = document.getElementById('workoutHistoryContainer');
            if (container) {
                container.innerHTML = '';
                displayWorkoutHistory(filteredWorkouts, container);
            }
        }
    }

    // Main logic for loading history
    const isLoggedIn = document.getElementById("isUserLoggedIn")?.value === "true";
    if (isLoggedIn) {
        const localWorkouts = loadJSON('workoutHistory');
        if (localWorkouts && localWorkouts.length > 0) {
            saveLocalWorkoutsToServer(localWorkouts);
        }
        fetch('/api/workoutapi/userworkouts')
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch workouts from server.");
                return res.json();
            })
            .then(data => {
                displayWorkoutHistory(data, historyContainer);
            })
            .catch(error => {
                console.error("Error loading workouts from server:", error);
                historyContainer.innerHTML = '<p>Could not load your workouts. Try again later.</p>';
            });
    } else {
        const localWorkouts = loadJSON('workoutHistory') || [];
        displayWorkoutHistory(localWorkouts, historyContainer);
    }
});