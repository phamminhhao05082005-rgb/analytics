document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const tableRows = Array.from(document.querySelectorAll('.data-row'));
    const noDataMessage = document.getElementById('noDataMessage');
    
    const rowsPerPageItems = document.querySelectorAll('.custom-pagination-dropdown .dropdown-item');
    const rowsPerPageBtnText = document.getElementById('rowsPerPageText');
    
    const firstPageBtn = document.getElementById('firstPageBtn');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const lastPageBtn = document.getElementById('lastPageBtn');
    const pageInfo = document.getElementById('pageInfo');

    let currentPage = 1;
    let rowsPerPage = 25; 
    let currentSearchTerm = '';
    let filteredRows = [...tableRows];

    function renderTable() {
        filteredRows = tableRows.filter(row => {
            const textContent = row.textContent.toLowerCase();
            return textContent.includes(currentSearchTerm);
        });

        tableRows.forEach(row => row.style.display = 'none');

        const totalFiltered = filteredRows.length;
        
        if (totalFiltered === 0) {
            noDataMessage.style.display = 'block';
            pageInfo.textContent = `0 – 0/0`;
            firstPageBtn.disabled = true;
            prevPageBtn.disabled = true;
            nextPageBtn.disabled = true;
            lastPageBtn.disabled = true;
            return;
        }

        noDataMessage.style.display = 'none';

        const totalPages = Math.ceil(totalFiltered / rowsPerPage);
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = Math.min(startIndex + rowsPerPage, totalFiltered);

        for (let i = startIndex; i < endIndex; i++) {
            filteredRows[i].style.display = '';
        }

        pageInfo.textContent = `${startIndex + 1} – ${endIndex}/${totalFiltered}`;

        const isFirst = currentPage === 1;
        const isLast = currentPage === totalPages;

        firstPageBtn.disabled = isFirst;
        prevPageBtn.disabled = isFirst;
        nextPageBtn.disabled = isLast;
        lastPageBtn.disabled = isLast;
    }

    searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value.toLowerCase().trim();
        currentPage = 1;
        renderTable();
    });

    rowsPerPageItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            rowsPerPageItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const val = item.getAttribute('data-val');
            rowsPerPageBtnText.textContent = val;
            
            rowsPerPage = parseInt(val);
            currentPage = 1;
            renderTable();
        });
    });

    firstPageBtn.addEventListener('click', () => {
        currentPage = 1;
        renderTable();
    });

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
        }
    });

    lastPageBtn.addEventListener('click', () => {
        currentPage = Math.ceil(filteredRows.length / rowsPerPage);
        renderTable();
    });

    renderTable();
});