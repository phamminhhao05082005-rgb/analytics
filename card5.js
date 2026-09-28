document.addEventListener('DOMContentLoaded', () => {
    // 1. Funnel Toggle Switch
    const funnelToggle = document.getElementById('funnelToggle');
    const funnelArea = document.querySelector('.funnel-grid');
    if (funnelToggle && funnelArea) {
        funnelToggle.addEventListener('change', () => {
            funnelArea.style.opacity = funnelToggle.checked ? '1' : '0.25';
            funnelArea.style.transition = 'opacity 0.3s ease';
        });
    }

    // 2. Search Filter
    const searchInput = document.getElementById('searchInput5') || document.querySelector('.table-search input');
    const tableRows = document.querySelectorAll('.data-row');
    const paginationInfo = document.getElementById('paginationInfo5');

    if (searchInput && tableRows.length > 0) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            let visibleCount = 0;
            tableRows.forEach(row => {
                const linkText = row.querySelector('.row-link')?.textContent.toLowerCase() || row.textContent.toLowerCase();
                if (linkText.includes(term)) {
                    row.style.display = '';
                    visibleCount++;
                } else {
                    row.style.display = 'none';
                }
            });
            if (paginationInfo) {
                paginationInfo.textContent = visibleCount > 0 ? `1 – ${visibleCount} trên ${tableRows.length}` : `0 – 0 trên ${tableRows.length}`;
            }
        });
    }

    // 3. Rows per page Dropdown Selection
    const pageDropItems = document.querySelectorAll('.custom-pagination-menu .dropdown-item');
    const rowsPerPageText = document.getElementById('rowsPerPageText5');

    pageDropItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            pageDropItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.check-icon')?.classList.add('d-none');
            });
            item.classList.add('active');
            item.querySelector('.check-icon')?.classList.remove('d-none');
            if (rowsPerPageText) {
                rowsPerPageText.textContent = item.getAttribute('data-val');
            }
        });
    });
});
