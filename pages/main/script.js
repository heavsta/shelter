document.addEventListener('DOMContentLoaded', () => {
    const mobileButton = document.getElementById('mobile-button');
    const mobileMenu = document.querySelector('.mobile-nav-menu');
    const heading = document.querySelector('.logo');
    const body = document.querySelector('body');

    mobileButton.addEventListener('click', () => {
        heading.classList.toggle('hidden');
        mobileButton.classList.toggle('vertical');
        mobileMenu.classList.toggle('show');
        body.classList.toggle('scroll-off');

        if (document.getElementById('shadow')) {
            body.removeChild(document.getElementById('shadow'));
        } else {
            let shadow = document.createElement('div');
            shadow.id = 'shadow';
            body.prepend(shadow);
        }
    });
});