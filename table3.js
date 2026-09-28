document.addEventListener('DOMContentLoaded', () => {
    const hoverRows = document.querySelectorAll('.hover-row');
    const popover = document.getElementById('pagesPopover');
    const popTitle = document.getElementById('popTitle');
    const popV = document.getElementById('popV');
    const popU = document.getElementById('popU');
    const popE = document.getElementById('popE');
    const popB = document.getElementById('popB');

    hoverRows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            popTitle.textContent = row.getAttribute('data-title');
            popV.textContent = row.getAttribute('data-v');
            popU.textContent = row.getAttribute('data-u');
            popE.textContent = row.getAttribute('data-e');
            popB.textContent = row.getAttribute('data-b');
            
            popover.style.display = 'block';
        });

        row.addEventListener('mousemove', (e) => {
            let left = e.clientX + 15;
            let top = e.clientY + 15;
            
            const pRect = popover.getBoundingClientRect();
            
            if (left + pRect.width > window.innerWidth) {
                left = e.clientX - pRect.width - 15;
            }
            if (top + pRect.height > window.innerHeight) {
                top = e.clientY - pRect.height - 15;
            }
            
            popover.style.left = `${left}px`;
            popover.style.top = `${top}px`;
        });

        row.addEventListener('mouseleave', () => {
            popover.style.display = 'none';
        });
    });
});