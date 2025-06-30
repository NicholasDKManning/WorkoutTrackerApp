document.addEventListener('DOMContentLoaded', function () {
    // Updates Modal
    const openUpdatesButton = document.getElementById('openUpdatesList');
    const updatesListModal = document.getElementById('updatesModal');
    const cancelUpdatesButton = document.getElementById('cancelUpdatesBtn');

    if (openUpdatesButton && updatesListModal) {
        function showUpdatesModal() {
            updatesListModal.classList.add('show');
        }
        function closeUpdatesModal() {
            updatesListModal.classList.remove('show');
        }
        openUpdatesButton.addEventListener('click', showUpdatesModal);
        cancelUpdatesButton?.addEventListener('click', closeUpdatesModal);
    }

    // iOS How To Modal
    const openHowToButton_ios = document.getElementById('openHowToList-ios');
    const howToModal_ios = document.getElementById('howToModal-ios');
    const cancelHowToButton_ios = document.getElementById('cancelHowToBtn-ios');

    if (openHowToButton_ios && howToModal_ios) {
        function showHowToModal_ios() {
            howToModal_ios.classList.add('show');
        }
        function closeHowToModal_ios() {
            howToModal_ios.classList.remove('show');
        }
        openHowToButton_ios.addEventListener('click', showHowToModal_ios);
        cancelHowToButton_ios?.addEventListener('click', closeHowToModal_ios);
    }

    // Android How To Modal
    const openHowToButton_android = document.getElementById('openHowToList-android');
    const howToModal_android = document.getElementById('howToModal-android');
    const cancelHowToButton_android = document.getElementById('cancelHowToBtn-android');

    if (openHowToButton_android && howToModal_android) {
        function showHowToModal_android() {
            howToModal_android.classList.add('show');
        }
        function closeHowToModal_android() {
            howToModal_android.classList.remove('show');
        }
        openHowToButton_android.addEventListener('click', showHowToModal_android);
        cancelHowToButton_android?.addEventListener('click', closeHowToModal_android);
    }
});
