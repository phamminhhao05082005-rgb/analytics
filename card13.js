document.addEventListener('DOMContentLoaded', () => {
    
    const chartData = [
        { x: 30, date: '21 thg 9, 2026', y30: 55, y7: 175, y1: 215, val30: '100.521', val7: '28.412', val1: '3.204' },
        { x: 90, date: '22 thg 9, 2026', y30: 55, y7: 175, y1: 215, val30: '101.102', val7: '28.350', val1: '3.150' },
        { x: 150, date: '23 thg 9, 2026', y30: 54, y7: 176, y1: 216, val30: '101.405', val7: '27.900', val1: '3.080' },
        { x: 210, date: '24 thg 9, 2026', y30: 53, y7: 176, y1: 217, val30: '101.890', val7: '27.850', val1: '2.950' },
        { x: 270, date: '25 thg 9, 2026', y30: 52, y7: 174, y1: 215, val30: '102.300', val7: '28.600', val1: '3.310' },
        { x: 330, date: '26 thg 9, 2026', y30: 54, y7: 175, y1: 218, val30: '101.500', val7: '28.450', val1: '2.850' },
        { x: 390, date: '27 thg 9, 2026', y30: 60, y7: 188, y1: 227, val30: '97.000', val7: '24.000', val1: '1.600' }
    ];

    const layer = document.getElementById('interactiveLayer');
    const popover = document.getElementById('chartPopover');
    const popDate = document.getElementById('popDate');
    const pop30 = document.getElementById('pop30');
    const pop7 = document.getElementById('pop7');
    const pop1 = document.getElementById('pop1');
    const zoneWidth = 60;

    chartData.forEach((data, index) => {
        
        const vLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        vLine.setAttribute('x1', data.x);
        vLine.setAttribute('y1', 20);
        vLine.setAttribute('x2', data.x);
        vLine.setAttribute('y2', 230);
        vLine.setAttribute('class', 'hover-vline');
        vLine.setAttribute('id', `vl-${index}`);
        layer.appendChild(vLine);

        const d30 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        d30.setAttribute('cx', data.x);
        d30.setAttribute('cy', data.y30);
        d30.setAttribute('r', 4);
        d30.setAttribute('fill', '#4285f4');
        d30.setAttribute('class', 'hover-dot');
        d30.setAttribute('id', `d30-${index}`);
        layer.appendChild(d30);

        const d7 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        d7.setAttribute('x', data.x - 4);
        d7.setAttribute('y', data.y7 - 4);
        d7.setAttribute('width', 8);
        d7.setAttribute('height', 8);
        d7.setAttribute('fill', '#8bc34a');
        d7.setAttribute('class', 'hover-dot');
        d7.setAttribute('id', `d7-${index}`);
        layer.appendChild(d7);

        const d1 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        d1.setAttribute('points', `${data.x},${data.y1-4} ${data.x+4},${data.y1} ${data.x},${data.y1+4} ${data.x-4},${data.y1}`);
        d1.setAttribute('fill', '#e91e63');
        d1.setAttribute('class', 'hover-dot');
        d1.setAttribute('id', `d1-${index}`);
        layer.appendChild(d1);

        const zone = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        zone.setAttribute('x', data.x - zoneWidth/2);
        zone.setAttribute('y', 0);
        zone.setAttribute('width', zoneWidth);
        zone.setAttribute('height', 260);
        zone.setAttribute('class', 'hover-trigger');

        zone.addEventListener('mouseenter', () => {
            document.getElementById(`vl-${index}`).style.opacity = '1';
            document.getElementById(`d30-${index}`).style.opacity = '1';
            document.getElementById(`d7-${index}`).style.opacity = '1';
            document.getElementById(`d1-${index}`).style.opacity = '1';
            
            popDate.textContent = data.date;
            pop30.textContent = data.val30;
            pop7.textContent = data.val7;
            pop1.textContent = data.val1;
            
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
            document.getElementById(`vl-${index}`).style.opacity = '0';
            document.getElementById(`d30-${index}`).style.opacity = '0';
            document.getElementById(`d7-${index}`).style.opacity = '0';
            document.getElementById(`d1-${index}`).style.opacity = '0';
            popover.style.display = 'none';
        });

        layer.appendChild(zone);
    });
});