document.addEventListener('DOMContentLoaded', () => {
    const db = {
        "Ngày": {
            xLabels: ["29 thg", "31", "01", "03", "05", "07", "09", "11", "13", "15", "17", "19", "21", "23"],
            pts: {
                total: "50,260 114,220 178,230 242,240 306,190 370,140 434,160 498,180 562,140 626,100 690,130 754,160 818,80 882,55 950,30",
                all: "50,260 114,230 178,240 242,250 306,200 370,160 434,175 498,190 562,155 626,120 690,145 754,170 818,95 882,70 950,45",
                new: "50,260 114,240 178,245 242,255 306,220 370,180 434,190 498,200 562,170 626,140 690,160 754,180 818,110 882,85 950,60",
                returning: "50,260 114,250 178,255 242,260 306,230 370,200 434,205 498,210 562,185 626,160 690,180 754,200 818,130 882,105 950,80"
            },
            hoverData: [
                {date: "CN 29 thg 8", vals: {total: "0", all: "0", new: "0", returning: "0"}},
                {date: "T3 31 thg 8", vals: {total: "0,2", all: "0,15", new: "0,1", returning: "0,05"}},
                {date: "T4 01 thg 9", vals: {total: "0,15", all: "0,1", new: "0,07", returning: "0,02"}},
                {date: "T5 03 thg 9", vals: {total: "0,1", all: "0,05", new: "0,02", returning: "0"}},
                {date: "T7 05 thg 9", vals: {total: "0,35", all: "0,3", new: "0,2", returning: "0,15"}},
                {date: "T2 07 thg 9", vals: {total: "0,6", all: "0,5", new: "0,4", returning: "0,3"}},
                {date: "T4 09 thg 9", vals: {total: "0,5", all: "0,42", new: "0,35", returning: "0,27"}},
                {date: "T6 11 thg 9", vals: {total: "0,4", all: "0,35", new: "0,3", returning: "0,25"}},
                {date: "CN 13 thg 9", vals: {total: "0,6", all: "0,52", new: "0,45", returning: "0,37"}},
                {date: "T3 15 thg 9", vals: {total: "0,8", all: "0,7", new: "0,6", returning: "0,5"}},
                {date: "T5 17 thg 9", vals: {total: "0,65", all: "0,57", new: "0,5", returning: "0,4"}},
                {date: "T7 19 thg 9", vals: {total: "0,5", all: "0,45", new: "0,4", returning: "0,3"}},
                {date: "T2 21 thg 9", vals: {total: "0,9", all: "0,8", new: "0,75", returning: "0,65"}},
                {date: "T4 23 thg 9", vals: {total: "1,02", all: "0,95", new: "0,87", returning: "0,77"}},
                {date: "T6 25 thg 9", vals: {total: "1,15", all: "1,07", new: "1,0", returning: "0,9"}}
            ]
        },
        "Tuần": {
            xLabels: ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4", "Tuần 5"],
            pts: {
                total: "50,260 275,180 500,100 725,160 950,30",
                all: "50,260 275,190 500,120 725,170 950,45",
                new: "50,260 275,200 500,140 725,180 950,60",
                returning: "50,260 275,210 500,160 725,200 950,80"
            },
            hoverData: [
                {date: "Tuần 1", vals: {total: "0", all: "0", new: "0", returning: "0"}},
                {date: "Tuần 2", vals: {total: "0,4", all: "0,35", new: "0,3", returning: "0,25"}},
                {date: "Tuần 3", vals: {total: "0,8", all: "0,7", new: "0,6", returning: "0,5"}},
                {date: "Tuần 4", vals: {total: "0,5", all: "0,45", new: "0,4", returning: "0,3"}},
                {date: "Tuần 5", vals: {total: "1,15", all: "1,07", new: "1,0", returning: "0,9"}}
            ]
        },
        "Tháng": {
            xLabels: ["Tháng trước", "Tháng này"],
            pts: {
                total: "50,260 950,30",
                all: "50,260 950,45",
                new: "50,260 950,60",
                returning: "50,260 950,80"
            },
            hoverData: [
                {date: "Tháng trước", vals: {total: "0", all: "0", new: "0", returning: "0"}},
                {date: "Tháng này", vals: {total: "1,15", all: "1,07", new: "1,0", returning: "0,9"}}
            ]
        }
    };

    const xLabelsGroup = document.getElementById('xLabelsGroup');
    const barGroup = document.getElementById('barGroup');
    const interactiveLayer = document.getElementById('interactiveLayer');
    const tooltip = document.getElementById('chartTooltip');
    const ttDate = document.getElementById('ttDate');
    const ttContent = document.getElementById('ttContent');
    const timeRangeBtn = document.getElementById('timeRangeBtn');
    const dropItems = document.querySelectorAll('.custom-menu .dropdown-item');
    const rowCheckboxes = document.querySelectorAll('.row-checkbox');
    const masterCheckbox = document.getElementById('masterCheckbox');
    const buildChartBtn = document.getElementById('buildChartBtn');
    const legendItems = document.querySelectorAll('.legend-item');
    const svgEl = document.getElementById('mainChart');

    const searchInput = document.getElementById('searchInput');
    const tableRows = document.querySelectorAll('.data-row');
    const paginationInfo = document.getElementById('paginationInfo');

    const pageDropItems = document.querySelectorAll('.custom-pagination-menu .dropdown-item');
    const rowsPerPageText = document.getElementById('rowsPerPageText');

    let plottedKeys = ['total', 'all', 'new', 'returning'];

    const colors = {
        total: '#174ea6',
        all: '#669df6',
        new: '#8bc34a',
        returning: '#e91e63'
    };

    const iconsHtml = {
        all: `<rect width="14" height="14" rx="3" fill="${colors.all}"/>`,
        new: `<rect width="14" height="14" rx="3" fill="${colors.new}"/>`,
        returning: `<rect width="14" height="14" rx="3" fill="${colors.returning}"/>`,
        total: `<rect width="14" height="14" rx="3" fill="${colors.total}"/>`
    };
    
    const labelsStr = { 
        all: "All Users", 
        new: "New Users", 
        returning: "Returning Users", 
        total: "Tổng cộng" 
    };

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        let visibleCount = 0;
        
        tableRows.forEach(row => {
            const linkText = row.querySelector('.row-link').textContent.toLowerCase();
            if(linkText.includes(term)) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });
        
        if(visibleCount > 0) {
            paginationInfo.textContent = `1 – ${visibleCount} trên ${visibleCount}`;
        } else {
            paginationInfo.textContent = `0 – 0 trên 0`;
        }
    });

    pageDropItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            pageDropItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.check-icon').classList.add('d-none');
            });
            item.classList.add('active');
            item.querySelector('.check-icon').classList.remove('d-none');
            rowsPerPageText.textContent = item.getAttribute('data-val');
        });
    });

    function getCheckedKeys() {
        const keys = [];
        rowCheckboxes.forEach(cb => {
            if(cb.checked) {
                keys.push(cb.getAttribute('data-key'));
            }
        });
        return keys;
    }

    function checkBuildButtonState() {
        const checkedKeys = getCheckedKeys();
        const sortedChecked = [...checkedKeys].sort().join(',');
        const sortedPlotted = [...plottedKeys].sort().join(',');
        
        if (sortedChecked !== sortedPlotted && checkedKeys.length > 0) {
            buildChartBtn.classList.remove('btn-outline-secondary', 'bg-white', 'text-muted', 'border-dadce0');
            buildChartBtn.classList.add('btn-primary', 'text-white');
            buildChartBtn.removeAttribute('disabled');
        } else {
            buildChartBtn.classList.add('btn-outline-secondary', 'bg-white', 'text-muted', 'border-dadce0');
            buildChartBtn.classList.remove('btn-primary', 'text-white');
            buildChartBtn.setAttribute('disabled', 'true');
        }
    }

    function renderChart(range) {
        if(!db[range]) return;
        const data = db[range];
        
        xLabelsGroup.innerHTML = '';
        barGroup.innerHTML = '';
        interactiveLayer.innerHTML = '';
        
        const ptsArrTemplate = data.pts.total.split(' ');
        
        data.xLabels.forEach((lbl, i) => {
            const xVal = ptsArrTemplate[i].split(',')[0];
            const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            textEl.setAttribute('x', xVal);
            textEl.setAttribute('y', 278);
            textEl.setAttribute('class', 'chart-axis-label');
            textEl.setAttribute('text-anchor', 'middle');
            
            if(range === "Ngày" && i===0) {
                textEl.innerHTML = `${lbl.split(' ')[0]}<tspan x="${xVal}" dy="14">${lbl.split(' ')[1]} ${lbl.split(' ')[2]}</tspan>`;
            } else if(range === "Ngày") {
                textEl.textContent = lbl.split(' ')[0];
            } else {
                textEl.textContent = lbl;
            }
            xLabelsGroup.appendChild(textEl);
        });

        ptsArrTemplate.forEach((ptStr, i) => {
            const xVal = parseFloat(ptStr.split(',')[0]);
            const hoverData = data.hoverData[i];
            
            const groupWidth = plottedKeys.length * 12 + (plottedKeys.length - 1) * 2;
            let currentX = xVal - groupWidth / 2;

            plottedKeys.forEach(k => {
                const yVal = parseFloat(data.pts[k].split(' ')[i].split(',')[1]);
                let height = 260 - yVal;
                if (height < 0) height = 0;

                const bar = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                let dStr = '';
                
                if (height === 0) {
                    dStr = `M ${currentX},260 L ${currentX + 12},260`;
                } else {
                    const r = Math.min(3, height);
                    dStr = `M ${currentX},260 L ${currentX},${yVal + r} Q ${currentX},${yVal} ${currentX + r},${yVal} L ${currentX + 12 - r},${yVal} Q ${currentX + 12},${yVal} ${currentX + 12},${yVal + r} L ${currentX + 12},260 Z`;
                }

                bar.setAttribute('d', dStr);
                bar.setAttribute('fill', colors[k]);
                bar.setAttribute('class', `chart-bar bar-${k} bar-group-${i}`);
                barGroup.appendChild(bar);
                
                currentX += 14;
            });

            const zoneWidth = range === "Ngày" ? 64 : range === "Tuần" ? 225 : 900;
            const zone = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            zone.setAttribute('x', xVal - zoneWidth/2);
            zone.setAttribute('y', 20);
            zone.setAttribute('width', zoneWidth);
            zone.setAttribute('height', 240);
            zone.setAttribute('class', 'hover-zone');

            zone.addEventListener('mouseenter', () => {
                document.querySelectorAll('.chart-bar').forEach(el => el.classList.add('dimmed'));
                document.querySelectorAll(`.bar-group-${i}`).forEach(el => el.classList.remove('dimmed'));
            });

            zone.addEventListener('mousemove', (e) => {
                const pt = svgEl.createSVGPoint();
                pt.x = e.clientX;
                pt.y = e.clientY;
                const svgP = pt.matrixTransform(svgEl.getScreenCTM().inverse());
                
                let closestKey = null;
                let minDistance = Infinity;

                let cX = xVal - groupWidth / 2;
                plottedKeys.forEach(k => {
                    const barCenter = cX + 6;
                    const dist = Math.abs(svgP.x - barCenter);
                    if(dist < minDistance) {
                        minDistance = dist;
                        closestKey = k;
                    }
                    cX += 14;
                });

                ttDate.textContent = hoverData.date;
                ttContent.innerHTML = '';
                
                ['all', 'new', 'returning'].forEach(k => {
                    if (plottedKeys.includes(k)) {
                        const isClosest = (k === closestKey);
                        ttContent.innerHTML += `
                            <div class="d-flex justify-content-between align-items-center gap-4 ${isClosest ? 'fw-bold' : ''}" style="${isClosest ? 'background:#f8f9fa; margin:-4px -8px; padding:4px 8px; border-radius:4px;' : ''}">
                                <div class="d-flex align-items-center gap-2">
                                    <svg width="14" height="14" viewBox="0 0 14 14" style="opacity: ${isClosest ? '1' : '0.5'};">${iconsHtml[k]}</svg>
                                    <span class="tt-label ${isClosest ? 'fw-bold text-dark' : ''}">${labelsStr[k]}</span>
                                </div>
                                <span class="tt-val ${isClosest ? 'fw-bold text-dark' : ''}">${hoverData.vals[k]}</span>
                            </div>
                        `;
                    }
                });

                if (plottedKeys.includes('total')) {
                    const isClosest = ('total' === closestKey);
                    ttContent.innerHTML += `
                        <div class="d-flex justify-content-between align-items-center gap-4 mt-1 border-top pt-2 ${isClosest ? 'fw-bold' : ''}" style="${isClosest ? 'background:#f8f9fa; margin:0 -8px; padding:4px 8px; border-radius:4px;' : ''}">
                            <div class="d-flex align-items-center gap-2">
                                <svg width="14" height="14" viewBox="0 0 14 14">${iconsHtml['total']}</svg>
                                <span class="tt-label total">Tổng cộng</span>
                            </div>
                            <span class="tt-val total">${hoverData.vals.total}</span>
                        </div>
                    `;
                }
                
                if(ttContent.innerHTML !== '') {
                    tooltip.style.display = 'block';
                }

                let left = e.clientX + 15;
                let top = e.clientY + 15;
                const ttRect = tooltip.getBoundingClientRect();
                if (left + ttRect.width > window.innerWidth) left = e.clientX - ttRect.width - 15;
                if (top + ttRect.height > window.innerHeight) top = e.clientY - ttRect.height - 15;
                tooltip.style.left = `${left}px`;
                tooltip.style.top = `${top}px`;
            });

            zone.addEventListener('mouseleave', () => {
                document.querySelectorAll('.chart-bar').forEach(el => el.classList.remove('dimmed'));
                tooltip.style.display = 'none';
            });

            interactiveLayer.appendChild(zone);
        });

        legendItems.forEach(item => {
            const k = item.getAttribute('data-key');
            if(plottedKeys.includes(k)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
        
        checkBuildButtonState();
    }

    renderChart("Ngày");

    dropItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            dropItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const val = item.getAttribute('data-val');
            timeRangeBtn.innerHTML = `${val}`;
            renderChart(val);
        });
    });

    rowCheckboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            checkBuildButtonState();
        });
    });

    masterCheckbox.addEventListener('click', () => {
        const allChecked = Array.from(rowCheckboxes).every(cb => cb.checked);
        rowCheckboxes.forEach(cb => {
            cb.checked = !allChecked;
        });
        checkBuildButtonState();
    });

    buildChartBtn.addEventListener('click', () => {
        plottedKeys = getCheckedKeys();
        renderChart(timeRangeBtn.textContent.trim());
    });

    legendItems.forEach(item => {
        const k = item.getAttribute('data-key');

        item.addEventListener('mouseenter', () => {
            legendItems.forEach(li => li.classList.add('dimmed'));
            item.classList.remove('dimmed');
            
            document.querySelectorAll('.chart-bar').forEach(b => {
                if(b.classList.contains(`bar-${k}`)) {
                    b.classList.remove('dimmed');
                } else {
                    b.classList.add('dimmed');
                }
            });
        });

        item.addEventListener('mouseleave', () => {
            legendItems.forEach(li => li.classList.remove('dimmed'));
            document.querySelectorAll('.chart-bar').forEach(b => {
                b.classList.remove('dimmed');
            });
        });
    });
});