document.addEventListener('DOMContentLoaded', () => {
    const db = {
        "Ngày": {
            xLabels: ["31 thg", "01", "03", "05", "07", "09", "11", "13", "15", "17", "19", "21", "23", "25", "27"],
            pts: {
                new: "50,180 129,183 207,170 286,183 364,203 443,196 521,173 600,170 679,190 757,200 836,170 914,166 993,186 1071,47 1150,180",
                clearance: "50,200 129,196 207,183 286,183 364,210 443,203 521,183 600,180 679,200 757,206 836,186 914,176 993,196 1071,154 1150,203",
                apparel: "50,203 129,210 207,193 286,206 364,208 443,206 521,190 600,196 679,203 757,210 836,190 914,190 993,196 1071,186 1150,210",
                retro: "50,206 129,203 207,196 286,203 364,210 443,208 521,193 600,190 679,200 757,213 836,196 914,196 993,203 1071,196 1150,213"
            },
            hoverData: [
                {date: "31 tháng trước", vals: {new: 600, clearance: 300, apparel: 250, retro: 200}},
                {date: "01 tháng này", vals: {new: 550, clearance: 350, apparel: 150, retro: 250}},
                {date: "03 tháng này", vals: {new: 750, clearance: 550, apparel: 400, retro: 350}},
                {date: "05 tháng này", vals: {new: 550, clearance: 550, apparel: 200, retro: 250}},
                {date: "07 tháng này", vals: {new: 250, clearance: 150, apparel: 180, retro: 150}},
                {date: "09 tháng này", vals: {new: 350, clearance: 250, apparel: 200, retro: 180}},
                {date: "11 tháng này", vals: {new: 700, clearance: 550, apparel: 450, retro: 400}},
                {date: "13 tháng này", vals: {new: 750, clearance: 600, apparel: 350, retro: 450}},
                {date: "15 tháng này", vals: {new: 450, clearance: 300, apparel: 250, retro: 300}},
                {date: "17 tháng này", vals: {new: 300, clearance: 200, apparel: 150, retro: 100}},
                {date: "19 tháng này", vals: {new: 750, clearance: 500, apparel: 450, retro: 350}},
                {date: "21 tháng này", vals: {new: 800, clearance: 650, apparel: 450, retro: 350}},
                {date: "23 tháng này", vals: {new: 500, clearance: 350, apparel: 350, retro: 250}},
                {date: "25 tháng này", vals: {new: 2600, clearance: 1000, apparel: 500, retro: 350}},
                {date: "27 tháng này", vals: {new: 600, clearance: 250, apparel: 150, retro: 100}}
            ]
        },
        "Tuần": {
            xLabels: ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4", "Tuần 5"],
            pts: {
                new: "50,180 325,170 600,203 875,166 1150,47",
                clearance: "50,200 325,183 600,210 875,176 1150,154",
                apparel: "50,203 325,193 600,208 875,190 1150,186",
                retro: "50,206 325,196 600,210 875,196 1150,196"
            },
            hoverData: [
                {date: "Tuần 1", vals: {new: 600, clearance: 300, apparel: 250, retro: 200}},
                {date: "Tuần 2", vals: {new: 750, clearance: 550, apparel: 400, retro: 350}},
                {date: "Tuần 3", vals: {new: 250, clearance: 150, apparel: 180, retro: 150}},
                {date: "Tuần 4", vals: {new: 800, clearance: 650, apparel: 450, retro: 350}},
                {date: "Tuần 5", vals: {new: 2600, clearance: 1000, apparel: 500, retro: 350}}
            ]
        },
        "Tháng": {
            xLabels: ["Tháng trước", "Tháng này"],
            pts: {
                new: "50,180 1150,47",
                clearance: "50,200 1150,154",
                apparel: "50,203 1150,186",
                retro: "50,206 1150,196"
            },
            hoverData: [
                {date: "Tháng trước", vals: {new: 600, clearance: 300, apparel: 250, retro: 200}},
                {date: "Tháng này", vals: {new: 2600, clearance: 1000, apparel: 500, retro: 350}}
            ]
        }
    };

    const xLabelsGroup = document.getElementById('xLabelsGroup');
    const interactiveLayer = document.getElementById('interactiveLayer');
    const staticEndMarkersGroup = document.getElementById('staticEndMarkersGroup');
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

    let plottedKeys = ['new', 'clearance', 'apparel', 'retro'];

    const iconsHtml = {
        new: '<circle cx="7" cy="7" r="4" fill="#4285f4"/>',
        clearance: '<rect x="3" y="3" width="8" height="8" fill="#8bc34a"/>',
        apparel: '<polygon points="7,3 11,7 7,11 3,7" fill="#e91e63"/>',
        retro: '<polygon points="3,4 11,4 7,10" fill="#fbbc04"/>'
    };
    
    const labelsStr = { 
        new: "/shop/new", 
        clearance: "/shop/clearance", 
        apparel: "/shop/apparel", 
        retro: "/shop/collections/1998-retro-collection" 
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

    function updateChartVisibility() {
        const allKeys = ['new', 'clearance', 'apparel', 'retro'];
        
        allKeys.forEach(k => {
            const el = document.getElementById(`line${k.charAt(0).toUpperCase() + k.slice(1)}`);
            if(el) el.style.display = plottedKeys.includes(k) ? 'block' : 'none';
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
        renderChart(timeRangeBtn.textContent.trim());
    }

    function drawMarker(k, cx, cy, groupEl, isHover) {
        let shape;
        if(k==='new') {
            shape = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            shape.setAttribute('cx', cx); shape.setAttribute('cy', cy); shape.setAttribute('r', 4);
        } else if(k==='clearance') {
            shape = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            shape.setAttribute('x', cx-4); shape.setAttribute('y', cy-4); shape.setAttribute('width', 8); shape.setAttribute('height', 8);
        } else if(k==='apparel') {
            shape = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            shape.setAttribute('points', `${cx},${cy-5} ${cx+5},${cy} ${cx},${cy+5} ${cx-5},${cy}`);
        } else {
            shape = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            shape.setAttribute('points', `${cx-5},${cy-4} ${cx+5},${cy-4} ${cx},${cy+5}`);
        }
        
        if (isHover) {
            shape.setAttribute('class', `point-${k} hover-point`);
        } else {
            shape.setAttribute('class', `point-${k}`);
        }
        
        groupEl.appendChild(shape);
        return shape;
    }

    function renderChart(range) {
        if(!db[range]) return;
        const data = db[range];
        
        xLabelsGroup.innerHTML = '';
        const ptsArrTemplate = data.pts.new.split(' ');
        
        data.xLabels.forEach((lbl, i) => {
            const xVal = ptsArrTemplate[i].split(',')[0];
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

        ['new', 'clearance', 'apparel', 'retro'].forEach(k => {
            const line = document.getElementById(`line${k.charAt(0).toUpperCase() + k.slice(1)}`);
            if (line) line.setAttribute('points', data.pts[k]);
        });

        staticEndMarkersGroup.innerHTML = '';
        const lastIndex = ptsArrTemplate.length - 1;
        plottedKeys.forEach(k => {
            const lastPt = data.pts[k].split(' ')[lastIndex].split(',');
            drawMarker(k, parseFloat(lastPt[0]), parseFloat(lastPt[1]), staticEndMarkersGroup, false);
        });

        interactiveLayer.innerHTML = '';
        
        ptsArrTemplate.forEach((ptStr, i) => {
            const xVal = parseFloat(ptStr.split(',')[0]);
            const hoverData = data.hoverData[i];
            
            const vLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            vLine.setAttribute('x1', xVal); vLine.setAttribute('y1', 20);
            vLine.setAttribute('x2', xVal); vLine.setAttribute('y2', 220);
            vLine.setAttribute('class', 'hover-vline');
            vLine.setAttribute('id', `vl-${i}`);
            interactiveLayer.appendChild(vLine);

            const shapes = [];
            ['new', 'clearance', 'apparel', 'retro'].forEach(k => {
                const pY = parseFloat(data.pts[k].split(' ')[i].split(',')[1]);
                const shape = drawMarker(k, xVal, pY, interactiveLayer, true);
                shape.classList.add(`pt-group-${i}`);
                shapes.push(shape);
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
                document.querySelectorAll(`.pt-group-${i}`).forEach(el => {
                    const k = Array.from(el.classList).find(c => c.startsWith('point-')).split('-')[1];
                    if (plottedKeys.includes(k)) el.style.opacity = '1';
                });
            });

            zone.addEventListener('mousemove', (e) => {
                const pt = svgEl.createSVGPoint();
                pt.x = e.clientX;
                pt.y = e.clientY;
                const svgP = pt.matrixTransform(svgEl.getScreenCTM().inverse());
                const mouseY = svgP.y;

                let closestKey = null;
                let minDistance = 30;

                plottedKeys.forEach(k => {
                    const pY = parseFloat(data.pts[k].split(' ')[i].split(',')[1]);
                    const dist = Math.abs(mouseY - pY);
                    if(dist < minDistance) {
                        minDistance = dist;
                        closestKey = k;
                    }
                });

                document.querySelectorAll('.chart-line').forEach(l => {
                    l.classList.remove('highlighted');
                    l.classList.add('dimmed');
                });
                legendItems.forEach(li => li.classList.add('dimmed'));

                if(closestKey) {
                    const lineEl = document.getElementById(`line${closestKey.charAt(0).toUpperCase() + closestKey.slice(1)}`);
                    if(lineEl) {
                        lineEl.classList.remove('dimmed');
                        lineEl.classList.add('highlighted');
                    }
                    const leg = document.querySelector(`.legend-item[data-key="${closestKey}"]`);
                    if(leg) leg.classList.remove('dimmed');
                } else {
                    document.querySelectorAll('.chart-line').forEach(l => l.classList.remove('dimmed'));
                    legendItems.forEach(li => li.classList.remove('dimmed'));
                }

                ttDate.textContent = hoverData.date;
                ttContent.innerHTML = '';
                
                ['new', 'clearance', 'apparel', 'retro'].forEach(k => {
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
                document.getElementById(`vl-${i}`).style.opacity = '0';
                document.querySelectorAll(`.pt-group-${i}`).forEach(el => el.style.opacity = '0');
                tooltip.style.display = 'none';
                
                document.querySelectorAll('.chart-line').forEach(l => {
                    l.classList.remove('dimmed', 'highlighted');
                });
                legendItems.forEach(li => li.classList.remove('dimmed'));
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
        updateChartVisibility();
    });

    legendItems.forEach(item => {
        const k = item.getAttribute('data-key');
        const lineEl = document.getElementById(`line${k.charAt(0).toUpperCase() + k.slice(1)}`);

        item.addEventListener('mouseenter', () => {
            legendItems.forEach(li => li.classList.add('dimmed'));
            item.classList.remove('dimmed');
            
            document.querySelectorAll('.chart-line').forEach(l => l.classList.add('dimmed'));
            if(lineEl) {
                lineEl.classList.remove('dimmed');
                lineEl.classList.add('highlighted');
            }
        });

        item.addEventListener('mouseleave', () => {
            legendItems.forEach(li => li.classList.remove('dimmed'));
            document.querySelectorAll('.chart-line').forEach(l => {
                l.classList.remove('dimmed', 'highlighted');
            });
        });
    });
});