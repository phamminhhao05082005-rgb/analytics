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
                if (typeof window.updateExpCarouselButtons === 'function') {
                    setTimeout(window.updateExpCarouselButtons, 150);
                }
                if (typeof window.updateRecentCarouselButtons === 'function') {
                    setTimeout(window.updateRecentCarouselButtons, 150);
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

    // A2. Carousel 2 (Exploration Carousel) Logic
    const expTrack = document.getElementById('expTrack');
    const expPrevBtn = document.getElementById('expPrevBtn');
    const expNextBtn = document.getElementById('expNextBtn');
    const expTrackContainer = document.getElementById('expTrackContainer');
    
    if (expTrack && expPrevBtn && expNextBtn && expTrackContainer) {
        const cardWidth = 296; 
        let currentPosition = 0;

        window.updateExpCarouselButtons = () => {
            const containerWidth = expTrackContainer.offsetWidth;
            const trackWidth = expTrack.scrollWidth;

            if (currentPosition >= 0) {
                currentPosition = 0;
                expTrack.style.transform = `translateX(0px)`;
                expPrevBtn.disabled = true;
            } else {
                expPrevBtn.disabled = false;
            }

            if (containerWidth > 0 && Math.abs(currentPosition) + containerWidth >= trackWidth - 10) {
                expNextBtn.disabled = true;
            } else {
                expNextBtn.disabled = false;
            }
        };

        expNextBtn.addEventListener('click', () => {
            const containerWidth = expTrackContainer.offsetWidth;
            const maxScroll = (expTrack.scrollWidth - containerWidth) * -1;
            currentPosition -= cardWidth;
            if (currentPosition < maxScroll) {
                currentPosition = maxScroll;
            }
            expTrack.style.transform = `translateX(${currentPosition}px)`;
            window.updateExpCarouselButtons();
        });

        expPrevBtn.addEventListener('click', () => {
            currentPosition += cardWidth;
            if (currentPosition > 0) {
                currentPosition = 0;
            }
            expTrack.style.transform = `translateX(${currentPosition}px)`;
            window.updateExpCarouselButtons();
        });

        window.addEventListener('resize', window.updateExpCarouselButtons);
        setTimeout(window.updateExpCarouselButtons, 200);
    }

    // A3. Carousel 3 (Recent Carousel) Logic
    const recentTrack = document.getElementById('recentTrack');
    const recentPrevBtn = document.getElementById('recentPrevBtn');
    const recentNextBtn = document.getElementById('recentNextBtn');
    const recentTrackContainer = document.getElementById('recentTrackContainer');
    
    if (recentTrack && recentPrevBtn && recentNextBtn && recentTrackContainer) {
        const cardWidth = 296; 
        let currentPosition = 0;

        window.updateRecentCarouselButtons = () => {
            const containerWidth = recentTrackContainer.offsetWidth;
            const trackWidth = recentTrack.scrollWidth;

            if (currentPosition >= 0) {
                currentPosition = 0;
                recentTrack.style.transform = `translateX(0px)`;
                recentPrevBtn.disabled = true;
            } else {
                recentPrevBtn.disabled = false;
            }

            if (containerWidth > 0 && Math.abs(currentPosition) + containerWidth >= trackWidth - 10) {
                recentNextBtn.disabled = true;
            } else {
                recentNextBtn.disabled = false;
            }
        };

        recentNextBtn.addEventListener('click', () => {
            const containerWidth = recentTrackContainer.offsetWidth;
            const maxScroll = (recentTrack.scrollWidth - containerWidth) * -1;
            currentPosition -= cardWidth;
            if (currentPosition < maxScroll) {
                currentPosition = maxScroll;
            }
            recentTrack.style.transform = `translateX(${currentPosition}px)`;
            window.updateRecentCarouselButtons();
        });

        recentPrevBtn.addEventListener('click', () => {
            currentPosition += cardWidth;
            if (currentPosition > 0) {
                currentPosition = 0;
            }
            recentTrack.style.transform = `translateX(${currentPosition}px)`;
            window.updateRecentCarouselButtons();
        });

        window.addEventListener('resize', window.updateRecentCarouselButtons);
        setTimeout(window.updateRecentCarouselButtons, 200);
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

    // H. Card 4 (Analytics Detailed Bar Chart Card)
    const card4Preview = document.getElementById('preview-card4');
    if (card4Preview) {
        const db4 = {
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

        const xLabelsGroup4 = card4Preview.querySelector('#xLabelsGroup');
        const barGroup4 = card4Preview.querySelector('#barGroup');
        const interactiveLayer4 = card4Preview.querySelector('#interactiveLayer');
        const tooltip4 = card4Preview.querySelector('#chartTooltip');
        const ttDate4 = card4Preview.querySelector('#ttDate');
        const ttContent4 = card4Preview.querySelector('#ttContent');
        const timeRangeBtn4 = card4Preview.querySelector('#timeRangeBtn');
        const dropItems4 = card4Preview.querySelectorAll('.custom-menu .dropdown-item');
        const rowCheckboxes4 = card4Preview.querySelectorAll('.row-checkbox');
        const masterCheckbox4 = card4Preview.querySelector('#masterCheckbox');
        const buildChartBtn4 = card4Preview.querySelector('#buildChartBtn');
        const legendItems4 = card4Preview.querySelectorAll('.legend-item');
        const svgEl4 = card4Preview.querySelector('#mainChart');

        const searchInput4 = card4Preview.querySelector('#searchInput');
        const tableRows4 = card4Preview.querySelectorAll('.data-row');
        const paginationInfo4 = card4Preview.querySelector('#paginationInfo');

        const pageDropItems4 = card4Preview.querySelectorAll('.custom-pagination-menu .dropdown-item');
        const rowsPerPageText4 = card4Preview.querySelector('#rowsPerPageText');

        let plottedKeys4 = ['total', 'all', 'new', 'returning'];

        const colors4 = {
            total: '#174ea6',
            all: '#669df6',
            new: '#8bc34a',
            returning: '#e91e63'
        };

        const iconsHtml4 = {
            all: `<rect width="14" height="14" rx="3" fill="${colors4.all}"/>`,
            new: `<rect width="14" height="14" rx="3" fill="${colors4.new}"/>`,
            returning: `<rect width="14" height="14" rx="3" fill="${colors4.returning}"/>`,
            total: `<rect width="14" height="14" rx="3" fill="${colors4.total}"/>`
        };
        
        const labelsStr4 = { 
            all: "All Users", 
            new: "New Users", 
            returning: "Returning Users", 
            total: "Tổng cộng" 
        };

        if (searchInput4 && paginationInfo4) {
            searchInput4.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                let visibleCount = 0;
                tableRows4.forEach(row => {
                    const linkText = row.querySelector('.row-link')?.textContent.toLowerCase() || '';
                    if (linkText.includes(term)) {
                        row.style.display = '';
                        visibleCount++;
                    } else {
                        row.style.display = 'none';
                    }
                });
                paginationInfo4.textContent = visibleCount > 0 ? `1 – ${visibleCount} trên ${visibleCount}` : `0 – 0 trên 0`;
            });
        }

        pageDropItems4.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                pageDropItems4.forEach(i => {
                    i.classList.remove('active');
                    i.querySelector('.check-icon')?.classList.add('d-none');
                });
                item.classList.add('active');
                item.querySelector('.check-icon')?.classList.remove('d-none');
                if (rowsPerPageText4) rowsPerPageText4.textContent = item.getAttribute('data-val');
            });
        });

        function getCheckedKeys4() {
            const keys = [];
            rowCheckboxes4.forEach(cb => {
                if (cb.checked) {
                    keys.push(cb.getAttribute('data-key'));
                }
            });
            return keys;
        }

        function checkBuildButtonState4() {
            if (!buildChartBtn4) return;
            const checkedKeys = getCheckedKeys4();
            const sortedChecked = [...checkedKeys].sort().join(',');
            const sortedPlotted = [...plottedKeys4].sort().join(',');
            
            if (sortedChecked !== sortedPlotted && checkedKeys.length > 0) {
                buildChartBtn4.classList.remove('btn-outline-secondary', 'bg-white', 'text-muted', 'border-dadce0');
                buildChartBtn4.classList.add('btn-primary', 'text-white');
                buildChartBtn4.removeAttribute('disabled');
            } else {
                buildChartBtn4.classList.add('btn-outline-secondary', 'bg-white', 'text-muted', 'border-dadce0');
                buildChartBtn4.classList.remove('btn-primary', 'text-white');
                buildChartBtn4.setAttribute('disabled', 'true');
            }
        }

        function renderChart4(range) {
            if (!db4[range] || !xLabelsGroup4 || !barGroup4 || !interactiveLayer4) return;
            const data = db4[range];
            
            xLabelsGroup4.innerHTML = '';
            barGroup4.innerHTML = '';
            interactiveLayer4.innerHTML = '';
            
            const ptsArrTemplate = data.pts.total.split(' ');
            
            data.xLabels.forEach((lbl, i) => {
                const xVal = ptsArrTemplate[i].split(',')[0];
                const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                textEl.setAttribute('x', xVal);
                textEl.setAttribute('y', 278);
                textEl.setAttribute('class', 'chart-axis-label');
                textEl.setAttribute('text-anchor', 'middle');
                
                if (range === "Ngày" && i === 0) {
                    textEl.innerHTML = `${lbl.split(' ')[0]}<tspan x="${xVal}" dy="14">${lbl.split(' ')[1]} ${lbl.split(' ')[2]}</tspan>`;
                } else if (range === "Ngày") {
                    textEl.textContent = lbl.split(' ')[0];
                } else {
                    textEl.textContent = lbl;
                }
                xLabelsGroup4.appendChild(textEl);
            });

            ptsArrTemplate.forEach((ptStr, i) => {
                const xVal = parseFloat(ptStr.split(',')[0]);
                const hoverData = data.hoverData[i];
                
                const groupWidth = plottedKeys4.length * 12 + (plottedKeys4.length - 1) * 2;
                let currentX = xVal - groupWidth / 2;

                plottedKeys4.forEach(k => {
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
                    bar.setAttribute('fill', colors4[k]);
                    bar.setAttribute('class', `chart-bar bar-${k} bar-group-${i}`);
                    barGroup4.appendChild(bar);
                    
                    currentX += 14;
                });

                const zoneWidth = range === "Ngày" ? 64 : range === "Tuần" ? 225 : 900;
                const zone = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                zone.setAttribute('x', xVal - zoneWidth / 2);
                zone.setAttribute('y', 20);
                zone.setAttribute('width', zoneWidth);
                zone.setAttribute('height', 240);
                zone.setAttribute('class', 'hover-zone');

                zone.addEventListener('mouseenter', () => {
                    card4Preview.querySelectorAll('.chart-bar').forEach(el => el.classList.add('dimmed'));
                    card4Preview.querySelectorAll(`.bar-group-${i}`).forEach(el => el.classList.remove('dimmed'));
                });

                zone.addEventListener('mousemove', (e) => {
                    if (!svgEl4 || !tooltip4 || !ttDate4 || !ttContent4) return;
                    const pt = svgEl4.createSVGPoint();
                    pt.x = e.clientX;
                    pt.y = e.clientY;
                    const svgP = pt.matrixTransform(svgEl4.getScreenCTM().inverse());
                    
                    let closestKey = null;
                    let minDistance = Infinity;

                    let cX = xVal - groupWidth / 2;
                    plottedKeys4.forEach(k => {
                        const barCenter = cX + 6;
                        const dist = Math.abs(svgP.x - barCenter);
                        if (dist < minDistance) {
                            minDistance = dist;
                            closestKey = k;
                        }
                        cX += 14;
                    });

                    ttDate4.textContent = hoverData.date;
                    ttContent4.innerHTML = '';
                    
                    ['all', 'new', 'returning'].forEach(k => {
                        if (plottedKeys4.includes(k)) {
                            const isClosest = (k === closestKey);
                            ttContent4.innerHTML += `
                                <div class="d-flex justify-content-between align-items-center gap-4 ${isClosest ? 'fw-bold' : ''}" style="${isClosest ? 'background:#f8f9fa; margin:-4px -8px; padding:4px 8px; border-radius:4px;' : ''}">
                                    <div class="d-flex align-items-center gap-2">
                                        <svg width="14" height="14" viewBox="0 0 14 14" style="opacity: ${isClosest ? '1' : '0.5'};">${iconsHtml4[k]}</svg>
                                        <span class="tt-label ${isClosest ? 'fw-bold text-dark' : ''}">${labelsStr4[k]}</span>
                                    </div>
                                    <span class="tt-val ${isClosest ? 'fw-bold text-dark' : ''}">${hoverData.vals[k]}</span>
                                </div>
                            `;
                        }
                    });

                    if (plottedKeys4.includes('total')) {
                        const isClosest = ('total' === closestKey);
                        ttContent4.innerHTML += `
                            <div class="d-flex justify-content-between align-items-center gap-4 mt-1 border-top pt-2 ${isClosest ? 'fw-bold' : ''}" style="${isClosest ? 'background:#f8f9fa; margin:0 -8px; padding:4px 8px; border-radius:4px;' : ''}">
                                <div class="d-flex align-items-center gap-2">
                                    <svg width="14" height="14" viewBox="0 0 14 14">${iconsHtml4['total']}</svg>
                                    <span class="tt-label total">Tổng cộng</span>
                                </div>
                                <span class="tt-val total">${hoverData.vals.total}</span>
                            </div>
                        `;
                    }
                    
                    if (ttContent4.innerHTML !== '') {
                        tooltip4.style.display = 'block';
                    }

                    let left = e.clientX + 15;
                    let top = e.clientY + 15;
                    const ttRect = tooltip4.getBoundingClientRect();
                    if (left + ttRect.width > window.innerWidth) left = e.clientX - ttRect.width - 15;
                    if (top + ttRect.height > window.innerHeight) top = e.clientY - ttRect.height - 15;
                    tooltip4.style.left = `${left}px`;
                    tooltip4.style.top = `${top}px`;
                });

                zone.addEventListener('mouseleave', () => {
                    card4Preview.querySelectorAll('.chart-bar').forEach(el => el.classList.remove('dimmed'));
                    if (tooltip4) tooltip4.style.display = 'none';
                });

                interactiveLayer4.appendChild(zone);
            });

            legendItems4.forEach(item => {
                const k = item.getAttribute('data-key');
                if (plottedKeys4.includes(k)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
            
            checkBuildButtonState4();
        }

        renderChart4("Ngày");

        dropItems4.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                dropItems4.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                const val = item.getAttribute('data-val');
                if (timeRangeBtn4) timeRangeBtn4.innerHTML = `${val}`;
                renderChart4(val);
            });
        });

        rowCheckboxes4.forEach(cb => {
            cb.addEventListener('change', () => {
                checkBuildButtonState4();
            });
        });

        if (masterCheckbox4) {
            masterCheckbox4.addEventListener('click', () => {
                const allChecked = Array.from(rowCheckboxes4).every(cb => cb.checked);
                rowCheckboxes4.forEach(cb => {
                    cb.checked = !allChecked;
                });
                checkBuildButtonState4();
            });
        }

        if (buildChartBtn4) {
            buildChartBtn4.addEventListener('click', () => {
                plottedKeys4 = getCheckedKeys4();
                renderChart4(timeRangeBtn4 ? timeRangeBtn4.textContent.trim() : "Ngày");
            });
        }

        legendItems4.forEach(item => {
            const k = item.getAttribute('data-key');

            item.addEventListener('mouseenter', () => {
                legendItems4.forEach(li => li.classList.add('dimmed'));
                item.classList.remove('dimmed');
                
                card4Preview.querySelectorAll('.chart-bar').forEach(b => {
                    if (b.classList.contains(`bar-${k}`)) {
                        b.classList.remove('dimmed');
                    } else {
                        b.classList.add('dimmed');
                    }
                });
            });

            item.addEventListener('mouseleave', () => {
                legendItems4.forEach(li => li.classList.remove('dimmed'));
                card4Preview.querySelectorAll('.chart-bar').forEach(b => {
                    b.classList.remove('dimmed');
                });
            });
        });
    }

    // I. Card 5 (Funnel Toggle Switch & Search & Pagination)
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

        const searchInput5 = card5Preview.querySelector('#searchInput5') || card5Preview.querySelector('.table-search input');
        const tableRows5 = card5Preview.querySelectorAll('.data-row');
        const paginationInfo5 = card5Preview.querySelector('#paginationInfo5');
        const pageDropItems5 = card5Preview.querySelectorAll('.custom-pagination-menu .dropdown-item');
        const rowsPerPageText5 = card5Preview.querySelector('#rowsPerPageText5');

        if (searchInput5 && tableRows5.length > 0) {
            searchInput5.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase().trim();
                let visibleCount = 0;
                tableRows5.forEach(row => {
                    const text = row.querySelector('.row-link')?.textContent.toLowerCase() || row.textContent.toLowerCase();
                    if (text.includes(term)) {
                        row.style.display = '';
                        visibleCount++;
                    } else {
                        row.style.display = 'none';
                    }
                });
                if (paginationInfo5) {
                    paginationInfo5.textContent = visibleCount > 0 ? `1 – ${visibleCount} trên ${tableRows5.length}` : `0 – 0 trên ${tableRows5.length}`;
                }
            });
        }

        pageDropItems5.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                pageDropItems5.forEach(i => {
                    i.classList.remove('active');
                    i.querySelector('.check-icon')?.classList.add('d-none');
                });
                item.classList.add('active');
                item.querySelector('.check-icon')?.classList.remove('d-none');
                if (rowsPerPageText5) {
                    rowsPerPageText5.textContent = item.getAttribute('data-val');
                }
            });
        });
    }

    const card7Preview = document.getElementById('preview-card7');
    if (card7Preview) {
        const datasets = [
            {
                name: "Số người dùng đang hoạt động",
                yLabels: ["8 N", "6 N", "4 N", "2 N", "0"],
                linePts: "50,115 150,105 250,120 350,110 450,75 550,145 650,150",
                dashedPts: "50,110 150,112 250,115 350,118 450,120 550,160 650,160",
                bandPts: "50,195 150,195 250,198 350,195 450,192 550,205 650,206 650,220 50,220",
                benchmarkPts: "50,195 150,195 250,198 350,195 450,192 550,205 650,206",
                hoverVals: ["4,2 N", "4,6 N", "4,0 N", "4,4 N", "5,8 N", "3,0 N", "2,8 N"],
                dotY: [115, 105, 120, 110, 75, 145, 150]
            },
            {
                name: "Sự kiện quan trọng",
                yLabels: ["8 N", "6 N", "4 N", "2 N", "0"],
                linePts: "50,108 150,100 250,115 350,105 450,63 550,150 650,155",
                dashedPts: "50,118 150,118 250,113 350,110 450,118 550,163 650,163",
                bandPts: "50,195 150,195 250,198 350,195 450,192 550,205 650,206 650,220 50,220",
                benchmarkPts: "50,195 150,195 250,198 350,195 450,192 550,205 650,206",
                hoverVals: ["4,5 N", "4,8 N", "4,2 N", "4,6 N", "6,3 N", "2,8 N", "2,6 N"],
                dotY: [108, 100, 115, 105, 63, 150, 155]
            },
            {
                name: "Phiên",
                yLabels: ["10 N", "7,5 N", "5 N", "2,5 N", "0"],
                linePts: "50,95 150,90 250,105 350,92 450,55 550,135 650,140",
                dashedPts: "50,100 150,102 250,105 350,108 450,110 550,145 650,148",
                bandPts: "50,190 150,192 250,195 350,190 450,188 550,200 650,202 650,220 50,220",
                benchmarkPts: "50,190 150,192 250,195 350,190 450,188 550,200 650,202",
                hoverVals: ["5,2 N", "5,5 N", "4,8 N", "5,4 N", "7,1 N", "3,4 N", "3,2 N"],
                dotY: [95, 90, 105, 92, 55, 135, 140]
            },
            {
                name: "Mua hàng",
                yLabels: ["500", "375", "250", "125", "0"],
                linePts: "50,130 150,120 250,140 350,125 450,70 550,160 650,165",
                dashedPts: "50,145 150,145 250,142 350,138 450,140 550,175 650,175",
                bandPts: "50,198 150,198 250,200 350,198 450,195 550,208 650,210 650,220 50,220",
                benchmarkPts: "50,198 150,198 250,200 350,198 450,195 550,208 650,210",
                hoverVals: ["225", "250", "200", "235", "375", "150", "140"],
                dotY: [130, 120, 140, 125, 70, 160, 165]
            }
        ];

        const hoverDates = ["21 thg", "22 thg", "23 thg", "24 thg", "25 thg", "26 thg", "27 thg"];
        let activeIdx = 0;

        const yLabelEls = card7Preview.querySelectorAll('.y-label');
        const chartLine = card7Preview.querySelector('#chartLine7') || card7Preview.querySelector('#chartLine');
        const chartDashedLine = card7Preview.querySelector('#chartDashedLine7') || card7Preview.querySelector('#chartDashedLine');
        const chartBand = card7Preview.querySelector('#chartBand7') || card7Preview.querySelector('#chartBand');
        const benchmarkLine = card7Preview.querySelector('#benchmarkLine7') || card7Preview.querySelector('#benchmarkLine');
        const metricBoxes = card7Preview.querySelectorAll('.metric-box');
        const ttName = card7Preview.querySelector('#ttName7') || card7Preview.querySelector('#ttName');
        const ttDate = card7Preview.querySelector('#ttDate7') || card7Preview.querySelector('#ttDate');
        const ttVal = card7Preview.querySelector('#ttVal7') || card7Preview.querySelector('#ttVal');
        const popover = card7Preview.querySelector('#tooltipPopover7') || card7Preview.querySelector('#tooltipPopover');
        const hoverTriggers = card7Preview.querySelectorAll('.hover-trigger');

        metricBoxes.forEach((box, index) => {
            box.addEventListener('click', () => {
                metricBoxes.forEach(b => b.classList.remove('active'));
                box.classList.add('active');

                activeIdx = index;
                const data = datasets[activeIdx];

                yLabelEls.forEach((el, i) => {
                    if (data.yLabels[i]) el.textContent = data.yLabels[i];
                });

                if (chartLine) chartLine.setAttribute('points', data.linePts);
                if (chartDashedLine) chartDashedLine.setAttribute('points', data.dashedPts);
                if (chartBand) chartBand.setAttribute('points', data.bandPts);
                if (benchmarkLine) benchmarkLine.setAttribute('points', data.benchmarkPts);

                for (let i = 0; i < 7; i++) {
                    const dot = card7Preview.querySelector(`#dot7-${i}`) || card7Preview.querySelector(`#dot-${i}`);
                    if (dot) dot.setAttribute('cy', data.dotY[i]);
                }
            });
        });

        hoverTriggers.forEach(trigger => {
            const i = trigger.getAttribute('data-idx');
            trigger.addEventListener('mouseenter', () => {
                const vline = card7Preview.querySelector(`#vline7-${i}`) || card7Preview.querySelector(`#vline-${i}`);
                const dot = card7Preview.querySelector(`#dot7-${i}`) || card7Preview.querySelector(`#dot-${i}`);
                if (vline) vline.style.opacity = '1';
                if (dot) dot.style.opacity = '1';

                if (ttDate) ttDate.textContent = hoverDates[i];
                if (ttName) ttName.textContent = datasets[activeIdx].name;
                if (ttVal) ttVal.textContent = datasets[activeIdx].hoverVals[i];
                if (popover) popover.style.display = 'block';
            });

            trigger.addEventListener('mousemove', (e) => {
                if (!popover) return;
                let left = e.clientX + 15;
                let top = e.clientY - 30;
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

            trigger.addEventListener('mouseleave', () => {
                const vline = card7Preview.querySelector(`#vline7-${i}`) || card7Preview.querySelector(`#vline-${i}`);
                const dot = card7Preview.querySelector(`#dot7-${i}`) || card7Preview.querySelector(`#dot-${i}`);
                if (vline) vline.style.opacity = '0';
                if (dot) dot.style.opacity = '0';
                if (popover) popover.style.display = 'none';
            });
        });

        const slider = card7Preview.querySelector('#metricSlider7') || card7Preview.querySelector('#metricSlider');
        const prevBtn = card7Preview.querySelector('#navPrev7') || card7Preview.querySelector('#navPrev');
        const nextBtn = card7Preview.querySelector('#navNext7') || card7Preview.querySelector('#navNext');
        let sliderPos = 0;

        function updateNavButtons() {
            if (!slider || !prevBtn || !nextBtn) return;
            const maxScroll = -(slider.scrollWidth - slider.parentElement.offsetWidth);
            if (sliderPos >= 0) {
                prevBtn.classList.add('disabled');
            } else {
                prevBtn.classList.remove('disabled');
            }
            if (sliderPos <= maxScroll || maxScroll >= 0) {
                nextBtn.classList.add('disabled');
            } else {
                nextBtn.classList.remove('disabled');
            }
        }

        if (nextBtn && slider) {
            nextBtn.addEventListener('click', () => {
                const maxScroll = -(slider.scrollWidth - slider.parentElement.offsetWidth);
                if (sliderPos > maxScroll) {
                    sliderPos -= 232;
                    if (sliderPos < maxScroll) sliderPos = maxScroll;
                    slider.style.transform = `translateX(${sliderPos}px)`;
                    updateNavButtons();
                }
            });
        }

        if (prevBtn && slider) {
            prevBtn.addEventListener('click', () => {
                if (sliderPos < 0) {
                    sliderPos += 232;
                    if (sliderPos > 0) sliderPos = 0;
                    slider.style.transform = `translateX(${sliderPos}px)`;
                    updateNavButtons();
                }
            });
        }

        updateNavButtons();
        window.addEventListener('resize', updateNavButtons);
    }

    // K. Card 8 (Analytics Detailed Multi-Line Chart with Time Range)
    const card8Preview = document.getElementById('preview-card8');
    if (card8Preview) {
        const db8 = {
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

        const xLabelsGroup8 = card8Preview.querySelector('#xLabelsGroup');
        const interactiveLayer8 = card8Preview.querySelector('#interactiveLayer8') || card8Preview.querySelector('#interactiveLayer');
        const staticEndMarkersGroup8 = card8Preview.querySelector('#staticEndMarkersGroup');
        const tooltip8 = card8Preview.querySelector('#chartTooltip8') || card8Preview.querySelector('#chartTooltip');
        const ttDate8 = card8Preview.querySelector('#ttDate8') || card8Preview.querySelector('#ttDate');
        const ttContent8 = card8Preview.querySelector('#ttContent8') || card8Preview.querySelector('#ttContent');
        const timeRangeBtn8 = card8Preview.querySelector('#timeRangeBtn');
        const dropItems8 = card8Preview.querySelectorAll('.custom-menu .dropdown-item');
        const rowCheckboxes8 = card8Preview.querySelectorAll('.row-checkbox');
        const masterCheckbox8 = card8Preview.querySelector('#masterCheckbox');
        const buildChartBtn8 = card8Preview.querySelector('#buildChartBtn');
        const legendItems8 = card8Preview.querySelectorAll('.legend-item');
        const svgEl8 = card8Preview.querySelector('#mainChart8') || card8Preview.querySelector('#mainChart');

        const searchInput8 = card8Preview.querySelector('#searchInput');
        const tableRows8 = card8Preview.querySelectorAll('.data-row');
        const paginationInfo8 = card8Preview.querySelector('#paginationInfo');

        const pageDropItems8 = card8Preview.querySelectorAll('.custom-pagination-menu .dropdown-item');
        const rowsPerPageText8 = card8Preview.querySelector('#rowsPerPageText');

        let plottedKeys8 = ['new', 'clearance', 'apparel', 'retro'];

        const iconsHtml8 = {
            new: '<circle cx="7" cy="7" r="4" fill="#4285f4"/>',
            clearance: '<rect x="3" y="3" width="8" height="8" fill="#8bc34a"/>',
            apparel: '<polygon points="7,3 11,7 7,11 3,7" fill="#e91e63"/>',
            retro: '<polygon points="3,4 11,4 7,10" fill="#fbbc04"/>'
        };
        
        const labelsStr8 = { 
            new: "/shop/new", 
            clearance: "/shop/clearance", 
            apparel: "/shop/apparel", 
            retro: "/shop/collections/1998-retro-collection" 
        };

        if (searchInput8 && paginationInfo8) {
            searchInput8.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                let visibleCount = 0;
                tableRows8.forEach(row => {
                    const linkText = row.querySelector('.row-link')?.textContent.toLowerCase() || '';
                    if (linkText.includes(term)) {
                        row.style.display = '';
                        visibleCount++;
                    } else {
                        row.style.display = 'none';
                    }
                });
                paginationInfo8.textContent = visibleCount > 0 ? `1 – ${visibleCount} trên ${visibleCount}` : `0 – 0 trên 0`;
            });
        }

        pageDropItems8.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                pageDropItems8.forEach(i => {
                    i.classList.remove('active');
                    i.querySelector('.check-icon')?.classList.add('d-none');
                });
                item.classList.add('active');
                item.querySelector('.check-icon')?.classList.remove('d-none');
                if (rowsPerPageText8) rowsPerPageText8.textContent = item.getAttribute('data-val');
            });
        });

        function getCheckedKeys8() {
            const keys = [];
            rowCheckboxes8.forEach(cb => {
                if (cb.checked) {
                    keys.push(cb.getAttribute('data-key'));
                }
            });
            return keys;
        }

        function checkBuildButtonState8() {
            if (!buildChartBtn8) return;
            const checkedKeys = getCheckedKeys8();
            const sortedChecked = [...checkedKeys].sort().join(',');
            const sortedPlotted = [...plottedKeys8].sort().join(',');
            
            if (sortedChecked !== sortedPlotted && checkedKeys.length > 0) {
                buildChartBtn8.classList.remove('btn-outline-secondary', 'bg-white', 'text-muted', 'border-dadce0');
                buildChartBtn8.classList.add('btn-primary', 'text-white');
                buildChartBtn8.removeAttribute('disabled');
            } else {
                buildChartBtn8.classList.add('btn-outline-secondary', 'bg-white', 'text-muted', 'border-dadce0');
                buildChartBtn8.classList.remove('btn-primary', 'text-white');
                buildChartBtn8.setAttribute('disabled', 'true');
            }
        }

        function updateChartVisibility8() {
            const allKeys = ['new', 'clearance', 'apparel', 'retro'];
            
            allKeys.forEach(k => {
                const el = card8Preview.querySelector(`#line${k.charAt(0).toUpperCase() + k.slice(1)}`);
                if (el) el.style.display = plottedKeys8.includes(k) ? 'block' : 'none';
            });

            legendItems8.forEach(item => {
                const k = item.getAttribute('data-key');
                if (plottedKeys8.includes(k)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
            
            checkBuildButtonState8();
            renderChart8(timeRangeBtn8 ? timeRangeBtn8.textContent.trim() : "Ngày");
        }

        function drawMarker8(k, cx, cy, groupEl, isHover) {
            let shape;
            if (k === 'new') {
                shape = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                shape.setAttribute('cx', cx); shape.setAttribute('cy', cy); shape.setAttribute('r', 4);
            } else if (k === 'clearance') {
                shape = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                shape.setAttribute('x', cx - 4); shape.setAttribute('y', cy - 4); shape.setAttribute('width', 8); shape.setAttribute('height', 8);
            } else if (k === 'apparel') {
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

        function renderChart8(range) {
            if (!db8[range] || !xLabelsGroup8 || !interactiveLayer8) return;
            const data = db8[range];
            
            xLabelsGroup8.innerHTML = '';
            const ptsArrTemplate = data.pts.new.split(' ');
            
            data.xLabels.forEach((lbl, i) => {
                const xVal = ptsArrTemplate[i].split(',')[0];
                const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                textEl.setAttribute('x', xVal);
                textEl.setAttribute('y', 238);
                textEl.setAttribute('class', 'chart-axis-label');
                textEl.setAttribute('text-anchor', 'middle');
                
                if (range === "Ngày" && i === 0) {
                    textEl.innerHTML = `${lbl.split(' ')[0]}<tspan x="${xVal}" dy="14">${lbl.split(' ')[1]}</tspan>`;
                } else {
                    textEl.textContent = lbl;
                }
                xLabelsGroup8.appendChild(textEl);
            });

            ['new', 'clearance', 'apparel', 'retro'].forEach(k => {
                const line = card8Preview.querySelector(`#line${k.charAt(0).toUpperCase() + k.slice(1)}`);
                if (line) {
                    line.setAttribute('points', data.pts[k]);
                    line.style.display = plottedKeys8.includes(k) ? 'block' : 'none';
                }
            });

            if (staticEndMarkersGroup8) {
                staticEndMarkersGroup8.innerHTML = '';
                const lastIndex = ptsArrTemplate.length - 1;
                plottedKeys8.forEach(k => {
                    const lastPt = data.pts[k].split(' ')[lastIndex].split(',');
                    drawMarker8(k, parseFloat(lastPt[0]), parseFloat(lastPt[1]), staticEndMarkersGroup8, false);
                });
            }

            interactiveLayer8.innerHTML = '';
            
            ptsArrTemplate.forEach((ptStr, i) => {
                const xVal = parseFloat(ptStr.split(',')[0]);
                const hoverData = data.hoverData[i];
                
                const vLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                vLine.setAttribute('x1', xVal); vLine.setAttribute('y1', 20);
                vLine.setAttribute('x2', xVal); vLine.setAttribute('y2', 220);
                vLine.setAttribute('class', 'hover-vline');
                vLine.setAttribute('id', `c8-vl-${i}`);
                interactiveLayer8.appendChild(vLine);

                const shapes = [];
                ['new', 'clearance', 'apparel', 'retro'].forEach(k => {
                    const pY = parseFloat(data.pts[k].split(' ')[i].split(',')[1]);
                    const shape = drawMarker8(k, xVal, pY, interactiveLayer8, true);
                    shape.classList.add(`c8-pt-group-${i}`);
                    shapes.push(shape);
                });

                const zoneWidth = range === "Ngày" ? 80 : range === "Tuần" ? 200 : 500;
                const zone = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                zone.setAttribute('x', xVal - zoneWidth / 2);
                zone.setAttribute('y', 20);
                zone.setAttribute('width', zoneWidth);
                zone.setAttribute('height', 200);
                zone.setAttribute('class', 'hover-zone');

                zone.addEventListener('mouseenter', () => {
                    const targetVl = card8Preview.querySelector(`#c8-vl-${i}`);
                    if (targetVl) targetVl.style.opacity = '1';
                    card8Preview.querySelectorAll(`.c8-pt-group-${i}`).forEach(el => {
                        const k = Array.from(el.classList).find(c => c.startsWith('point-'))?.split('-')[1];
                        if (k && plottedKeys8.includes(k)) el.style.opacity = '1';
                    });
                });

                zone.addEventListener('mousemove', (e) => {
                    if (!svgEl8 || !tooltip8 || !ttDate8 || !ttContent8) return;
                    const pt = svgEl8.createSVGPoint();
                    pt.x = e.clientX;
                    pt.y = e.clientY;
                    const svgP = pt.matrixTransform(svgEl8.getScreenCTM().inverse());
                    const mouseY = svgP.y;

                    let closestKey = null;
                    let minDistance = 30;

                    plottedKeys8.forEach(k => {
                        const pY = parseFloat(data.pts[k].split(' ')[i].split(',')[1]);
                        const dist = Math.abs(mouseY - pY);
                        if (dist < minDistance) {
                            minDistance = dist;
                            closestKey = k;
                        }
                    });

                    card8Preview.querySelectorAll('.chart-line').forEach(l => {
                        l.classList.remove('highlighted');
                        l.classList.add('dimmed');
                    });
                    legendItems8.forEach(li => li.classList.add('dimmed'));

                    if (closestKey) {
                        const lineEl = card8Preview.querySelector(`#line${closestKey.charAt(0).toUpperCase() + closestKey.slice(1)}`);
                        if (lineEl) {
                            lineEl.classList.remove('dimmed');
                            lineEl.classList.add('highlighted');
                        }
                        const leg = card8Preview.querySelector(`.legend-item[data-key="${closestKey}"]`);
                        if (leg) leg.classList.remove('dimmed');
                    } else {
                        card8Preview.querySelectorAll('.chart-line').forEach(l => l.classList.remove('dimmed'));
                        legendItems8.forEach(li => li.classList.remove('dimmed'));
                    }

                    ttDate8.textContent = hoverData.date;
                    ttContent8.innerHTML = '';
                    
                    ['new', 'clearance', 'apparel', 'retro'].forEach(k => {
                        if (plottedKeys8.includes(k)) {
                            const isClosest = (k === closestKey);
                            ttContent8.innerHTML += `
                                <div class="d-flex justify-content-between align-items-center gap-4 ${isClosest ? 'fw-bold' : ''}" style="${isClosest ? 'background:#f8f9fa; margin:-4px -8px; padding:4px 8px; border-radius:4px;' : ''}">
                                    <div class="d-flex align-items-center gap-2">
                                        <svg width="14" height="14" viewBox="0 0 14 14" style="opacity: ${isClosest ? '1' : '0.5'};">${iconsHtml8[k]}</svg>
                                        <span class="tt-label ${isClosest ? 'fw-bold text-dark' : ''}">${labelsStr8[k]}</span>
                                    </div>
                                    <span class="tt-val ${isClosest ? 'fw-bold text-dark' : ''}">${hoverData.vals[k]}</span>
                                </div>
                            `;
                        }
                    });
                    
                    if (ttContent8.innerHTML !== '') {
                        tooltip8.style.display = 'block';
                    }

                    let left = e.clientX + 15;
                    let top = e.clientY + 15;
                    const ttRect = tooltip8.getBoundingClientRect();
                    if (left + ttRect.width > window.innerWidth) left = e.clientX - ttRect.width - 15;
                    if (top + ttRect.height > window.innerHeight) top = e.clientY - ttRect.height - 15;
                    tooltip8.style.left = `${left}px`;
                    tooltip8.style.top = `${top}px`;
                });

                zone.addEventListener('mouseleave', () => {
                    const targetVl = card8Preview.querySelector(`#c8-vl-${i}`);
                    if (targetVl) targetVl.style.opacity = '0';
                    card8Preview.querySelectorAll(`.c8-pt-group-${i}`).forEach(el => el.style.opacity = '0');
                    if (tooltip8) tooltip8.style.display = 'none';
                    
                    card8Preview.querySelectorAll('.chart-line').forEach(l => {
                        l.classList.remove('dimmed', 'highlighted');
                    });
                    legendItems8.forEach(li => li.classList.remove('dimmed'));
                });

                interactiveLayer8.appendChild(zone);
            });
        }

        renderChart8("Ngày");

        dropItems8.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                dropItems8.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                const val = item.getAttribute('data-val');
                if (timeRangeBtn8) timeRangeBtn8.innerHTML = `${val}`;
                renderChart8(val);
            });
        });

        rowCheckboxes8.forEach(cb => {
            cb.addEventListener('change', () => {
                checkBuildButtonState8();
            });
        });

        if (masterCheckbox8) {
            masterCheckbox8.addEventListener('click', () => {
                const allChecked = Array.from(rowCheckboxes8).every(cb => cb.checked);
                rowCheckboxes8.forEach(cb => {
                    cb.checked = !allChecked;
                });
                checkBuildButtonState8();
            });
        }

        if (buildChartBtn8) {
            buildChartBtn8.addEventListener('click', () => {
                plottedKeys8 = getCheckedKeys8();
                updateChartVisibility8();
            });
        }

        legendItems8.forEach(item => {
            const k = item.getAttribute('data-key');
            const lineEl = card8Preview.querySelector(`#line${k.charAt(0).toUpperCase() + k.slice(1)}`);

            item.addEventListener('mouseenter', () => {
                legendItems8.forEach(li => li.classList.add('dimmed'));
                item.classList.remove('dimmed');
                
                card8Preview.querySelectorAll('.chart-line').forEach(l => l.classList.add('dimmed'));
                if (lineEl) {
                    lineEl.classList.remove('dimmed');
                    lineEl.classList.add('highlighted');
                }
            });

            item.addEventListener('mouseleave', () => {
                legendItems8.forEach(li => li.classList.remove('dimmed'));
                card8Preview.querySelectorAll('.chart-line').forEach(l => {
                    l.classList.remove('dimmed', 'highlighted');
                });
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

    // N. Table 1 (Analytics Data Table) Interactions
    const table1Preview = document.getElementById('preview-table1');
    if (table1Preview) {
        const tableSearch = table1Preview.querySelector('.table-search input');
        const rows = table1Preview.querySelectorAll('.custom-data-table tbody tr:not(.total-row)');
        const selectAllBtn = table1Preview.querySelector('.minus-square');
        const checkboxes = table1Preview.querySelectorAll('.custom-data-table tbody .custom-checkbox');

        if (tableSearch && rows.length > 0) {
            tableSearch.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase().trim();
                rows.forEach(r => {
                    const text = r.textContent.toLowerCase();
                    r.style.display = text.includes(query) ? '' : 'none';
                });
            });
        }

        if (selectAllBtn && checkboxes.length > 0) {
            let allChecked = false;
            selectAllBtn.addEventListener('click', () => {
                allChecked = !allChecked;
                checkboxes.forEach(cb => {
                    cb.checked = allChecked;
                    const tr = cb.closest('tr');
                    if (tr && !tr.classList.contains('total-row')) {
                        tr.style.backgroundColor = allChecked ? '#f1f3f4' : '';
                    }
                });
            });

            checkboxes.forEach(cb => {
                cb.addEventListener('change', () => {
                    const tr = cb.closest('tr');
                    if (tr && !tr.classList.contains('total-row')) {
                        tr.style.backgroundColor = cb.checked ? '#f1f3f4' : '';
                    }
                });
            });
        }
    }

    // O. Card 10 (Realtime Card Dropdowns)
    const card10Preview = document.getElementById('preview-card10');
    if (card10Preview) {
        function setupCard10Dropdown(menuId, btnId) {
            const menu = card10Preview.querySelector('#' + menuId);
            const btn = card10Preview.querySelector('#' + btnId);
            if (!menu || !btn) return;
            const items = menu.querySelectorAll('.dropdown-item');
            items.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    items.forEach(i => i.classList.remove('active'));
                    item.classList.add('active');
                    const val = item.getAttribute('data-val');
                    if (val && val !== 'Chọn giúp tôi') {
                        btn.innerHTML = `${val} <i class="bi bi-caret-down-fill" style="font-size: 10px;"></i>`;
                    }
                });
            });
        }
        setupCard10Dropdown('menuDim1_10', 'btnDim1_10');
    }

    // P. Card 11 (Analytics Dashboard Card Slider & Popover)
    const card11Preview = document.getElementById('preview-card11');
    if (card11Preview) {
        const track11 = card11Preview.querySelector('#metricTrack11');
        const prevBtn11 = card11Preview.querySelector('#metricPrevBtn11');
        const nextBtn11 = card11Preview.querySelector('#metricNextBtn11');
        
        let currentPos11 = 0;
        const itemWidth11 = 220;

        if (track11 && prevBtn11 && nextBtn11) {
            nextBtn11.addEventListener('click', () => {
                const maxScroll = -(track11.scrollWidth - track11.parentElement.offsetWidth);
                if (currentPos11 > maxScroll) {
                    currentPos11 -= itemWidth11;
                    if (currentPos11 < maxScroll) currentPos11 = maxScroll;
                    track11.style.transform = `translateX(${currentPos11}px)`;
                }
            });

            prevBtn11.addEventListener('click', () => {
                if (currentPos11 < 0) {
                    currentPos11 += itemWidth11;
                    if (currentPos11 > 0) currentPos11 = 0;
                    track11.style.transform = `translateX(${currentPos11}px)`;
                }
            });
        }

        const metricItems11 = card11Preview.querySelectorAll('.metric-box');
        metricItems11.forEach(item => {
            item.addEventListener('click', () => {
                metricItems11.forEach(i => {
                    i.classList.remove('active');
                    const t = i.querySelector('.metric-title');
                    if (t) {
                        t.classList.remove('text-primary');
                        t.classList.add('text-secondary');
                    }
                });
                item.classList.add('active');
                const title = item.querySelector('.metric-title');
                if (title) {
                    title.classList.remove('text-secondary');
                    title.classList.add('text-primary');
                }
            });
        });

        const chartData11 = [
            { x: 50, yMain: 110, yDash: 130, date: 'Thứ 2 21 thg 9 vs Thứ 2 14 thg 9', val: '4.102', trend: '↓ 4,2%', isUp: false },
            { x: 160, yMain: 100, yDash: 90, date: 'Thứ 3 22 thg 9 vs Thứ 3 15 thg 9', val: '4.805', trend: '↑ 2,1%', isUp: true },
            { x: 270, yMain: 120, yDash: 115, date: 'Thứ 4 23 thg 9 vs Thứ 4 16 thg 9', val: '4.000', trend: '↓ 1,5%', isUp: false },
            { x: 380, yMain: 130, yDash: 135, date: 'Thứ 5 24 thg 9 vs Thứ 5 17 thg 9', val: '3.800', trend: '↑ 0,8%', isUp: true },
            { x: 490, yMain: 105, yDash: 140, date: 'Thứ 6 25 thg 9 vs Thứ 6 18 thg 9', val: '4.492', trend: '↑ 24,5%', isUp: true },
            { x: 600, yMain: 160, yDash: 145, date: 'Thứ 7 26 thg 9 vs Thứ 7 19 thg 9', val: '2.500', trend: '↓ 12,0%', isUp: false },
            { x: 710, yMain: 190, yDash: 130, date: 'CN 27 thg 9 vs CN 20 thg 9', val: '1.200', trend: '↓ 30,5%', isUp: false }
        ];

        const layer11 = card11Preview.querySelector('#interactiveLayer11');
        const popover11 = card11Preview.querySelector('#chartPopover11');
        const popDate11 = card11Preview.querySelector('#popDate11');
        const popVal11 = card11Preview.querySelector('#popVal11');
        const popTrend11 = card11Preview.querySelector('#popTrend11');
        const zoneWidth11 = 110;

        if (layer11 && popover11 && popDate11 && popVal11 && popTrend11) {
            layer11.innerHTML = '';
            chartData11.forEach((data, index) => {
                const vLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                vLine.setAttribute('x1', data.x);
                vLine.setAttribute('y1', 20);
                vLine.setAttribute('x2', data.x);
                vLine.setAttribute('y2', 220);
                vLine.setAttribute('class', 'hover-vline');
                vLine.setAttribute('id', `c11-vl-${index}`);
                layer11.appendChild(vLine);

                const dotDash = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                dotDash.setAttribute('cx', data.x);
                dotDash.setAttribute('cy', data.yDash);
                dotDash.setAttribute('r', 4);
                dotDash.setAttribute('class', 'hover-dot-dash');
                dotDash.setAttribute('id', `c11-ddash-${index}`);
                layer11.appendChild(dotDash);

                const dotMain = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                dotMain.setAttribute('cx', data.x);
                dotMain.setAttribute('cy', data.yMain);
                dotMain.setAttribute('r', 4);
                dotMain.setAttribute('class', 'hover-dot-main');
                dotMain.setAttribute('id', `c11-dmain-${index}`);
                layer11.appendChild(dotMain);

                const zone = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                zone.setAttribute('x', data.x - zoneWidth11 / 2);
                zone.setAttribute('y', 0);
                zone.setAttribute('width', zoneWidth11);
                zone.setAttribute('height', 250);
                zone.setAttribute('class', 'hover-zone');

                zone.addEventListener('mouseenter', () => {
                    const vl = card11Preview.querySelector(`#c11-vl-${index}`);
                    const dd = card11Preview.querySelector(`#c11-ddash-${index}`);
                    const dm = card11Preview.querySelector(`#c11-dmain-${index}`);
                    if (vl) vl.style.opacity = '1';
                    if (dd) dd.style.opacity = '1';
                    if (dm) dm.style.opacity = '1';

                    popDate11.textContent = data.date;
                    popVal11.textContent = data.val;
                    
                    if (data.isUp) {
                        popTrend11.innerHTML = `<i class="bi bi-arrow-up"></i> ${data.trend.replace('↑ ', '')}`;
                        popTrend11.className = 'popover-trend fw-medium text-success';
                    } else {
                        popTrend11.innerHTML = `<i class="bi bi-arrow-down"></i> ${data.trend.replace('↓ ', '')}`;
                        popTrend11.className = 'popover-trend fw-medium text-danger';
                    }
                    popover11.style.display = 'block';
                });

                zone.addEventListener('mousemove', (e) => {
                    let left = e.clientX + 15;
                    let top = e.clientY - 40;
                    const pRect = popover11.getBoundingClientRect();
                    if (left + pRect.width > window.innerWidth) {
                        left = e.clientX - pRect.width - 15;
                    }
                    popover11.style.left = `${left}px`;
                    popover11.style.top = `${top}px`;
                });

                zone.addEventListener('mouseleave', () => {
                    const vl = card11Preview.querySelector(`#c11-vl-${index}`);
                    const dd = card11Preview.querySelector(`#c11-ddash-${index}`);
                    const dm = card11Preview.querySelector(`#c11-dmain-${index}`);
                    if (vl) vl.style.opacity = '0';
                    if (dd) dd.style.opacity = '0';
                    if (dm) dm.style.opacity = '0';
                    popover11.style.display = 'none';
                });

                layer11.appendChild(zone);
            });
        }
    }

    // Q. Card 12 (Analytics Acquisition Bar Chart Card Popover)
    const card12Preview = document.getElementById('preview-card12');
    if (card12Preview) {
        const hoverZones12 = card12Preview.querySelectorAll('.hover-zone');
        const popover12 = card12Preview.querySelector('#chartPopover12');
        const popName12 = card12Preview.querySelector('#popName12');
        const popVal12 = card12Preview.querySelector('#popVal12');
        const popTrend12 = card12Preview.querySelector('#popTrend12');
        const chartRows12 = card12Preview.querySelectorAll('.chart-row');

        if (popover12 && popName12 && popVal12 && popTrend12) {
            hoverZones12.forEach(zone => {
                zone.addEventListener('mouseenter', () => {
                    chartRows12.forEach(row => {
                        if (row !== zone.parentElement) {
                            row.classList.add('dimmed');
                        }
                    });

                    const name = zone.getAttribute('data-name');
                    const val = zone.getAttribute('data-val');
                    const trend = zone.getAttribute('data-trend');
                    const isUp = zone.getAttribute('data-isup') === 'true';

                    popName12.textContent = name;
                    popVal12.textContent = val;
                    
                    if (trend === '0,0%') {
                        popTrend12.innerHTML = trend;
                        popTrend12.className = 'popover-trend fw-medium text-secondary';
                    } else if (isUp) {
                        popTrend12.innerHTML = `<i class="bi bi-arrow-up"></i> ${trend.replace('↑ ', '')}`;
                        popTrend12.className = 'popover-trend fw-medium text-success';
                    } else {
                        popTrend12.innerHTML = `<i class="bi bi-arrow-down"></i> ${trend.replace('↓ ', '')}`;
                        popTrend12.className = 'popover-trend fw-medium text-danger';
                    }

                    popover12.style.display = 'block';
                });

                zone.addEventListener('mousemove', (e) => {
                    let left = e.clientX + 15;
                    let top = e.clientY + 15;
                    const pRect = popover12.getBoundingClientRect();
                    if (left + pRect.width > window.innerWidth) {
                        left = e.clientX - pRect.width - 15;
                    }
                    if (top + pRect.height > window.innerHeight) {
                        top = e.clientY - pRect.height - 15;
                    }
                    popover12.style.left = `${left}px`;
                    popover12.style.top = `${top}px`;
                });

                zone.addEventListener('mouseleave', () => {
                    chartRows12.forEach(row => {
                        row.classList.remove('dimmed');
                    });
                    popover12.style.display = 'none';
                });
            });
        }
    }

    // R. Card 13 (Analytics User Activity Over Time Card Popover)
    const card13Preview = document.getElementById('preview-card13');
    if (card13Preview) {
        const chartData13 = [
            { x: 30, date: '21 thg 9, 2026', y30: 55, y7: 175, y1: 215, val30: '100.521', val7: '28.412', val1: '3.204' },
            { x: 90, date: '22 thg 9, 2026', y30: 55, y7: 175, y1: 215, val30: '101.102', val7: '28.350', val1: '3.150' },
            { x: 150, date: '23 thg 9, 2026', y30: 54, y7: 176, y1: 216, val30: '101.405', val7: '27.900', val1: '3.080' },
            { x: 210, date: '24 thg 9, 2026', y30: 53, y7: 176, y1: 217, val30: '101.890', val7: '27.850', val1: '2.950' },
            { x: 270, date: '25 thg 9, 2026', y30: 52, y7: 174, y1: 215, val30: '102.300', val7: '28.600', val1: '3.310' },
            { x: 330, date: '26 thg 9, 2026', y30: 54, y7: 175, y1: 218, val30: '101.500', val7: '28.450', val1: '2.850' },
            { x: 390, date: '27 thg 9, 2026', y30: 60, y7: 188, y1: 227, val30: '97.000', val7: '24.000', val1: '1.600' }
        ];

        const layer13 = card13Preview.querySelector('#interactiveLayer13');
        const popover13 = card13Preview.querySelector('#chartPopover13');
        const popDate13 = card13Preview.querySelector('#popDate13');
        const pop30_13 = card13Preview.querySelector('#pop30_13');
        const pop7_13 = card13Preview.querySelector('#pop7_13');
        const pop1_13 = card13Preview.querySelector('#pop1_13');
        const zoneWidth13 = 60;

        if (layer13 && popover13 && popDate13 && pop30_13 && pop7_13 && pop1_13) {
            layer13.innerHTML = '';
            chartData13.forEach((data, index) => {
                const vLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                vLine.setAttribute('x1', data.x);
                vLine.setAttribute('y1', 20);
                vLine.setAttribute('x2', data.x);
                vLine.setAttribute('y2', 230);
                vLine.setAttribute('class', 'hover-vline');
                vLine.setAttribute('id', `c13-vl-${index}`);
                layer13.appendChild(vLine);

                const d30 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                d30.setAttribute('cx', data.x);
                d30.setAttribute('cy', data.y30);
                d30.setAttribute('r', 4);
                d30.setAttribute('fill', '#4285f4');
                d30.setAttribute('class', 'hover-dot');
                d30.setAttribute('id', `c13-d30-${index}`);
                layer13.appendChild(d30);

                const d7 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                d7.setAttribute('x', data.x - 4);
                d7.setAttribute('y', data.y7 - 4);
                d7.setAttribute('width', 8);
                d7.setAttribute('height', 8);
                d7.setAttribute('fill', '#8bc34a');
                d7.setAttribute('class', 'hover-dot');
                d7.setAttribute('id', `c13-d7-${index}`);
                layer13.appendChild(d7);

                const d1 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                d1.setAttribute('points', `${data.x},${data.y1-4} ${data.x+4},${data.y1} ${data.x},${data.y1+4} ${data.x-4},${data.y1}`);
                d1.setAttribute('fill', '#e91e63');
                d1.setAttribute('class', 'hover-dot');
                d1.setAttribute('id', `c13-d1-${index}`);
                layer13.appendChild(d1);

                const zone = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                zone.setAttribute('x', data.x - zoneWidth13 / 2);
                zone.setAttribute('y', 0);
                zone.setAttribute('width', zoneWidth13);
                zone.setAttribute('height', 260);
                zone.setAttribute('class', 'hover-zone');

                zone.addEventListener('mouseenter', () => {
                    const vl = card13Preview.querySelector(`#c13-vl-${index}`);
                    const dot30 = card13Preview.querySelector(`#c13-d30-${index}`);
                    const dot7 = card13Preview.querySelector(`#c13-d7-${index}`);
                    const dot1 = card13Preview.querySelector(`#c13-d1-${index}`);
                    if (vl) vl.style.opacity = '1';
                    if (dot30) dot30.style.opacity = '1';
                    if (dot7) dot7.style.opacity = '1';
                    if (dot1) dot1.style.opacity = '1';

                    popDate13.textContent = data.date;
                    pop30_13.textContent = data.val30;
                    pop7_13.textContent = data.val7;
                    pop1_13.textContent = data.val1;
                    popover13.style.display = 'block';
                });

                zone.addEventListener('mousemove', (e) => {
                    let left = e.clientX + 15;
                    let top = e.clientY - 40;
                    const pRect = popover13.getBoundingClientRect();
                    if (left + pRect.width > window.innerWidth) {
                        left = e.clientX - pRect.width - 15;
                    }
                    popover13.style.left = `${left}px`;
                    popover13.style.top = `${top}px`;
                });

                zone.addEventListener('mouseleave', () => {
                    const vl = card13Preview.querySelector(`#c13-vl-${index}`);
                    const dot30 = card13Preview.querySelector(`#c13-d30-${index}`);
                    const dot7 = card13Preview.querySelector(`#c13-d7-${index}`);
                    const dot1 = card13Preview.querySelector(`#c13-d1-${index}`);
                    if (vl) vl.style.opacity = '0';
                    if (dot30) dot30.style.opacity = '0';
                    if (dot7) dot7.style.opacity = '0';
                    if (dot1) dot1.style.opacity = '0';
                    popover13.style.display = 'none';
                });

                layer13.appendChild(zone);
            });
        }
    }

    // S. Card 14 & Card 15 (Settings Cards Tooltips & Help Icons)
    const cardSettingsHelpIcons = document.querySelectorAll('#preview-card14 .help-icon-wrapper, #preview-card15 .help-icon-wrapper');
    cardSettingsHelpIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    });
    const cardSettingsTooltips = document.querySelectorAll('#preview-card14 [data-bs-toggle="tooltip"], #preview-card15 [data-bs-toggle="tooltip"]');
    if (window.bootstrap && cardSettingsTooltips.length > 0) {
        [...cardSettingsTooltips].forEach(el => new bootstrap.Tooltip(el));
    }

    // T. Offcanvas 5 (Web Stream Details Tabs)
    const offcanvas5Tabs = document.querySelectorAll('#webStreamOffcanvas .tab-item');
    offcanvas5Tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            offcanvas5Tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // U. Table 2 (Custom Dimensions Table Search & Pagination)
    const table2Preview = document.getElementById('preview-table2');
    if (table2Preview) {
        const searchInput2 = table2Preview.querySelector('#searchInputTable2');
        const tableRows2 = Array.from(table2Preview.querySelectorAll('.data-row'));
        const noDataMessage2 = table2Preview.querySelector('#noDataMessage2');
        const rowsPerPageItems2 = table2Preview.querySelectorAll('.custom-pagination-dropdown .dropdown-item');
        const rowsPerPageBtnText2 = table2Preview.querySelector('#rowsPerPageText2');
        const firstPageBtn2 = table2Preview.querySelector('#firstPageBtn2');
        const prevPageBtn2 = table2Preview.querySelector('#prevPageBtn2');
        const nextPageBtn2 = table2Preview.querySelector('#nextPageBtn2');
        const lastPageBtn2 = table2Preview.querySelector('#lastPageBtn2');
        const pageInfo2 = table2Preview.querySelector('#pageInfo2');

        let currentPage2 = 1;
        let rowsPerPage2 = 25; 
        let currentSearchTerm2 = '';
        let filteredRows2 = [...tableRows2];

        function renderTable2() {
            filteredRows2 = tableRows2.filter(row => {
                const textContent = row.textContent.toLowerCase();
                return textContent.includes(currentSearchTerm2);
            });

            tableRows2.forEach(row => row.style.display = 'none');
            const totalFiltered = filteredRows2.length;
            
            if (totalFiltered === 0) {
                if (noDataMessage2) noDataMessage2.style.display = 'block';
                if (pageInfo2) pageInfo2.textContent = `0 – 0/0`;
                if (firstPageBtn2) firstPageBtn2.disabled = true;
                if (prevPageBtn2) prevPageBtn2.disabled = true;
                if (nextPageBtn2) nextPageBtn2.disabled = true;
                if (lastPageBtn2) lastPageBtn2.disabled = true;
                return;
            }

            if (noDataMessage2) noDataMessage2.style.display = 'none';

            const totalPages = Math.ceil(totalFiltered / rowsPerPage2);
            if (currentPage2 > totalPages) currentPage2 = totalPages;
            if (currentPage2 < 1) currentPage2 = 1;

            const startIndex = (currentPage2 - 1) * rowsPerPage2;
            const endIndex = Math.min(startIndex + rowsPerPage2, totalFiltered);

            for (let i = startIndex; i < endIndex; i++) {
                filteredRows2[i].style.display = '';
            }

            if (pageInfo2) pageInfo2.textContent = `${startIndex + 1} – ${endIndex}/${totalFiltered}`;

            const isFirst = currentPage2 === 1;
            const isLast = currentPage2 === totalPages;

            if (firstPageBtn2) firstPageBtn2.disabled = isFirst;
            if (prevPageBtn2) prevPageBtn2.disabled = isFirst;
            if (nextPageBtn2) nextPageBtn2.disabled = isLast;
            if (lastPageBtn2) lastPageBtn2.disabled = isLast;
        }

        if (searchInput2) {
            searchInput2.addEventListener('input', (e) => {
                currentSearchTerm2 = e.target.value.toLowerCase().trim();
                currentPage2 = 1;
                renderTable2();
            });
        }

        rowsPerPageItems2.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                rowsPerPageItems2.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                const val = item.getAttribute('data-val');
                if (rowsPerPageBtnText2) rowsPerPageBtnText2.textContent = val;
                rowsPerPage2 = parseInt(val);
                currentPage2 = 1;
                renderTable2();
            });
        });

        if (firstPageBtn2) {
            firstPageBtn2.addEventListener('click', () => {
                currentPage2 = 1;
                renderTable2();
            });
        }
        if (prevPageBtn2) {
            prevPageBtn2.addEventListener('click', () => {
                if (currentPage2 > 1) {
                    currentPage2--;
                    renderTable2();
                }
            });
        }
        if (nextPageBtn2) {
            nextPageBtn2.addEventListener('click', () => {
                const totalPages = Math.ceil(filteredRows2.length / rowsPerPage2);
                if (currentPage2 < totalPages) {
                    currentPage2++;
                    renderTable2();
                }
            });
        }
        if (lastPageBtn2) {
            lastPageBtn2.addEventListener('click', () => {
                currentPage2 = Math.ceil(filteredRows2.length / rowsPerPage2);
                renderTable2();
            });
        }

        // Chuyển đổi tab
        const table2Tabs = table2Preview.querySelectorAll('.tab-item');
        table2Tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                table2Tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
            });
        });

        renderTable2();
    }

    // V. Popover 3 (Analytics Variables Panel Toggle)
    const popover3Preview = document.getElementById('preview-popover3');
    if (popover3Preview) {
        const panel3 = popover3Preview.querySelector('#variablesPanel');
        const closeBtn3 = popover3Preview.querySelector('#closePanelBtn');
        const openBtn3 = popover3Preview.querySelector('#openPanelBtn');

        if (panel3 && closeBtn3 && openBtn3) {
            closeBtn3.addEventListener('click', () => {
                panel3.style.display = 'none';
                openBtn3.style.display = 'flex';
            });

            openBtn3.addEventListener('click', () => {
                panel3.style.display = 'flex';
                openBtn3.style.display = 'none';
            });
        }
    }

    // W. Table 3 (Analytics Top Pages Table Hover Popover)
    const table3Preview = document.getElementById('preview-table3');
    if (table3Preview) {
        const hoverRows3 = table3Preview.querySelectorAll('.hover-row');
        const popover3 = table3Preview.querySelector('#pagesPopover');
        const popTitle3 = table3Preview.querySelector('#popTitle');
        const popV3 = table3Preview.querySelector('#popV');
        const popU3 = table3Preview.querySelector('#popU');
        const popE3 = table3Preview.querySelector('#popE');
        const popB3 = table3Preview.querySelector('#popB');

        if (popover3 && popTitle3 && popV3 && popU3 && popE3 && popB3) {
            hoverRows3.forEach(row => {
                row.addEventListener('mouseenter', () => {
                    popTitle3.textContent = row.getAttribute('data-title');
                    popV3.textContent = row.getAttribute('data-v');
                    popU3.textContent = row.getAttribute('data-u');
                    popE3.textContent = row.getAttribute('data-e');
                    popB3.textContent = row.getAttribute('data-b');
                    popover3.style.display = 'block';
                });

                row.addEventListener('mousemove', (e) => {
                    let left = e.clientX + 15;
                    let top = e.clientY + 15;
                    const pRect = popover3.getBoundingClientRect();
                    if (left + pRect.width > window.innerWidth) {
                        left = e.clientX - pRect.width - 15;
                    }
                    if (top + pRect.height > window.innerHeight) {
                        top = e.clientY - pRect.height - 15;
                    }
                    popover3.style.left = `${left}px`;
                    popover3.style.top = `${top}px`;
                });

                row.addEventListener('mouseleave', () => {
                    popover3.style.display = 'none';
                });
            });
        }
    }

    // X. Card 17 (Analytics Geo Chart Card)
    const card17Preview = document.getElementById('preview-card17');
    if (card17Preview) {
        if (window.google && window.google.charts) {
            google.charts.load('current', { 'packages': ['geochart'] });
            google.charts.setOnLoadCallback(() => {
                const mapEl = card17Preview.querySelector('#regions_div');
                if (!mapEl) return;
                const data = google.visualization.arrayToDataTable([
                    ['Country', 'Users'],
                    ['India', 4700],
                    ['Bangladesh', 3200],
                    ['United States', 2900],
                    ['Nigeria', 1100],
                    ['Pakistan', 894],
                    ['Indonesia', 845],
                    ['Brazil', 542],
                    ['Canada', 1200],
                    ['France', 900],
                    ['Australia', 850],
                    ['Mexico', 600],
                    ['South Africa', 400],
                    ['Russia', 1500]
                ]);
                const options = {
                    colorAxis: { colors: ['#c6d8f9', '#4285f4', '#2a56c6'] },
                    backgroundColor: 'transparent',
                    datalessRegionColor: '#f1f3f4',
                    defaultColor: '#f1f3f4',
                    legend: 'none',
                    tooltip: { trigger: 'focus' },
                    keepAspectRatio: true
                };
                const chart = new google.visualization.GeoChart(mapEl);
                chart.draw(data, options);
            });
        }

        const mapDiv17 = card17Preview.querySelector('#regions_div');
        const zoomInBtn17 = card17Preview.querySelector('#zoomInBtn');
        const zoomOutBtn17 = card17Preview.querySelector('#zoomOutBtn');
        const wrapper17 = card17Preview.querySelector('#mapWrapper');
        if (mapDiv17 && zoomInBtn17 && zoomOutBtn17 && wrapper17) {
            let currentScale = 1;
            let isDragging = false;
            let startX, startY;
            let translateX = 0;
            let translateY = 0;

            function updateTransform() {
                mapDiv17.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;
            }

            zoomInBtn17.addEventListener('click', () => {
                currentScale += 0.4;
                updateTransform();
            });

            zoomOutBtn17.addEventListener('click', () => {
                currentScale = Math.max(1, currentScale - 0.4);
                if (currentScale === 1) {
                    translateX = 0;
                    translateY = 0;
                }
                updateTransform();
            });

            wrapper17.addEventListener('mousedown', (e) => {
                if (currentScale > 1) {
                    isDragging = true;
                    startX = e.clientX - translateX;
                    startY = e.clientY - translateY;
                }
            });

            window.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    translateX = e.clientX - startX;
                    translateY = e.clientY - startY;
                    updateTransform();
                }
            });

            window.addEventListener('mouseup', () => {
                isDragging = false;
            });
        }
    }

    // Y. Card 18 (Analytics Cohort Activity Table Card)
    const card18Preview = document.getElementById('preview-card18');
    if (card18Preview) {
        const hoverCells18 = card18Preview.querySelectorAll('.hover-trigger');
        const popover18 = card18Preview.querySelector('#cohortPopover');
        const popHeader18 = card18Preview.querySelector('#popHeader');
        const popUsers18 = card18Preview.querySelector('#popUsers');
        const popRetention18 = card18Preview.querySelector('#popRetention');

        if (popover18 && popHeader18 && popUsers18 && popRetention18) {
            hoverCells18.forEach(cell => {
                cell.addEventListener('mouseenter', () => {
                    const dateStr = cell.getAttribute('data-date');
                    const weekStr = cell.getAttribute('data-week');
                    const users = cell.getAttribute('data-users');
                    const pct = cell.getAttribute('data-pct');

                    popHeader18.textContent = `${dateStr} • ${weekStr}`;
                    popUsers18.textContent = users;
                    popRetention18.textContent = `Tỷ lệ giữ chân người dùng: ${pct}`;
                    popover18.style.display = 'block';
                });

                cell.addEventListener('mousemove', (e) => {
                    let left = e.clientX + 15;
                    let top = e.clientY + 15;
                    const pRect = popover18.getBoundingClientRect();
                    if (left + pRect.width > window.innerWidth) {
                        left = e.clientX - pRect.width - 15;
                    }
                    if (top + pRect.height > window.innerHeight) {
                        top = e.clientY - pRect.height - 15;
                    }
                    popover18.style.left = `${left}px`;
                    popover18.style.top = `${top}px`;
                });

                cell.addEventListener('mouseleave', () => {
                    popover18.style.display = 'none';
                });
            });
        }
    }

    // Z. Card 19 (Analytics Venn Diagram Card)
    const card19Preview = document.getElementById('preview-card19');
    if (card19Preview) {
        const vennCircles19 = card19Preview.querySelectorAll('.venn-circle');
        const popover19 = card19Preview.querySelector('#vennPopover');
        const popPlatform19 = card19Preview.querySelector('#popPlatform');
        const popVal19 = card19Preview.querySelector('#popVal');
        const popPct19 = card19Preview.querySelector('#popPct');

        function resetCircles19() {
            vennCircles19.forEach(c => {
                c.classList.remove('active-hover');
                c.style.borderColor = '#669df6';
                c.style.borderWidth = '1.5px';
                c.style.backgroundColor = 'rgba(173, 200, 246, 0.5)';
            });
        }

        if (popover19 && popPlatform19 && popVal19 && popPct19) {
            vennCircles19.forEach(circle => {
                circle.addEventListener('mouseenter', () => {
                    resetCircles19();
                    circle.classList.add('active-hover');
                    vennCircles19.forEach(c => {
                        if (c !== circle) {
                            c.style.borderColor = '#9aa0a6';
                            c.style.backgroundColor = 'transparent';
                        }
                    });

                    popPlatform19.textContent = circle.getAttribute('data-platform');
                    popVal19.textContent = circle.getAttribute('data-val');
                    popPct19.textContent = circle.getAttribute('data-pct');
                    popover19.style.display = 'block';
                });

                circle.addEventListener('mousemove', (e) => {
                    let left = e.clientX + 15;
                    let top = e.clientY + 15;
                    const pRect = popover19.getBoundingClientRect();
                    if (left + pRect.width > window.innerWidth) {
                        left = e.clientX - pRect.width - 15;
                    }
                    if (top + pRect.height > window.innerHeight) {
                        top = e.clientY - pRect.height - 15;
                    }
                    popover19.style.left = `${left}px`;
                    popover19.style.top = `${top}px`;
                });

                circle.addEventListener('mouseleave', () => {
                    resetCircles19();
                    popover19.style.display = 'none';
                });
            });
        }
    }

    // Z. Card 20 (Analytics Insights List Card)
    const card20Preview = document.getElementById('preview-card20');
    if (card20Preview) {
        const actionBtns = card20Preview.querySelectorAll('.btn-icon-action');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const icon = btn.querySelector('i');
                if (!icon) return;
                const isThumbsUp = icon.classList.contains('bi-hand-thumbs-up') || icon.classList.contains('bi-hand-thumbs-up-fill');
                const isThumbsDown = icon.classList.contains('bi-hand-thumbs-down') || icon.classList.contains('bi-hand-thumbs-down-fill');
                
                if (isThumbsUp) {
                    icon.classList.toggle('bi-hand-thumbs-up');
                    icon.classList.toggle('bi-hand-thumbs-up-fill');
                } else if (isThumbsDown) {
                    icon.classList.toggle('bi-hand-thumbs-down');
                    icon.classList.toggle('bi-hand-thumbs-down-fill');
                }
            });
        });
    }

    // M. Đồng bộ URL Hash
    setupTabHashSync();
});
