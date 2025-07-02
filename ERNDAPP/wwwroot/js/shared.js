console.log("JS is running!");

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

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(reg => {
                console.log('Service Worker registered:', reg.scope);

                // Listen for updates
                if (reg.waiting) {
                    promptUserToRefresh(reg.waiting);
                }

                reg.addEventListener('updatefound', () => {
                    const newWorker = reg.installing;
                    newWorker?.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            promptUserToRefresh(newWorker);
                        }
                    });
                });
            })
            .catch(err => {
                console.error('Service Worker registration failed:', err);
            });
    });
}

function promptUserToRefresh(worker) {

    console.log('[SW] promptUserToRefresh called');

    // Check if a workout is in progress
    const isInWorkout = !!localStorage.getItem('workoutStartTime');
    if (isInWorkout) {
        console.log('Update available, but user is in a workout. Will defer refresh.');
        return;
    }

    console.log('[SW] Showing update toast');

    const updateToast = document.createElement('div');
    updateToast.className = 'toast update-toast';
    updateToast.textContent = 'A new version of ERND is available. Tap to refresh.';
    updateToast.addEventListener('click', () => {
        console.log('[SW] User clicked update toast -> skipWaiting triggered');
        worker.postMessage({ action: 'skipWaiting' });
    });

    document.body.appendChild(updateToast);

    // Remove it after some time
    setTimeout(() => {
        updateToast.classList.add('hide');
        setTimeout(() => updateToast.remove(), 1000);
    }, 50000);
}

// Listen for the new service worker to take ocntrol, then reload
navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
});