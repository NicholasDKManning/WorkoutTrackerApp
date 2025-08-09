(function() {
    if (window.startWorkoutInitialized) {
        console.log("Start Workout JS already initialized");
        return
    }
    window.startWorkoutInitialized = true;

    document.addEventListener('DOMContentLoaded', function () {
        const openButton = document.getElementById('openExerciseList');
        if (!openButton) return;

        let workoutFinished = false;
        let repData = loadJSON('repData');
        let setData = {};
        let timedExerciseData = {};

        const exerciseModal = document.getElementById('exerciseModal');
        const cancelButton = document.getElementById('cancelWorkoutBtn');
        const currentWorkoutModal = document.getElementById('currentWorkoutModal');
        const exerciseWorkoutList = document.getElementById('exerciseWorkoutList');
        const closeBtn = document.getElementById('closeCurrentWorkoutBtn');
        const addExerciseBtn = document.getElementById('addMoreExercisesBtn');
        const finishWorkoutBtn = document.getElementById('finishWorkoutBtn');
        const startWorkoutBtn = document.getElementById('startWorkoutBtn');

        function closeExerciseModal() {
            exerciseModal.classList.remove('show');
            exerciseModal.classList.add('hidden');
        }
        function showExerciseModal() {
            exerciseModal.classList.add('show');
            exerciseModal.classList.remove('hidden');
        }

        function openCurrentWorkoutModal() {
            const selectedExercises = loadJSON('selectedExercises');
            exerciseWorkoutList.innerHTML = '';

            const instruction = document.createElement('div');
            instruction.className = 'reorder-instruction';
            instruction.textContent = 'Click/Tap & hold to drag. Drag upward/downward over another exercise to reorder.';
            exerciseWorkoutList.appendChild(instruction);

            const SCROLL_EDGE_THRESHOLD = 80; // px
            const SCROLL_SPEED = 6; // px per frame

            let scrollInterval = null;

            exerciseWorkoutList.addEventListener('dragover', (e) => {
                const bounding = exerciseWorkoutList.getBoundingClientRect();

                const scrollUp = e.clientY < bounding.top + SCROLL_EDGE_THRESHOLD;
                const scrollDown = e.clientY > bounding.bottom - SCROLL_EDGE_THRESHOLD;

                if (scrollUp) {
                    if (!scrollInterval) {
                        scrollInterval = setInterval(() => {
                            exerciseWorkoutList.scrollBy(0, -SCROLL_SPEED);
                        }, 16); // roughly 60fps
                    }
                } else if (scrollDown) {
                    if (!scrollInterval) {
                        scrollInterval = setInterval(() => {
                            exerciseWorkoutList.scrollBy(0, SCROLL_SPEED);
                        }, 16);
                    }
                } else {
                    clearInterval(scrollInterval);
                    scrollInterval = null;
                }
            });

            exerciseWorkoutList.addEventListener('dragleave', () => {
                clearInterval(scrollInterval);
                scrollInterval = null;
            });

            exerciseWorkoutList.addEventListener('drop', () => {
                clearInterval(scrollInterval);
                scrollInterval = null;
            });

            selectedExercises.forEach((exercise) => {
                const exerciseDiv = document.createElement('div');
                exerciseDiv.className = 'exercise-block';
                const title = document.createElement('h3');
                title.textContent = exercise;

                exerciseDiv.id = 'exerciseDivId'
                exerciseDiv.draggable = 'true'
                exerciseDiv.dataset.name = exercise;
                exerciseDiv.addEventListener('dragstart', (event) => {
                    event.dataTransfer.setData('text/plain', exercise);
                    event.target.style.opacity = '0.5';
                });
                
                exerciseDiv.addEventListener('dragover', (event) => {
                    event.preventDefault();
                });
                
                exerciseDiv.addEventListener('drop', (event) => {
                    const draggedName = event.dataTransfer.getData('text/plain');
                    const targetName = event.currentTarget.dataset.name;
                    const selectedExercises = loadJSON('selectedExercises');
                    const fromIndex = selectedExercises.indexOf(draggedName);
                    const toIndex = selectedExercises.indexOf(targetName);
                    const [movedExercise] = selectedExercises.splice(fromIndex, 1);
                    selectedExercises.splice(toIndex, 0, movedExercise);
                    saveJSON('selectedExercises', selectedExercises);
                    openCurrentWorkoutModal();
                });

                exerciseDiv.appendChild(title);
                const setsContainer = document.createElement('div');
                setsContainer.className = 'sets-container';
                const savedReps = repData[exercise] || [];
                savedReps.forEach(rep => {
                    const repsInput = document.createElement('input');
                    repsInput.type = 'number';
                    repsInput.placeholder = 'Reps';
                    repsInput.value = (typeof rep?.reps === 'number' && rep.reps > 0) ? rep.reps : '';
                    const weightInput = document.createElement('input');
                    weightInput.type = 'number';
                    weightInput.placeholder = 'Weight (lbs)';
                    weightInput.value = (typeof rep?.weight === 'number' && rep.weight > 0) ? rep.weight : '';
                    repsInput.addEventListener('input', () => {
                        rep.reps = repsInput.value === '' ? null : parseInt(repsInput.value);
                        saveJSON('repData', repData);
                    });
                    weightInput.addEventListener('input', () => {
                        rep.weight = weightInput.value === '' ? null : parseInt(weightInput.value);
                        saveJSON('repData', repData);
                    });
                    setsContainer.appendChild(repsInput);
                    setsContainer.appendChild(weightInput);
                });
                const addSetBtn = document.createElement('button');
                addSetBtn.textContent = '+ Add Set';
                addSetBtn.addEventListener('click', () => {
                    const repsInput = document.createElement('input');
                    repsInput.type = 'number';
                    repsInput.placeholder = 'Reps';
                    repsInput.value = '';
                    const weightInput = document.createElement('input');
                    weightInput.type = 'number';
                    weightInput.placeholder = 'Weight (lbs)';
                    weightInput.value = '';
                    setsContainer.appendChild(repsInput);
                    setsContainer.appendChild(weightInput);
                    if (!repData[exercise]) repData[exercise] = [];
                    const newSet = { reps: null, weight: null };
                    repData[exercise].push(newSet);
                    saveJSON('repData', repData);
                    repsInput.addEventListener('input', () => {
                        newSet.reps = repsInput.value === '' ? null : parseInt(repsInput.value);
                        saveJSON('repData', repData);
                    });
                    weightInput.addEventListener('input', () => {
                        newSet.weight = weightInput.value === '' ? null : parseInt(weightInput.value);
                        saveJSON('repData', repData);
                    });
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
            const startTime = new Date().toISOString();
            localStorage.setItem('workoutStartTime', startTime);
            const selectedExercises = Array.from(
                document.querySelectorAll('#exerciseList input[type="checkbox"]:checked')
            ).map(cb => cb.value);
            localStorage.setItem('selectedExercises', JSON.stringify(selectedExercises));
            closeExerciseModal();
            openCurrentWorkoutModal();
        });

        closeBtn?.addEventListener('click', () => {
            currentWorkoutModal.classList.remove('show');
        });

        const finishWorkoutHandler = async (event) => {
            event?.preventDefault();
            if (workoutFinished) return;
            workoutFinished = true;
            const endTime = new Date().toISOString();
            const startTime = localStorage.getItem('workoutStartTime');
            if (!startTime) {
                alert("No start time found. You must start a workout first");
                return;
            }
            const selectedExercises = loadJSON('selectedExercises');
            const repData = loadJSON('repData');
            document.querySelectorAll('.exercise-block').forEach(block => {
                const exerciseName = block.querySelector('h3').textContent;
                const inputs = Array.from(block.querySelectorAll('input'));
                const sets = [];
                for (let i = 0; i < inputs.length; i += 2) {
                    const repsValue = parseInt(inputs[i].value, 10) || 0;
                    const weightValue = parseFloat(inputs[i + 1]?.value) || 0;
                    sets.push({ reps: repsValue, weight: weightValue });
                }
                repData[exerciseName] = sets;
            });
            const finishedWorkout = {
                startTime: startTime,
                endTime: endTime,
                exercises: selectedExercises.map(exerciseName => {
                    const sets = (repData[exerciseName] || []).map(set => ({
                        reps: set.reps ?? 0,
                        weight: set.weight ?? 0
                    }));
                    return { name: exerciseName, sets };
                })
            };
            const isLoggedIn = document.getElementById("isUserLoggedIn")?.value === "true";
            if (isLoggedIn) {
                try {
                    const response = await fetch('/api/workoutapi/save', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify([finishedWorkout])
                    });
                    if (response.ok) {
                        const data = await response.json();
                        alert(data.message || "Workout saved successfully!");
                    } else {
                        const errorData = await response.json();
                        alert(`Failed to save workout: ${errorData.message || errorData.title}`);
                        const allWorkouts = loadJSON('workoutHistory');
                        allWorkouts.push(finishedWorkout);
                        localStorage.setItem('workoutHistory', JSON.stringify(allWorkouts));
                    }
                } catch (error) {
                    alert(`Error saving workout: ${error.message}`);
                    const allWorkouts = loadJSON('workoutHistory');
                    allWorkouts.push(finishedWorkout);
                    localStorage.setItem('workoutHistory', JSON.stringify(allWorkouts));
                }
            } else {
                const allWorkouts = loadJSON('workoutHistory');
                allWorkouts.push(finishedWorkout);
                localStorage.setItem('workoutHistory', JSON.stringify(allWorkouts));
            }
            localStorage.removeItem('repData');
            localStorage.removeItem('selectedExercises');
            localStorage.removeItem('workoutStartTime');
            exerciseWorkoutList.innerHTML = '';
            currentWorkoutModal.classList.remove('show');
            setTimeout(() => workoutFinished = false, 2000);
        };

        if (finishWorkoutBtn && !finishWorkoutBtn.dataset.listenerAttached) {
            finishWorkoutBtn.addEventListener('click', finishWorkoutHandler);
        finishWorkoutBtn.dataset.listenerAttached = true;
        }

        addExerciseBtn?.addEventListener('click', () => {
            showExerciseModal();
        });

        function updateViewportHeight() {
            document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
        }
        window.addEventListener('resize', updateViewportHeight);
        window.addEventListener('load', updateViewportHeight);
    });
})();
