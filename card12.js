document.addEventListener('DOMContentLoaded', () => {
    
    const hoverZones = document.querySelectorAll('.hover-zone');
    const popover = document.getElementById('chartPopover');
    const popName = document.getElementById('popName');
    const popVal = document.getElementById('popVal');
    const popTrend = document.getElementById('popTrend');
    const chartRows = document.querySelectorAll('.chart-row');

    hoverZones.forEach(zone => {
        zone.addEventListener('mouseenter', (e) => {
            
            chartRows.forEach(row => {
                if(row !== zone.parentElement) {
                    row.classList.add('dimmed');
                }
            });

            const name = zone.getAttribute('data-name');
            const val = zone.getAttribute('data-val');
            const trend = zone.getAttribute('data-trend');
            const isUp = zone.getAttribute('data-isup') === 'true';

            popName.textContent = name;
            popVal.textContent = val;
            
            if (trend === '0,0%') {
                popTrend.innerHTML = trend;
                popTrend.className = 'popover-trend fw-medium text-secondary';
            } else if (isUp) {
                popTrend.innerHTML = `<i class="bi bi-arrow-up"></i> ${trend.replace('↑ ', '')}`;
                popTrend.className = 'popover-trend fw-medium text-success';
            } else {
                popTrend.innerHTML = `<i class="bi bi-arrow-down"></i> ${trend.replace('↓ ', '')}`;
                popTrend.className = 'popover-trend fw-medium text-danger';
            }

            popover.style.display = 'block';
        });

        zone.addEventListener('mousemove', (e) => {
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

        zone.addEventListener('mouseleave', () => {
            chartRows.forEach(row => {
                row.classList.remove('dimmed');
            });
            popover.style.display = 'none';
        });
    });

});