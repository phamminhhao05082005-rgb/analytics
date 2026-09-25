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

    // G. Đồng bộ URL Hash
    setupTabHashSync();
});
