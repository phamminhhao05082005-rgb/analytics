document.addEventListener('DOMContentLoaded', () => {
    const hoverCells = document.querySelectorAll('.hover-trigger');
    const popover = document.getElementById('cohortPopover');
    const popHeader = document.getElementById('popHeader');
    const popUsers = document.getElementById('popUsers');
    const popRetention = document.getElementById('popRetention');

    hoverCells.forEach(cell => {
        cell.addEventListener('mouseenter', () => {
            const dateStr = cell.getAttribute('data-date');
            const weekStr = cell.getAttribute('data-week');
            const users = cell.getAttribute('data-users');
            const pct = cell.getAttribute('data-pct');

            popHeader.textContent = `${dateStr} • ${weekStr}`;
            popUsers.textContent = users;
            popRetention.textContent = `Tỷ lệ giữ chân người dùng: ${pct}`;

            popover.style.display = 'block';
        });

        cell.addEventListener('mousemove', (e) => {
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

        cell.addEventListener('mouseleave', () => {
            popover.style.display = 'none';
        });
    });
});