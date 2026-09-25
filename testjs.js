// ==========================================================================
// Analytics Components Library - JavaScript Engine (testjs.js)
// ==========================================================================

// 1. Hàm hiển thị Toast thông báo copy thành công
function showToast(message = "Đã copy mã nguồn thành công!") {
    let toast = document.getElementById('copyToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'copyToast';
        toast.className = 'copy-toast';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i> ${message}`;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2200);
}

// 2. Hàm hỗ trợ copy code kèm hiệu ứng trên nút bấm
function copyCode(elementId, btnElement) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const codeContent = el.innerText;

    const onCopySuccess = () => {
        showToast("Đã copy mã nguồn vào bộ nhớ tạm!");
        if (btnElement) {
            const originalHtml = btnElement.innerHTML;
            btnElement.classList.add('btn-copied');
            btnElement.innerHTML = '<i class="bi bi-check2 me-1"></i> Đã copy!';
            setTimeout(() => {
                btnElement.classList.remove('btn-copied');
                btnElement.innerHTML = originalHtml;
            }, 2000);
        }
    };

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(codeContent)
            .then(onCopySuccess)
            .catch(err => {
                console.warn('Clipboard API thất bại, thử dùng execCommand:', err);
                fallbackCopy(codeContent, onCopySuccess);
            });
    } else {
        fallbackCopy(codeContent, onCopySuccess);
    }
}

// Fallback copy cho trình duyệt cũ hoặc khi chạy file://
function fallbackCopy(text, callback) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "-9999px";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        const successful = document.execCommand('copy');
        if (successful && callback) callback();
    } catch (err) {
        console.error('Không thể copy nội dung:', err);
    }
    document.body.removeChild(textArea);
}

// 3. Đồng bộ Tab URL Hash & Re-initialize layout khi chuyển tab
function setupTabHashSync() {
    const triggerTabList = document.querySelectorAll('#componentTabs button[data-bs-toggle="pill"]');
    triggerTabList.forEach(triggerEl => {
        triggerEl.addEventListener('shown.bs.tab', event => {
            const targetId = event.target.getAttribute('data-bs-target');
            if (targetId) {
                history.replaceState(null, null, targetId);
            }
            if (targetId === '#tab-carousel') {
                if (typeof window.updateCarouselButtons === 'function') {
                    setTimeout(window.updateCarouselButtons, 150);
                }
            }
        });
    });

    const currentHash = window.location.hash;
    if (currentHash) {
        const tabBtn = document.querySelector(`button[data-bs-target="${currentHash}"]`) ||
            document.querySelector(`button[data-bs-target="#tab-${currentHash.replace('#', '')}"]`);
        if (tabBtn && window.bootstrap) {
            const tabInstance = bootstrap.Tab.getOrCreateInstance(tabBtn);
            tabInstance.show();
        }
    }
}

// 4. Khởi tạo tính năng cho các component trong preview
document.addEventListener("DOMContentLoaded", () => {
    // A. Carousel 1 Logic (Hỗ trợ nút trượt ngang)
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const trackContainer = document.getElementById('trackContainer');
    
    if (track && prevBtn && nextBtn && trackContainer) {
        const cardWidth = 296; 
        let currentPosition = 0;

        window.updateCarouselButtons = () => {
            const containerWidth = trackContainer.offsetWidth;
            const trackWidth = track.scrollWidth;

            if (currentPosition >= 0) {
                currentPosition = 0;
                track.style.transform = `translateX(0px)`;
                prevBtn.disabled = true;
            } else {
                prevBtn.disabled = false;
            }

            if (containerWidth > 0 && Math.abs(currentPosition) + containerWidth >= trackWidth - 10) {
                nextBtn.disabled = true;
            } else {
                nextBtn.disabled = false;
            }
        };

        nextBtn.addEventListener('click', () => {
            const containerWidth = trackContainer.offsetWidth;
            const maxScroll = (track.scrollWidth - containerWidth) * -1;
            currentPosition -= cardWidth;
            if (currentPosition < maxScroll) {
                currentPosition = maxScroll;
            }
            track.style.transform = `translateX(${currentPosition}px)`;
            window.updateCarouselButtons();
        });

        prevBtn.addEventListener('click', () => {
            currentPosition += cardWidth;
            if (currentPosition > 0) {
                currentPosition = 0;
            }
            track.style.transform = `translateX(${currentPosition}px)`;
            window.updateCarouselButtons();
        });

        window.addEventListener('resize', window.updateCarouselButtons);
        setTimeout(window.updateCarouselButtons, 200);
    }

    // B. Offcanvas 2 (Notes Offcanvas) Logic
    const notesOffcanvas = document.getElementById('notesOffcanvas');
    const btnGoToCreate = document.getElementById('btnGoToCreate');
    const btnGoBack = document.getElementById('btnGoBack');
    const colorCircles = document.querySelectorAll('#notesOffcanvas .color-circle');

    if (notesOffcanvas && btnGoToCreate && btnGoBack) {
        btnGoToCreate.addEventListener('click', () => {
            notesOffcanvas.classList.add('show-create');
        });

        btnGoBack.addEventListener('click', () => {
            notesOffcanvas.classList.remove('show-create');
        });

        notesOffcanvas.addEventListener('hidden.bs.offcanvas', () => {
            notesOffcanvas.classList.remove('show-create');
        });

        colorCircles.forEach(circle => {
            circle.addEventListener('click', () => {
                colorCircles.forEach(c => c.classList.remove('active'));
                circle.classList.add('active');
            });
        });
    }

    // C. Offcanvas 3 (Compare Offcanvas) Logic
    const searchInput = document.getElementById('tableSearchInput');
    const tableRows = document.querySelectorAll('#compareTable .table-row');
    const checkboxes = document.querySelectorAll('#compareTable .custom-checkbox');
    const pillsArea = document.getElementById('selectedPillsArea');

    if (searchInput && tableRows.length > 0 && pillsArea) {
        let selectedItems = [];

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            tableRows.forEach(row => {
                const rowName = row.querySelector('.row-name')?.textContent.toLowerCase() || '';
                const rowDesc = row.querySelector('.row-desc')?.textContent.toLowerCase() || '';
                if (rowName.includes(searchTerm) || rowDesc.includes(searchTerm)) {
                    row.style.display = ''; 
                } else {
                    row.style.display = 'none'; 
                }
            });
        });

        const renderPills = () => {
            pillsArea.innerHTML = '';
            selectedItems.forEach((item) => {
                const colorClass = item.type === 'T' ? 'blue' : 'gray';
                const pillHtml = `
                    <div class="filter-pill" data-value="${item.value}">
                        <div class="pill-icon ${colorClass}">${item.type}</div>
                        <span>${item.value}</span>
                        <i class="bi bi-x pill-close ms-2"></i>
                    </div>
                `;
                pillsArea.insertAdjacentHTML('beforeend', pillHtml);
            });

            const closeBtns = pillsArea.querySelectorAll('.pill-close');
            closeBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const pillElement = e.target.closest('.filter-pill');
                    if (!pillElement) return;
                    const valToRem = pillElement.getAttribute('data-value');
                    checkboxes.forEach(cb => {
                        if (cb.value === valToRem) {
                            cb.checked = false;
                            cb.closest('.table-row')?.classList.remove('selected');
                        }
                    });
                    selectedItems = selectedItems.filter(i => i.value !== valToRem);
                    renderPills();
                });
            });
        };

        checkboxes.forEach(cb => {
            cb.addEventListener('change', (e) => {
                const val = e.target.value;
                const type = e.target.getAttribute('data-type');
                const row = e.target.closest('.table-row');

                if (e.target.checked) {
                    if (!selectedItems.some(i => i.value === val)) {
                        selectedItems.push({ value: val, type: type });
                    }
                    if (row) row.classList.add('selected');
                } else {
                    selectedItems = selectedItems.filter(i => i.value !== val);
                    if (row) row.classList.remove('selected');
                }
                renderPills();
            });
        });

        // Chọn mặc định một vài mục mẫu
        if (checkboxes.length >= 3) {
            checkboxes[0].checked = true;
            checkboxes[1].checked = true;
            if (checkboxes[5]) checkboxes[5].checked = true;
            checkboxes[0].dispatchEvent(new Event('change'));
            checkboxes[1].dispatchEvent(new Event('change'));
            if (checkboxes[5]) checkboxes[5].dispatchEvent(new Event('change'));
        }
    }

    // D. Popover 1 (Search Popover) Logic
    const searchPopInput = document.getElementById('searchInput');
    const searchBox = document.getElementById('searchBoxTrigger');
    const searchPopover = document.getElementById('searchPopover');

    if (searchPopInput && searchBox && searchPopover) {
        searchPopInput.addEventListener('focus', () => {
            searchPopover.classList.add('show');
            searchBox.classList.add('active');
        });

        document.addEventListener('click', (e) => {
            const isClickInside = searchBox.contains(e.target) || searchPopover.contains(e.target);
            if (!isClickInside) {
                searchPopover.classList.remove('show');
                searchBox.classList.remove('active');
            }
        });
    }

    // E. Sidebar 1 (Hover Sidebar Active Item Switch)
    const sidebar1NavItems = document.querySelectorAll('#preview-sidebar1 .nav-item');
    sidebar1NavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            sidebar1NavItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // F. Sidebar 2 (Sidebar Toggle Collapse & Active Nav)
    const sidebar2 = document.getElementById('gaSidebar');
    const toggleBtn = document.getElementById('toggleSidebarBtn');
    const toggleIcon = document.getElementById('toggleIcon');
    
    if (sidebar2 && toggleBtn && toggleIcon) {
        toggleBtn.addEventListener('click', () => {
            sidebar2.classList.toggle('collapsed');
            if (sidebar2.classList.contains('collapsed')) {
                toggleIcon.classList.remove('bi-chevron-left');
                toggleIcon.classList.add('bi-chevron-right');
            } else {
                toggleIcon.classList.remove('bi-chevron-right');
                toggleIcon.classList.add('bi-chevron-left');
            }
        });

        const sidebar2Links = document.querySelectorAll('#preview-sidebar2 .nav-link-item:not(.w-100), #preview-sidebar2 .sub-link-item');
        sidebar2Links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                sidebar2Links.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }

    // G. Card 3 (Analytics Chart Card - Metric Slider & Hover Popover)
    const card3Preview = document.getElementById('preview-card3');
    if (card3Preview) {
        const track = card3Preview.querySelector('#metricTrack');
        const prevBtn = card3Preview.querySelector('#metricPrevBtn');
        const nextBtn = card3Preview.querySelector('#metricNextBtn');
        
        let currentPos = 0;
        const itemWidth = 200;

        if (track && prevBtn && nextBtn) {
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
        }

        const metricItems = card3Preview.querySelectorAll('.metric-item');
        metricItems.forEach(item => {
            item.addEventListener('click', () => {
                metricItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            });
        });

        const points = card3Preview.querySelectorAll('.chart-point');
        const popover = card3Preview.querySelector('#chartPopover');
        const popDate = card3Preview.querySelector('#popDate');
        const popVal = card3Preview.querySelector('#popVal');

        if (popover && popDate && popVal) {
            points.forEach(point => {
                point.addEventListener('mouseenter', () => {
                    point.classList.add('active');
                    popDate.textContent = point.getAttribute('data-date');
                    popVal.textContent = point.getAttribute('data-val');
                    popover.style.display = 'block';
                });

                point.addEventListener('mousemove', (e) => {
                    let left = e.clientX + 15;
                    let top = e.clientY - 40;
                    const popoverRect = popover.getBoundingClientRect();
                    if (left + popoverRect.width > window.innerWidth) {
                        left = e.clientX - popoverRect.width - 15;
                    }
                    popover.style.left = `${left}px`;
                    popover.style.top = `${top}px`;
                });

                point.addEventListener('mouseleave', () => {
                    point.classList.remove('active');
                    popover.style.display = 'none';
                });
            });
        }
    }

    // H. Card 4 (Analytics Detailed Chart Card)
    const card4Preview = document.getElementById('preview-card4');
    if (card4Preview) {
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

        const layer = card4Preview.querySelector('#interactiveLayer');
        const tooltip = card4Preview.querySelector('#chartTooltip');
        const ttDate = card4Preview.querySelector('#ttDate');
        const ttUsers = card4Preview.querySelector('#ttUsers');
        const ttTotal = card4Preview.querySelector('#ttTotal');
        const hoverWidth = 100;

        if (layer && tooltip && ttDate && ttUsers && ttTotal) {
            layer.innerHTML = '';
            chartData.forEach((data, index) => {
                const vLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                vLine.setAttribute('x1', data.x);
                vLine.setAttribute('y1', 20);
                vLine.setAttribute('x2', data.x);
                vLine.setAttribute('y2', 260);
                vLine.setAttribute('class', 'hover-line');
                vLine.setAttribute('id', `c4-vline-${index}`);
                layer.appendChild(vLine);

                const ptTotal = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                ptTotal.setAttribute('d', `M${data.x-6},${data.yTotal} A6,6 0 0,1 ${data.x+6},${data.yTotal} L${data.x},${data.yTotal-8} Z`);
                ptTotal.setAttribute('class', 'hover-point-total');
                ptTotal.setAttribute('id', `c4-ptotal-${index}`);
                layer.appendChild(ptTotal);

                const ptUsers = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                ptUsers.setAttribute('cx', data.x);
                ptUsers.setAttribute('cy', data.yUsers);
                ptUsers.setAttribute('r', 5);
                ptUsers.setAttribute('class', 'hover-point-users');
                ptUsers.setAttribute('id', `c4-pusers-${index}`);
                layer.appendChild(ptUsers);

                const zone = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                zone.setAttribute('x', data.x - hoverWidth/2);
                zone.setAttribute('y', 0);
                zone.setAttribute('width', hoverWidth);
                zone.setAttribute('height', 300);
                zone.setAttribute('class', 'hover-zone');

                zone.addEventListener('mouseenter', () => {
                    const vl = card4Preview.querySelector(`#c4-vline-${index}`);
                    const pt = card4Preview.querySelector(`#c4-ptotal-${index}`);
                    const pu = card4Preview.querySelector(`#c4-pusers-${index}`);
                    if (vl) vl.style.opacity = '1';
                    if (pt) pt.style.opacity = '1';
                    if (pu) pu.style.opacity = '1';

                    ttDate.textContent = data.date;
                    ttUsers.textContent = data.valUsers;
                    ttTotal.textContent = data.valTotal;
                    tooltip.style.display = 'block';
                });

                zone.addEventListener('mousemove', (e) => {
                    tooltip.style.left = `${e.clientX + 15}px`;
                    tooltip.style.top = `${e.clientY - 40}px`;
                });

                zone.addEventListener('mouseleave', () => {
                    const vl = card4Preview.querySelector(`#c4-vline-${index}`);
                    const pt = card4Preview.querySelector(`#c4-ptotal-${index}`);
                    const pu = card4Preview.querySelector(`#c4-pusers-${index}`);
                    if (vl) vl.style.opacity = '0';
                    if (pt) pt.style.opacity = '0';
                    if (pu) pu.style.opacity = '0';
                    tooltip.style.display = 'none';
                });

                layer.appendChild(zone);
            });
        }
    }

    // I. Card 5 (Funnel Toggle Switch)
    const card5Preview = document.getElementById('preview-card5');
    if (card5Preview) {
        const funnelToggle = card5Preview.querySelector('#funnelToggle');
        const funnelArea = card5Preview.querySelector('.funnel-grid');
        if (funnelToggle && funnelArea) {
            funnelToggle.addEventListener('change', () => {
                funnelArea.style.opacity = funnelToggle.checked ? '1' : '0.25';
                funnelArea.style.transition = 'opacity 0.3s ease';
            });
        }
    }

    // J. Card 7 (Analytics Dynamic Chart)
    const card7Preview = document.getElementById('preview-card7');
    if (card7Preview) {
        const datasets = [
            {
                yLabels: ["1 phút 20 giây", "1 phút 00 giây", "40 giây", "20 giây", "0 giây"],
                linePts: "0,220 100,220 250,220 400,220 550,220 680,220 720,110",
                bandPts: "0,120 40,120 70,90 140,90 170,120 240,120 270,90 340,90 370,120 440,120 470,90 540,90 570,120 640,120 670,90 740,90 750,90 750,140 740,140 670,140 640,170 570,170 540,140 470,140 440,170 370,170 340,140 270,140 240,170 170,170 140,140 70,140 40,170 0,170",
                hoverVals: ["0 giây", "0 giây", "0 giây", "0 giây", "38 giây"],
                dotY: [220, 220, 220, 220, 110],
                name: "Thời gian tương tác trung bình trên mỗi người dùng đang hoạt động"
            },
            {
                yLabels: ["2", "1,5", "1", "0,5", "0"],
                linePts: "0,220 100,220 250,220 400,220 550,220 680,220 720,120",
                bandPts: "0,130 40,130 70,100 140,100 170,130 240,130 270,100 340,100 370,130 440,130 470,100 540,100 570,130 640,130 670,100 740,100 750,100 750,150 740,150 670,150 640,180 570,180 540,150 470,150 440,180 370,180 340,150 270,150 240,180 170,180 140,150 70,150 40,180 0,180",
                hoverVals: ["0", "0", "0", "0", "1"],
                dotY: [220, 220, 220, 220, 120],
                name: "Số phiên có sự tương tác trên mỗi người dùng đang hoạt động"
            },
            {
                yLabels: ["40 giây", "30 giây", "20 giây", "10 giây", "0 giây"],
                linePts: "0,220 100,220 250,220 400,220 550,220 680,220 720,136",
                bandPts: "0,140 40,140 70,110 140,110 170,140 240,140 270,110 340,110 370,140 440,140 470,110 540,110 570,140 640,140 670,110 740,110 750,110 750,160 740,160 670,160 640,190 570,190 540,160 470,160 440,190 370,190 340,160 270,160 240,190 170,190 140,160 70,160 40,190 0,190",
                hoverVals: ["0 giây", "0 giây", "0 giây", "0 giây", "12 giây"],
                dotY: [220, 220, 220, 220, 136],
                name: "Thời gian tương tác trung bình/phiên hoạt động"
            }
        ];
        const hoverDates = ["30 thg", "06 thg", "13 thg", "20 thg", "Hôm nay"];
        let activeIdx = 0;

        const yLabelEls = card7Preview.querySelectorAll('.y-label');
        const chartLine = card7Preview.querySelector('#chartLine');
        const chartBand = card7Preview.querySelector('#chartBand');
        const metricBoxes = card7Preview.querySelectorAll('.metric-box');
        const ttName = card7Preview.querySelector('#ttName');
        const tooltip = card7Preview.querySelector('#customTooltip');
        const ttVal = card7Preview.querySelector('#ttVal');
        const ttDate = card7Preview.querySelector('#ttDate');
        const hitboxes = card7Preview.querySelectorAll('.hover-hitbox');
        const hoverDots = card7Preview.querySelectorAll('.hover-dot');
        const hoverLines = card7Preview.querySelectorAll('.hover-line');

        metricBoxes.forEach((box, index) => {
            box.addEventListener('click', () => {
                metricBoxes.forEach(b => {
                    b.classList.remove('active');
                    b.querySelector('.metric-title')?.classList.remove('text-primary');
                    b.querySelector('.metric-title')?.classList.add('text-secondary');
                });
                box.classList.add('active');
                box.querySelector('.metric-title')?.classList.remove('text-secondary');
                box.querySelector('.metric-title')?.classList.add('text-primary');

                activeIdx = index;
                const data = datasets[activeIdx];
                yLabelEls.forEach((el, i) => { if (data.yLabels[i]) el.textContent = data.yLabels[i]; });
                if (chartLine) chartLine.setAttribute('points', data.linePts);
                if (chartBand) chartBand.setAttribute('points', data.bandPts);
                if (ttName) ttName.textContent = data.name;
                hoverDots.forEach((dot, i) => {
                    if (data.dotY[i]) dot.setAttribute('cy', data.dotY[i]);
                });
            });
        });

        if (tooltip) {
            hitboxes.forEach(box => {
                box.addEventListener('mouseenter', (e) => {
                    const i = parseInt(e.target.getAttribute('data-point'));
                    if (hoverLines[i]) hoverLines[i].style.opacity = '1';
                    if (hoverDots[i]) hoverDots[i].style.opacity = '1';
                    if (ttVal) ttVal.textContent = datasets[activeIdx].hoverVals[i];
                    if (ttDate) ttDate.textContent = hoverDates[i];
                    tooltip.style.display = 'block';
                });

                box.addEventListener('mousemove', (e) => {
                    tooltip.style.left = `${e.clientX + 15}px`;
                    tooltip.style.top = `${e.clientY - 40}px`;
                });

                box.addEventListener('mouseleave', (e) => {
                    const i = parseInt(e.target.getAttribute('data-point'));
                    if (hoverLines[i]) hoverLines[i].style.opacity = '0';
                    if (hoverDots[i]) hoverDots[i].style.opacity = '0';
                    tooltip.style.display = 'none';
                });
            });
        }
    }

    // K. Card 8 (Analytics Detailed Multi-Line Chart with Time Range)
    const card8Preview = document.getElementById('preview-card8');
    if (card8Preview) {
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
                xLabels: ["Tháng 8", "Tháng 9"],
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

        const xLabelsGroup = card8Preview.querySelector('#xLabelsGroup');
        const interactiveLayer = card8Preview.querySelector('#interactiveLayer8') || card8Preview.querySelector('#interactiveLayer');
        const tooltip = card8Preview.querySelector('#chartTooltip8') || card8Preview.querySelector('#chartTooltip');
        const ttDate = card8Preview.querySelector('#ttDate8') || card8Preview.querySelector('#ttDate');
        const ttContent = card8Preview.querySelector('#ttContent8') || card8Preview.querySelector('#ttContent');
        const timeRangeBtn = card8Preview.querySelector('#timeRangeBtn');

        function renderChart8(rangeKey) {
            const data = db[rangeKey];
            if (!data) return;

            if (xLabelsGroup) {
                xLabelsGroup.innerHTML = '';
                const totalLabels = data.xLabels.length;
                data.xLabels.forEach((label, i) => {
                    const x = 50 + (i * ((1130 - 50) / (totalLabels - 1 || 1)));
                    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    text.setAttribute('x', x);
                    text.setAttribute('y', 245);
                    text.setAttribute('class', 'chart-axis-label');
                    text.setAttribute('text-anchor', 'middle');
                    text.textContent = label;
                    xLabelsGroup.appendChild(text);
                });
            }

            const totalBand = card8Preview.querySelector('#totalBand');
            const lineTotal = card8Preview.querySelector('#lineTotal');
            const linePageview = card8Preview.querySelector('#linePageview');
            const lineScroll = card8Preview.querySelector('#lineScroll');
            const lineUser = card8Preview.querySelector('#lineUser');
            const lineSession = card8Preview.querySelector('#lineSession');
            const lineFirst = card8Preview.querySelector('#lineFirst');
            const ptTotal = card8Preview.querySelector('#ptTotal');
            const ptPageview = card8Preview.querySelector('#ptPageview');
            const ptScroll = card8Preview.querySelector('#ptScroll');
            const ptUser = card8Preview.querySelector('#ptUser');
            const ptSession = card8Preview.querySelector('#ptSession');
            const ptFirst = card8Preview.querySelector('#ptFirst');

            if (totalBand) totalBand.setAttribute('points', data.bandTotal);
            if (lineTotal) lineTotal.setAttribute('points', data.pts.total);
            if (linePageview) linePageview.setAttribute('points', data.pts.pageview);
            if (lineScroll) lineScroll.setAttribute('points', data.pts.scroll);
            if (lineUser) lineUser.setAttribute('points', data.pts.user);
            if (lineSession) lineSession.setAttribute('points', data.pts.session);
            if (lineFirst) lineFirst.setAttribute('points', data.pts.first);

            if (ptTotal) ptTotal.setAttribute('d', data.endPts.total);
            if (ptPageview) ptPageview.setAttribute('cy', data.endPts.pageview.cy);
            if (ptScroll) ptScroll.setAttribute('y', data.endPts.scroll.y);
            if (ptUser) ptUser.setAttribute('points', data.endPts.user);
            if (ptSession) ptSession.setAttribute('points', data.endPts.session);
            if (ptFirst) ptFirst.setAttribute('points', data.endPts.first);

            if (interactiveLayer) {
                interactiveLayer.innerHTML = '';
                const totalPts = data.hoverData.length;
                const stepX = (1130 - 50) / (totalPts - 1 || 1);

                data.hoverData.forEach((h, i) => {
                    const x = 50 + (i * stepX);
                    const vl = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    vl.setAttribute('x1', x);
                    vl.setAttribute('y1', 20);
                    vl.setAttribute('x2', x);
                    vl.setAttribute('y2', 220);
                    vl.setAttribute('class', 'hover-line');
                    vl.setAttribute('id', `c8-vl-${i}`);
                    interactiveLayer.appendChild(vl);

                    const zone = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    zone.setAttribute('x', x - (stepX / 2));
                    zone.setAttribute('y', 0);
                    zone.setAttribute('width', stepX);
                    zone.setAttribute('height', 280);
                    zone.setAttribute('class', 'hover-zone');

                    zone.addEventListener('mouseenter', () => {
                        const targetVl = card8Preview.querySelector(`#c8-vl-${i}`);
                        if (targetVl) targetVl.style.opacity = '1';
                        if (ttDate) ttDate.textContent = h.date;
                        if (ttContent) {
                            ttContent.innerHTML = `
                                <div class="tooltip-item d-flex justify-content-between align-items-center mb-1">
                                    <div class="d-flex align-items-center"><span class="tooltip-dot bg-total me-2"></span><span class="tooltip-name">Tổng cộng</span></div>
                                    <span class="tooltip-val fw-bold">${h.vals.total}</span>
                                </div>
                                <div class="tooltip-item d-flex justify-content-between align-items-center mb-1">
                                    <div class="d-flex align-items-center"><span class="tooltip-dot bg-pageview me-2"></span><span class="tooltip-name">page_view</span></div>
                                    <span class="tooltip-val fw-bold">${h.vals.pageview}</span>
                                </div>
                                <div class="tooltip-item d-flex justify-content-between align-items-center mb-1">
                                    <div class="d-flex align-items-center"><span class="tooltip-dot bg-scroll me-2"></span><span class="tooltip-name">scroll</span></div>
                                    <span class="tooltip-val fw-bold">${h.vals.scroll}</span>
                                </div>
                                <div class="tooltip-item d-flex justify-content-between align-items-center mb-1">
                                    <div class="d-flex align-items-center"><span class="tooltip-dot bg-user me-2"></span><span class="tooltip-name">user_engagement</span></div>
                                    <span class="tooltip-val fw-bold">${h.vals.user}</span>
                                </div>
                                <div class="tooltip-item d-flex justify-content-between align-items-center mb-1">
                                    <div class="d-flex align-items-center"><span class="tooltip-dot bg-session me-2"></span><span class="tooltip-name">session_start</span></div>
                                    <span class="tooltip-val fw-bold">${h.vals.session}</span>
                                </div>
                                <div class="tooltip-item d-flex justify-content-between align-items-center">
                                    <div class="d-flex align-items-center"><span class="tooltip-dot bg-first me-2"></span><span class="tooltip-name">first_visit</span></div>
                                    <span class="tooltip-val fw-bold">${h.vals.first}</span>
                                </div>
                            `;
                        }
                        if (tooltip) tooltip.style.display = 'block';
                    });

                    zone.addEventListener('mousemove', (e) => {
                        if (tooltip) {
                            tooltip.style.left = `${e.clientX + 15}px`;
                            tooltip.style.top = `${e.clientY - 40}px`;
                        }
                    });

                    zone.addEventListener('mouseleave', () => {
                        const targetVl = card8Preview.querySelector(`#c8-vl-${i}`);
                        if (targetVl) targetVl.style.opacity = '0';
                        if (tooltip) tooltip.style.display = 'none';
                    });

                    interactiveLayer.appendChild(zone);
                });
            }
        }

        renderChart8('Ngày');

        card8Preview.querySelectorAll('.dropdown-item[data-val]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const val = e.target.getAttribute('data-val');
                if (timeRangeBtn) timeRangeBtn.textContent = val;
                card8Preview.querySelectorAll('.dropdown-item[data-val]').forEach(i => i.classList.remove('active'));
                e.target.classList.add('active');
                renderChart8(val);
            });
        });
    }

    // L. Tabs 1 (Analytics Exploration Tabs)
    const tabs1Preview = document.getElementById('preview-tabs1');
    if (tabs1Preview) {
        let tabs = [
            { id: 'exp_tab_1', title: 'Biểu mẫu tùy ý', type: 'Biểu mẫu tùy ý', count: 0 },
            { id: 'exp_tab_2', title: 'Khám phá phễu', type: 'Khám phá phễu', count: 0 },
            { id: 'exp_tab_3', title: 'Trình khám phá người dùng 1', type: 'Trình khám phá người dùng', count: 1 }
        ];
        let activeTabId = 'exp_tab_1';

        const tabsListEl = tabs1Preview.querySelector('#tabsList');
        const tabContentEl = tabs1Preview.querySelector('#tabContent');

        function getIconForType(type) {
            if (type === 'Biểu mẫu tùy ý') {
                return '<i class="bi bi-pencil-fill"></i>';
            }
            return type.charAt(0).toUpperCase();
        }

        function renderTabsList() {
            if (!tabsListEl) return;
            tabsListEl.innerHTML = '';
            tabs.forEach(tab => {
                const isActive = tab.id === activeTabId;
                const tabEl = document.createElement('div');
                tabEl.className = `custom-tab ${isActive ? 'active' : ''}`;
                let caretHtml = '';
                if (isActive) {
                    caretHtml = `
                        <div class="dropdown ms-2" onclick="event.stopPropagation()">
                            <i class="bi bi-caret-down-fill tab-caret" data-bs-toggle="dropdown"></i>
                            <ul class="dropdown-menu shadow custom-dropdown-menu mt-1">
                                <li><a class="dropdown-item d-flex align-items-center gap-3 delete-tab" href="#" data-id="${tab.id}"><i class="bi bi-trash3"></i> Xóa</a></li>
                                <li><a class="dropdown-item d-flex align-items-center gap-3 duplicate-tab" href="#" data-id="${tab.id}"><i class="bi bi-files"></i> Nhân bản</a></li>
                            </ul>
                        </div>
                    `;
                }
                tabEl.innerHTML = `
                    <div class="tab-icon-wrapper ${isActive ? 'bg-primary text-white' : 'bg-secondary text-white'}">
                        ${getIconForType(tab.type)}
                    </div>
                    <div class="tab-title">${tab.title}</div>
                    ${caretHtml}
                `;
                tabEl.addEventListener('click', (e) => {
                    if (!e.target.closest('.dropdown')) {
                        activeTabId = tab.id;
                        renderExp();
                    }
                });
                tabsListEl.appendChild(tabEl);
            });

            tabsListEl.querySelectorAll('.delete-tab').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const id = btn.getAttribute('data-id');
                    if (tabs.length > 1) {
                        tabs = tabs.filter(t => t.id !== id);
                        if (activeTabId === id) activeTabId = tabs[0].id;
                        renderExp();
                    }
                });
            });

            tabsListEl.querySelectorAll('.duplicate-tab').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const id = btn.getAttribute('data-id');
                    const original = tabs.find(t => t.id === id);
                    if (original) {
                        const newTab = { ...original, id: 'exp_tab_' + Date.now(), title: `${original.title} (Bản sao)` };
                        tabs.push(newTab);
                        activeTabId = newTab.id;
                        renderExp();
                    }
                });
            });
        }

        function renderTabContent() {
            if (!tabContentEl) return;
            const currentTab = tabs.find(t => t.id === activeTabId);
            if (!currentTab) return;
            if (currentTab.type === 'Biểu mẫu tùy ý') {
                tabContentEl.innerHTML = `
                    <div class="table-view p-4">
                        <table class="table exp-table">
                            <thead><tr><th>#</th><th>Thứ nguyên / Sự kiện</th><th>Số phiên</th><th>Người dùng</th></tr></thead>
                            <tbody>
                                <tr><td>1</td><td>page_view</td><td>142</td><td>27</td></tr>
                                <tr><td>2</td><td>scroll</td><td>89</td><td>19</td></tr>
                                <tr><td>3</td><td>session_start</td><td>64</td><td>15</td></tr>
                            </tbody>
                        </table>
                    </div>
                `;
            } else if (currentTab.type === 'Khám phá phễu') {
                tabContentEl.innerHTML = `
                    <div class="p-4 text-center">
                        <h6 class="text-muted mb-3"><i class="bi bi-funnel me-2"></i>Biểu đồ trực quan hóa khám phá phễu</h6>
                        <div class="d-flex justify-content-center gap-3">
                            <div class="p-3 bg-light border rounded" style="width: 140px;"><strong>Bước 1</strong><div class="text-primary fs-5">100%</div></div>
                            <div class="p-3 bg-light border rounded" style="width: 140px;"><strong>Bước 2</strong><div class="text-primary fs-5">45.2%</div></div>
                            <div class="p-3 bg-light border rounded" style="width: 140px;"><strong>Bước 3</strong><div class="text-primary fs-5">18.6%</div></div>
                        </div>
                    </div>
                `;
            } else {
                tabContentEl.innerHTML = `
                    <div class="p-4">
                        <h6 class="text-muted"><i class="bi bi-person me-2"></i>Chi tiết phân tích người dùng: ${currentTab.title}</h6>
                        <p class="text-secondary small">Dữ liệu phân tích báo cáo và các tương tác thời gian thực được tổng hợp theo tài khoản.</p>
                    </div>
                `;
            }
        }

        function renderExp() {
            renderTabsList();
            renderTabContent();
        }

        renderExp();

        tabs1Preview.querySelectorAll('.add-tab-container .dropdown-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const type = e.target.getAttribute('data-type');
                const newId = 'exp_tab_' + Date.now();
                tabs.push({ id: newId, title: type, type: type, count: 0 });
                activeTabId = newId;
                renderExp();
            });
        });
    }

    // M. Đồng bộ URL Hash
    setupTabHashSync();
});
