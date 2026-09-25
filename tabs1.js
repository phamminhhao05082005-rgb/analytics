document.addEventListener('DOMContentLoaded', () => {

    let tabs = [
        { id: 'tab_1', title: 'Biểu mẫu tùy ý', type: 'Biểu mẫu tùy ý', count: 0 },
        { id: 'tab_2', title: 'Khám phá phễu', type: 'Khám phá phễu', count: 0 },
        { id: 'tab_3', title: 'Trình khám phá người dùng 1', type: 'Trình khám phá người dùng', count: 1 }
    ];
    let activeTabId = 'tab_1';

    const tabsListEl = document.getElementById('tabsList');
    const tabContentEl = document.getElementById('tabContent');

    function getIconForType(type) {
        if (type === 'Biểu mẫu tùy ý') {
            return '<i class="bi bi-pencil-fill"></i>';
        }
        return type.charAt(0).toUpperCase();
    }

    function renderTabs() {
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
                <div class="tab-icon-wrapper ${isActive ? 'bg-primary' : 'bg-secondary text-white'}">
                    ${getIconForType(tab.type)}
                </div>
                <div class="tab-title">${tab.title}</div>
                ${caretHtml}
            `;

            tabEl.addEventListener('click', (e) => {
                if (!e.target.closest('.dropdown')) {
                    activeTabId = tab.id;
                    render();
                }
            });

            tabsListEl.appendChild(tabEl);
        });

        document.querySelectorAll('.delete-tab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                deleteTab(e.currentTarget.getAttribute('data-id'));
            });
        });

        document.querySelectorAll('.duplicate-tab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                duplicateTab(e.currentTarget.getAttribute('data-id'));
            });
        });
    }

    function renderContent() {
        const activeTab = tabs.find(t => t.id === activeTabId);
        if (!activeTab) {
            tabContentEl.innerHTML = '';
            return;
        }

        tabContentEl.innerHTML = `
            <div class="empty-state">
                <p>Không có dữ liệu cho kiểu kết hợp phân khúc, giá trị, bộ lọc và phạm vi ngày mà bạn đang sử dụng. Hãy thử chỉnh sửa hoặc xóa các biến/tùy chọn cài đặt này.</p>
            </div>
        `;
    }

    function render() {
        renderTabs();
        renderContent();
    }

    function addTab(type) {
        const existingOfType = tabs.filter(t => t.type === type);
        let count = 0;
        let title = type;
        
        if (existingOfType.length > 0) {
            const maxCount = Math.max(...existingOfType.map(t => t.count));
            count = maxCount + 1;
            title = `${type} ${count}`;
        }

        const newId = 'tab_' + Date.now();
        tabs.push({
            id: newId,
            title: title,
            type: type,
            count: count
        });
        activeTabId = newId;
        render();
    }

    function deleteTab(id) {
        if (tabs.length === 1) return; 
        const index = tabs.findIndex(t => t.id === id);
        tabs.splice(index, 1);
        
        if (activeTabId === id) {
            activeTabId = tabs[Math.max(0, index - 1)].id;
        }
        render();
    }

    function duplicateTab(id) {
        const tabToCopy = tabs.find(t => t.id === id);
        if (!tabToCopy) return;

        const existingOfType = tabs.filter(t => t.type === tabToCopy.type);
        const maxCount = Math.max(...existingOfType.map(t => t.count));
        const newCount = maxCount + 1;
        
        const newId = 'tab_' + Date.now();
        const newTab = {
            id: newId,
            title: `${tabToCopy.type} ${newCount}`,
            type: tabToCopy.type,
            count: newCount
        };

        const index = tabs.findIndex(t => t.id === id);
        tabs.splice(index + 1, 0, newTab);
        activeTabId = newId;
        render();
    }

    document.querySelectorAll('.add-tab-container .dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            addTab(e.currentTarget.getAttribute('data-type'));
        });
    });

    render();
});