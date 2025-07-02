console.log("JS is running!");

function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.classList.add('toast', 'update-toast');
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => {
            if (toast.parentNode) {
                document.body.removeChild(toast);
            }
        }, 500);
    }, duration);
}

function loadJSON(key, fallback = []) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch (error) {
        console.error(`Error parsing localStorage key "${key}":`, error);
        localStorage.removeItem(key);   // Clears corrupted data
        return fallback;
    }
}

function saveJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

document.addEventListener('DOMContentLoaded', function () {
    // Show "Successfully updated!" toast after reload
    if (localStorage.getItem('showUpdatedToast') === 'true') {
        localStorage.removeItem('showUpdatedToast');
        showToast("Successfully updated!");
    }

    const updateBtn = document.getElementById('checkForUpdateBtn');
    if (updateBtn && 'serviceWorker' in navigator) {
        updateBtn.addEventListener('click', async () => {
            // 1. Workout check
            if (localStorage.getItem('workoutStartTime')) {
                const proceed = confirm(
                    "If you've started a workout and haven't finished, please complete your workout first before updating. Do you still want to check for an update?"
                );
                if (!proceed) return;
            }

            // 2. Remove any existing toasts and show "Checking..." toast
            document.querySelectorAll('.toast.update-toast').forEach(t => t.remove());
            const checkingToast = document.createElement('div');
            checkingToast.className = 'toast update-toast';
            checkingToast.textContent = 'Checking for updates...';
            document.body.appendChild(checkingToast);

            // 3. Check for update
            const reg = await navigator.serviceWorker.getRegistration();
            if (reg) {
                reg.update().then(() => {
                    checkingToast.remove();
                    if (reg.waiting) {
                        // 4a. Show update available toast
                        document.querySelectorAll('.toast.update-toast').forEach(t => t.remove());
                        const updateToast = document.createElement('div');
                        updateToast.className = 'toast update-toast';
                        updateToast.textContent = 'A new version is available. Click to update!';
                        updateToast.addEventListener('click', () => {
                            localStorage.setItem('showUpdatedToast', 'true');
                            reg.waiting.postMessage({ action: 'skipWaiting' });
                            navigator.serviceWorker.addEventListener('controllerchange', () => {
                                showToast("Updating to the latest version...", 1000);
                                setTimeout(() => {
                                    window.location.reload();
                                }, 300);
                            });
                            updateToast.remove();
                        });
                        document.body.appendChild(updateToast);
                    } else {
                        // 4b. Show up-to-date toast
                        document.querySelectorAll('.toast.update-toast').forEach(t => t.remove());
                        showToast("You're already up to date!", 4000);
                    }
                });
            } else {
                checkingToast.remove();
                alert('Service worker not registered.');
            }
        });
    }
});