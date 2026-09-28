document.addEventListener('DOMContentLoaded', () => {
    
    function setupDropdown(menuId, btnId) {
        const menu = document.getElementById(menuId);
        const btn = document.getElementById(btnId);
        const items = menu.querySelectorAll('.dropdown-item');

        items.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                items.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                const val = item.getAttribute('data-val');
                if(val && val !== 'Chọn giúp tôi') {
                    btn.innerHTML = `${val} <i class="bi bi-caret-down-fill" style="font-size: 10px;"></i>`;
                }
            });
        });
    }

    setupDropdown('menuDim1', 'btnDim1');
    setupDropdown('menuDim2', 'btnDim2');

});