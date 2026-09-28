document.addEventListener('DOMContentLoaded', () => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    const helpIcons = document.querySelectorAll('.help-icon-wrapper');
    helpIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.preventDefault(); 
            e.stopPropagation();
        });
    });
});