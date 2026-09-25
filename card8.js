document.addEventListener('DOMContentLoaded', () => {
    
    const db = {
        "Ngày": {
            xLabels: ["29 thg", "31", "01", "03", "05", "07", "09", "11", "13", "15", "17", "19", "21", "23"],
            pts: {
                total: "50,220 130,220 210,220 290,220 370,220 450,220 530,220 610,220 690,220 770,220 850,220 930,220 1010,220 1130,30",
                pageview: "50,220 130,220 210,220 290,220 370,220 450,220 530,220 610,220 690,220 770,220 850,220 930,220 1010,220 1130,115",
                scroll: "50,220 130,220 210,220 290,220 370,220 450,220 530,220 610,220 690,220 770,220 850,220 930,220 1010,220 1130,125",
                user: "50,220 130,220 210,220 290,220 370,220 450,220 530,220 610,220 690,220 770,220 850,220 930,220 1010,220 1130,154",
                session: "50,220 130,220 210,220 290,220 370,220 450,220 530,220 610,220 690,220 770,220 850,220 930,220 1010,220 1130,215",
                first: "50,220 130,220 210,220 290,220 370,220 450,220 530,220 610,220 690,220 770,220 850,220 930,220 1010,220 1130,218"
            },
            bandTotal: "50,220 1130,30 1130,220 50,220",
            endPts: {
                total: "M1124,30 A6,6 0 0,1 1136,30 L1130,22 Z",
                pageview: {cy: 115}, scroll: {y: 121}, user: "1130,150 1134,154 1130,158 1126,154",
                session: "1126,215 1134,215 1130,221", first: "1130,215 1134,221 1126,221"
            },
            hoverData: [
                {date: "29 thg 8", vals: {total: 0, pageview: 0, scroll: 0, user: 0, session: 0, first: 0}},
                {date: "31 thg 8", vals: {total: 0, pageview: 0, scroll: 0, user: 0, session: 0, first: 0}},
                {date: "01 thg 9", vals: {total: 0, pageview: 0, scroll: 0, user: 0, session: 0, first: 0}},
                {date: "03 thg 9", vals: {total: 0, pageview: 0, scroll: 0, user: 0, session: 0, first: 0}},
                {date: "05 thg 9", vals: {total: 0, pageview: 0, scroll: 0, user: 0, session: 0, first: 0}},
                {date: "07 thg 9", vals: {total: 0, pageview: 0, scroll: 0, user: 0, session: 0, first: 0}},
                {date: "09 thg 9", vals: {total: 0, pageview: 0, scroll: 0, user: 0, session: 0, first: 0}},
                {date: "11 thg 9", vals: {total: 0, pageview: 0, scroll: 0, user: 0, session: 0, first: 0}},
                {date: "13 thg 9", vals: {total: 0, pageview: 0, scroll: 0, user: 0, session: 0, first: 0}},
                {date: "15 thg 9", vals: {total: 0, pageview: 0, scroll: 0, user: 0, session: 0, first: 0}},
                {date: "17 thg 9", vals: {total: 0, pageview: 0, scroll: 0, user: 0, session: 0, first: 0}},
                {date: "19 thg 9", vals: {total: 0, pageview: 0, scroll: 0, user: 0, session: 0, first: 0}},
                {date: "21 thg 9", vals: {total: 0, pageview: 0, scroll: 0, user: 0, session: 0, first: 0}},
                {date: "23 thg 9", vals: {total: 142, pageview: 59, scroll: 52, user: 27, session: 3, first: 1}}
            ]
        },
        "Tuần": {
            xLabels: ["28 thg", "30", "06", "13", "20"],
            pts: {
                total: "50,220 250,220 550,220 850,220 1130,30",
                pageview: "50,220 250,220 550,220 850,220 1130,115",
                scroll: "50,220 250,220 550,220 850,220 1130,125",
                user: "50,220 250,220 550,220 850,220 1130,154",
                session: "50,220 250,220 550,220 850,220 1130,215",
                first: "50,220 250,220 550,220 850,220 1130,218"
            },
            bandTotal: "50,220 1130,30 1130,220 50,220",
            endPts: {
                total: "M1124,30 A6,6 0 0,1 1136,30 L1130,22 Z",
                pageview: {cy: 115}, scroll: {y: 121}, user: "1130,150 1134,154 1130,158 1126,154",
                session: "1126,215 1134,215 1130,221", first: "1130,215 1134,221 1126,221"
            },
            hoverData: [
                {date: "Tuần 28 thg 8", vals: {total: 0, pageview: 0, scroll: 0, user: 0, session: 0, first: 0}},
                {date: "Tuần 30 thg 8", vals: {total: 0, pageview: 0, scroll: 0, user: 0, session: 0, first: 0}},
                {date: "Tuần 06 thg 9", vals: {total: 0, pageview: 0, scroll: 0, user: 0, session: 0, first: 0}},
                {date: "Tuần 13 thg 9", vals: {total: 0, pageview: 0, scroll: 0, user: 0, session: 0, first: 0}},
                {date: "Tuần 20 thg 9", vals: {total: 142, pageview: 59, scroll: 52, user: 27, session: 3, first: 1}}
            ]
        },
        "Tháng": {
            xLabels: ["thg 8", "thg 9"],
            pts: {
                total: "50,220 1130,30",
                pageview: "50,220 1130,115",
                scroll: "50,220 1130,125",
                user: "50,220 1130,154",
                session: "50,220 1130,215",
                first: "50,220 1130,218"
            },
            bandTotal: "50,220 1130,30 1130,220 50,220",
            endPts: {
                total: "M1124,30 A6,6 0 0,1 1136,30 L1130,22 Z",
                pageview: {cy: 115}, scroll: {y: 121}, user: "1130,150 1134,154 1130,158 1126,154",
                session: "1126,215 1134,215 1130,221", first: "1130,215 1134,221 1126,221"
            },
            hoverData: [
                {date: "Tháng 8", vals: {total: 0, pageview: 0, scroll: 0, user: 0, session: 0, first: 0}},
                {date: "Tháng 9", vals: {total: 142, pageview: 59, scroll: 52, user: 27, session: 3, first: 1}}
            ]
        }
    };

    const xLabelsGroup = document.getElementById('xLabelsGroup');
    const interactiveLayer = document.getElementById('interactiveLayer');
    const tooltip = document.getElementById('chartTooltip');
    const ttDate = document.getElementById('ttDate');
    const ttContent = document.getElementById('ttContent');
    const timeRangeBtn = document.getElementById('timeRangeBtn');
    const dropItems = document.querySelectorAll('.dropdown-item');

    const iconsHtml = {
        pageview: '<circle cx="7" cy="7" r="4" fill="#4285f4"/>',
        scroll: '<rect x="3" y="3" width="8" height="8" fill="#8bc34a"/>',
        user: '<polygon points="7,3 11,7 7,11 3,7" fill="#e91e63"/>',
        session: '<polygon points="3,4 11,4 7,10" fill="#ffb300"/>',
        first: '<polygon points="7,4 11,10 3,10" fill="#3f51b5"/>',
        total: '<path d="M4,7 A3,3 0 0,1 10,7 L7,3 Z" fill="#174ea6"/>'
    };
    const labelsStr = { pageview: "page_view", scroll: "scroll", user: "user_engagement", session: "session_start", first: "first_visit" };

    function renderChart(range) {
        const data = db[range];
        xLabelsGroup.innerHTML = '';
        const ptsTotalArr = data.pts.total.split(' ');
        
        data.xLabels.forEach((lbl, i) => {
            const xVal = ptsTotalArr[i].split(',')[0];
            const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            textEl.setAttribute('x', xVal);
            textEl.setAttribute('y', 238);
            textEl.setAttribute('class', 'chart-axis-label');
            textEl.setAttribute('text-anchor', 'middle');
            
            if(range === "Ngày" && i===0) {
                textEl.innerHTML = `${lbl.split(' ')[0]}<tspan x="${xVal}" dy="14">${lbl.split(' ')[1]}</tspan>`;
            } else {
                textEl.textContent = lbl;
            }
            xLabelsGroup.appendChild(textEl);
        });

        document.getElementById('totalBand').setAttribute('points', data.bandTotal);
        document.getElementById('lineTotal').setAttribute('points', data.pts.total);
        document.getElementById('linePageview').setAttribute('points', data.pts.pageview);
        document.getElementById('lineScroll').setAttribute('points', data.pts.scroll);
        document.getElementById('lineUser').setAttribute('points', data.pts.user);
        document.getElementById('lineSession').setAttribute('points', data.pts.session);
        document.getElementById('lineFirst').setAttribute('points', data.pts.first);
        document.getElementById('ptTotal').setAttribute('d', data.endPts.total);
        document.getElementById('ptPageview').setAttribute('cy', data.endPts.pageview.cy);
        document.getElementById('ptScroll').setAttribute('y', data.endPts.scroll.y);
        document.getElementById('ptUser').setAttribute('points', data.endPts.user);
        document.getElementById('ptSession').setAttribute('points', data.endPts.session);
        document.getElementById('ptFirst').setAttribute('points', data.endPts.first);

        interactiveLayer.innerHTML = '';
        
        ptsTotalArr.forEach((ptStr, i) => {
            const xVal = parseFloat(ptStr.split(',')[0]);
            const hoverData = data.hoverData[i];
            
            const vLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            vLine.setAttribute('x1', xVal); vLine.setAttribute('y1', 20);
            vLine.setAttribute('x2', xVal); vLine.setAttribute('y2', 220);
            vLine.setAttribute('class', 'hover-vline');
            vLine.setAttribute('id', `vl-${i}`);
            interactiveLayer.appendChild(vLine);

            const keys = ['pageview', 'scroll', 'user', 'session', 'first', 'total'];
            keys.forEach(k => {
                const pY = parseFloat(data.pts[k].split(' ')[i].split(',')[1]);
                let shape;
                if(k==='total') {
                    shape = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    shape.setAttribute('d', `M${xVal-6},${pY} A6,6 0 0,1 ${xVal+6},${pY} L${xVal},${pY-8} Z`);
                } else if(k==='pageview') {
                    shape = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    shape.setAttribute('cx', xVal); shape.setAttribute('cy', pY); shape.setAttribute('r', 4);
                } else if(k==='scroll') {
                    shape = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    shape.setAttribute('x', xVal-4); shape.setAttribute('y', pY-4); shape.setAttribute('width', 8); shape.setAttribute('height', 8);
                } else if(k==='user') {
                    shape = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                    shape.setAttribute('points', `${xVal},${pY-4} ${xVal+4},${pY} ${xVal},${pY+4} ${xVal-4},${pY}`);
                } else if(k==='session') {
                    shape = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                    shape.setAttribute('points', `${xVal-4},${pY-3} ${xVal+4},${pY-3} ${xVal},${pY+3}`);
                } else { // first
                    shape = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                    shape.setAttribute('points', `${xVal},${pY-3} ${xVal+4},${pY+3} ${xVal-4},${pY+3}`);
                }
                shape.setAttribute('class', `point-${k} hover-point pt-group-${i}`);
                interactiveLayer.appendChild(shape);
            });

            const zoneWidth = range === "Ngày" ? 80 : range === "Tuần" ? 200 : 500;
            const zone = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            zone.setAttribute('x', xVal - zoneWidth/2);
            zone.setAttribute('y', 20);
            zone.setAttribute('width', zoneWidth);
            zone.setAttribute('height', 200);
            zone.setAttribute('class', 'hover-zone');

            zone.addEventListener('mouseenter', () => {
                document.getElementById(`vl-${i}`).style.opacity = '1';
                document.querySelectorAll(`.pt-group-${i}`).forEach(el => el.style.opacity = '1');
                
                ttDate.textContent = hoverData.date;
                ttContent.innerHTML = '';
                
                ['pageview', 'scroll', 'user', 'session', 'first'].forEach(k => {
                    ttContent.innerHTML += `
                        <div class="d-flex justify-content-between align-items-center gap-4">
                            <div class="d-flex align-items-center gap-2">
                                <svg width="14" height="14" viewBox="0 0 14 14" style="opacity: 0.5;">${iconsHtml[k]}</svg>
                                <span class="tt-label">${labelsStr[k]}</span>
                            </div>
                            <span class="tt-val">${hoverData.vals[k]}</span>
                        </div>
                    `;
                });
                
                ttContent.innerHTML += `
                    <div class="d-flex justify-content-between align-items-center gap-4 mt-1 border-top pt-2">
                        <div class="d-flex align-items-center gap-2">
                            <svg width="14" height="14" viewBox="0 0 14 14">${iconsHtml['total']}</svg>
                            <span class="tt-label total">Tổng cộng</span>
                        </div>
                        <span class="tt-val total">${hoverData.vals.total}</span>
                    </div>
                `;
                
                tooltip.style.display = 'block';
            });

            zone.addEventListener('mousemove', (e) => {
                let left = e.clientX + 15;
                let top = e.clientY + 15;
                const ttRect = tooltip.getBoundingClientRect();
                if (left + ttRect.width > window.innerWidth) left = e.clientX - ttRect.width - 15;
                if (top + ttRect.height > window.innerHeight) top = e.clientY - ttRect.height - 15;
                tooltip.style.left = `${left}px`;
                tooltip.style.top = `${top}px`;
            });

            zone.addEventListener('mouseleave', () => {
                document.getElementById(`vl-${i}`).style.opacity = '0';
                document.querySelectorAll(`.pt-group-${i}`).forEach(el => el.style.opacity = '0');
                tooltip.style.display = 'none';
            });

            interactiveLayer.appendChild(zone);
        });
    }

    renderChart("Ngày");

    dropItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            dropItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const val = item.getAttribute('data-val');
            timeRangeBtn.textContent = val;
            renderChart(val);
        });
    });
});