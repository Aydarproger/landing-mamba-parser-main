// Проверяем, если на странице есть якорь #success_alert
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.hash === "#alert") {
        document.querySelector('.alert_success').style.top = '8%';

        if (history.replaceState) {
            history.replaceState(null, '', window.location.href.split('#')[0]);
        } else {
            window.location.hash = '';
        }
    }
});


// alert
document.querySelector('.close_alert').addEventListener('click', function() {
    document.querySelector('.alert_success').style.top = '-200%';
});