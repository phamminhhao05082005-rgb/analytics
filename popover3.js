document.addEventListener('DOMContentLoaded', () => {
    const panel = document.getElementById('variablesPanel');
    const closeBtn = document.getElementById('closePanelBtn');
    const openBtn = document.getElementById('openPanelBtn');

    closeBtn.addEventListener('click', () => {
        panel.style.display = 'none';
        openBtn.style.display = 'flex';
    });

    openBtn.addEventListener('click', () => {
        panel.style.display = 'flex';
        openBtn.style.display = 'none';
    });
});