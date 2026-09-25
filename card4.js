document.addEventListener('DOMContentLoaded', () => {
    
    const chartData = [
        { x: 50, yTotal: 260, yUsers: 260, date: 'CN 29 thg 8', valTotal: '0', valUsers: '0' },
        { x: 150, yTotal: 220, yUsers: 230, date: 'T3 31 thg 8', valTotal: '0,2', valUsers: '0,15' },
        { x: 250, yTotal: 240, yUsers: 250, date: 'T5 03 thg 9', valTotal: '0,1', valUsers: '0,05' },
        { x: 350, yTotal: 140, yUsers: 160, date: 'T2 07 thg 9', valTotal: '0,6', valUsers: '0,5' },
        { x: 450, yTotal: 180, yUsers: 190, date: 'T6 11 thg 9', valTotal: '0,4', valUsers: '0,35' },
        { x: 550, yTotal: 100, yUsers: 120, date: 'T3 15 thg 9', valTotal: '0,8', valUsers: '0,7' },
        { x: 650, yTotal: 160, yUsers: 170, date: 'T7 19 thg 9', valTotal: '0,5', valUsers: '0,45' },
        { x: 750, yTotal: 80, yUsers: 95, date: 'T2 21 thg 9', valTotal: '0,9', valUsers: '0,8' },
        { x: 850, yTotal: 30, yUsers: 45, date: 'T4 23 thg 9', valTotal: '1,1', valUsers: '1,05' }
    ];

    const layer = document.getElementById('interactiveLayer');
    const tooltip = document.getElementById('chartTooltip');
    const ttDate = document.getElementById('ttDate');
    const ttUsers = document.getElementById('ttUsers');
    const ttTotal = document.getElementById('ttTotal');
    
    const hoverWidth = 100;

    chartData.forEach((data, index) => {
        
        const vLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        vLine.setAttribute('x1', data.x);
        vLine.setAttribute('y1', 20);
        vLine.setAttribute('x2', data.x);
        vLine.setAttribute('y2', 260);
        vLine.setAttribute('class', 'hover-line');
        vLine.setAttribute('id', `vline-${index}`);
        layer.appendChild(vLine);

        const ptTotal = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        ptTotal.setAttribute('d', `M${data.x-6},${data.yTotal} A6,6 0 0,1 ${data.x+6},${data.yTotal} L${data.x},${data.yTotal-8} Z`);
        ptTotal.setAttribute('class', 'hover-point-total');
        ptTotal.setAttribute('id', `ptotal-${index}`);
        layer.appendChild(ptTotal);

        const ptUsers = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        ptUsers.setAttribute('cx', data.x);
        ptUsers.setAttribute('cy', data.yUsers);
        ptUsers.setAttribute('r', 5);
        ptUsers.setAttribute('class', 'hover-point-users');
        ptUsers.setAttribute('id', `pusers-${index}`);
        layer.appendChild(ptUsers);

        const zone = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        zone.setAttribute('x', data.x - hoverWidth/2);
        zone.setAttribute('y', 0);
        zone.setAttribute('width', hoverWidth);
        zone.setAttribute('height', 300);
        zone.setAttribute('class', 'hover-zone');

        zone.addEventListener('mouseenter', () => {
            document.getElementById(`vline-${index}`).style.opacity = '1';
            document.getElementById(`ptotal-${index}`).style.opacity = '1';
            document.getElementById(`pusers-${index}`).style.opacity = '1';
            
            ttDate.textContent = data.date;
            ttUsers.textContent = data.valUsers;
            ttTotal.textContent = data.valTotal;
            tooltip.style.display = 'block';
        });

        zone.addEventListener('mousemove', (e) => {
            let left = e.clientX + 15;
            let top = e.clientY + 15;
            
            const ttRect = tooltip.getBoundingClientRect();
            if (left + ttRect.width > window.innerWidth) {
                left = e.clientX - ttRect.width - 15;
            }
            if (top + ttRect.height > window.innerHeight) {
                top = e.clientY - ttRect.height - 15;
            }
            
            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${top}px`;
        });

        zone.addEventListener('mouseleave', () => {
            document.getElementById(`vline-${index}`).style.opacity = '0';
            document.getElementById(`ptotal-${index}`).style.opacity = '0';
            document.getElementById(`pusers-${index}`).style.opacity = '0';
            tooltip.style.display = 'none';
        });

        layer.appendChild(zone);
    });
});