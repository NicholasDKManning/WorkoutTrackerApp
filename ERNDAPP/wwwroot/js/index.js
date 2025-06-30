document.addEventListener('DOMContentLoaded', function () {
    const openUpdatesButton = document.getElementById('openUpdatesList');
    const updatesListModal = document.getElementById('updatesModal');
    const cancelUpdatesButton = document.getElementById('cancelUpdatesBtn');
    if (!openUpdatesButton || !updatesListModal) return;

    function showUpdatesModal() {
        updatesListModal.classList.add('show');
    }
    function closeUpdatesModal() {
        updatesListModal.classList.remove('show');
    }
    openUpdatesButton.addEventListener('click', showUpdatesModal);
    cancelUpdatesButton?.addEventListener('click', closeUpdatesModal);
});