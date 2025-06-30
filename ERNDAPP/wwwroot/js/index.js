document.addEventListener('DOMContentLoaded', function () {
    // Updates List Modal
    const openUpdatesButton = document.getElementById('openUpdatesList');
    const updatesListModal = document.getElementById('updatesModal');
    const cancelUpdatesButton = document.getElementById('cancelUpdatesBtn');
    
    // IOS How to install Modal
    const openHowToButton_ios = document.getElementById('openHowToList-ios');
    const howToModal_ios = document.getElementById('howToModal-ios');
    const cancelHowToButton_ios = document.getElementById('cancelHowToBtn-ios');

    // ANDROID How to install Modal
    const openHowToButton_android = document.getElementById('openHowToList-android');
    const howToModal_android = document.getElementById('howToModal-android');
    const cancelHowToButton_android = document.getElementById('cancelHowToBtn-android');

    // Updates Logic
    if (!openUpdatesButton || !updatesListModal) return;

    function showUpdatesModal() {
        updatesListModal.classList.add('show');
    }
    function closeUpdatesModal() {
        updatesListModal.classList.remove('show');
    }
    openUpdatesButton.addEventListener('click', showUpdatesModal);
    cancelUpdatesButton?.addEventListener('click', closeUpdatesModal);
    
    // How to install Logic for IOS
    if (!openHowToButton_ios || !howToModal_ios) return;

    function showHowToModal_ios() {
        howToModal_ios.classList.add('show');
    }
    function closeHowToModal_ios() {
        howToModal_ios.classList.remove('show');
    }
    openHowToButton_ios.addEventListener('click', showHowToModal_ios);
    cancelHowToButton_ios?.addEventListener('click', closeHowToModal_ios);
    
    // How to install Logic for ANDROID
    if (!openHowToButton_android || !howToModal_android) return;

    function showHowToModal_android() {
        howToModal_android.classList.add('show');
    }
    function closeHowToModal_android() {
        howToModal_android.classList.remove('show');
    }
    openHowToButton_android.addEventListener('click', showHowToModal_android);
    cancelHowToButton_android?.addEventListener('click', closeHowToModal_android);
});