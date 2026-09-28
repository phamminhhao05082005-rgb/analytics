document.addEventListener('DOMContentLoaded', () => {
    
    const track = document.getElementById('metricTrack');
    const prevBtn = document.getElementById('metricPrevBtn');
    const nextBtn = document.getElementById('metricNextBtn');
    
    let currentPos = 0;
    const itemWidth = 220;

    nextBtn.addEventListener('click', () => {
        const maxScroll = -(track.scrollWidth - track.parentElement.offsetWidth);
        if (currentPos > maxScroll) {
            currentPos -= itemWidth;
            if (currentPos < maxScroll) currentPos = maxScroll;
            track.style.transform = `translateX(${currentPos}px)`;
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentPos < 0) {
            currentPos += itemWidth;
            if (currentPos > 0) currentPos = 0;
            track.style.transform = `translateX(${currentPos}px)`;
        }
    });

    const metricItems = document.querySelectorAll('.metric-box');
    metricItems.forEach(item => {
        item.addEventListener('click', () => {
            metricItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.metric-title').classList.remove('text-primary');
                i.querySelector('.metric-title').classList.add('text-secondary');
            });
            item.classList.add('active');
            item.querySelector('.metric-title').classList.remove('text-secondary');
            item.querySelector('.metric-title').classList.add('text-primary');
        });
    });

    const chartData = [
        { x: 50, yMain: 110, yDash: 130, date: 'Thứ 2 21 thg 9 vs Thứ 2 14 thg 9', val: '4.102', trend: '↓ 4,2%', isUp: false },
        { x: 160, yMain: 100, yDash: 90, date: 'Thứ 3 22 thg 9 vs Thứ 3 15 thg 9', val: '4.805', trend: '↑ 2,1%', isUp: true },
        { x: 270, yMain: 120, yDash: 115, date: 'Thứ 4 23 thg 9 vs Thứ 4 16 thg 9', val: '4.000', trend: '↓ 1,5%', isUp: false },
        { x: 380, yMain: 130, yDash: 135, date: 'Thứ 5 24 thg 9 vs Thứ 5 17 thg 9', val: '3.800', trend: '↑ 0,8%', isUp: true },
        { x: 490, yMain: 105, yDash: 140, date: 'Thứ 6 25 thg 9 vs Thứ 6 18 thg 9', val: '4.492', trend: '↑ 24,5%', isUp: true },
        { x: 600, yMain: 160, yDash: 145, date: 'Thứ 7 26 thg 9 vs Thứ 7 19 thg 9', val: '2.500', trend: '↓ 12,0%', isUp: false },
        { x: 710, yMain: 190, yDash: 130, date: 'CN 27 thg 9 vs CN 20 thg 9', val: '1.200', trend: '↓ 30,5%', isUp: false }
    ];

    const layer = document.getElementById('interactiveLayer');
    const popover = document.getElementById('chartPopover');
    const popDate = document.getElementById('popDate');
    const popVal = document.getElementById('popVal');
    const popTrend = document.getElementById('popTrend');
    const zoneWidth = 110;

    chartData.forEach((data, index) => {
        
        const vLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        vLine.setAttribute('x1', data.x);
        vLine.setAttribute('y1', 20);
        vLine.setAttribute('x2', data.x);
        vLine.setAttribute('y2', 220);
        vLine.setAttribute('class', 'hover-vline');
        vLine.setAttribute('id', `vline-${index}`);
        layer.appendChild(vLine);

        const dotDash = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dotDash.setAttribute('cx', data.x);
        dotDash.setAttribute('cy', data.yDash);
        dotDash.setAttribute('r', 4);
        dotDash.setAttribute('class', 'hover-dot-dashed');
        dotDash.setAttribute('id', `ddot-${index}`);
        layer.appendChild(dotDash);

        const dotMain = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dotMain.setAttribute('cx', data.x);
        dotMain.setAttribute('cy', data.yMain);
        dotMain.setAttribute('r', 4);
        dotMain.setAttribute('class', 'hover-dot');
        dotMain.setAttribute('id', `mdot-${index}`);
        layer.appendChild(dotMain);

        const zone = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        zone.setAttribute('x', data.x - zoneWidth/2);
        zone.setAttribute('y', 0);
        zone.setAttribute('width', zoneWidth);
        zone.setAttribute('height', 250);
        zone.setAttribute('class', 'hover-trigger');

        zone.addEventListener('mouseenter', () => {
            document.getElementById(`vline-${index}`).style.opacity = '1';
            document.getElementById(`ddot-${index}`).style.opacity = '1';
            document.getElementById(`mdot-${index}`).style.opacity = '1';
            
            popDate.textContent = data.date;
            popVal.textContent = data.val;
            
            if (data.isUp) {
                popTrend.innerHTML = `<i class="bi bi-arrow-up"></i> ${data.trend.replace('↑ ', '')}`;
                popTrend.className = 'popover-trend fw-medium text-success';
            } else {
                popTrend.innerHTML = `<i class="bi bi-arrow-down"></i> ${data.trend.replace('↓ ', '')}`;
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
            document.getElementById(`vline-${index}`).style.opacity = '0';
            document.getElementById(`ddot-${index}`).style.opacity = '0';
            document.getElementById(`mdot-${index}`).style.opacity = '0';
            popover.style.display = 'none';
        });

        layer.appendChild(zone);
    });
});