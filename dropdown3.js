document.addEventListener('DOMContentLoaded', () => {
    const dropdownBtn = document.getElementById('dropdownMenuButton');
    const btnText = document.getElementById('selectedCountText');
    const searchInput = document.getElementById('searchConversion');
    const applyBtn = document.getElementById('applyConvBtn');
    const cancelBtn = document.getElementById('cancelConvBtn');
    const checkboxes = document.querySelectorAll('.conv-checkbox');
    const groups = document.querySelectorAll('.conv-group');
    const bsDropdown = new bootstrap.Dropdown(dropdownBtn);

    let savedState = Array.from(checkboxes).map(cb => cb.checked);

    function updateParentStates() {
        groups.forEach(group => {
            const parentCb = group.querySelector('.parent-cb');
            const childCbs = Array.from(group.querySelectorAll('.child-cb'));
            if(childCbs.length === 0) return;

            const checkedCount = childCbs.filter(cb => cb.checked).length;
            if (checkedCount === 0) {
                parentCb.checked = false;
                parentCb.indeterminate = false;
            } else if (checkedCount === childCbs.length) {
                parentCb.checked = true;
                parentCb.indeterminate = false;
            } else {
                parentCb.checked = false;
                parentCb.indeterminate = true;
            }
        });
    }

    function checkApplyState() {
        const currentState = Array.from(checkboxes).map(cb => cb.checked);
        const isChanged = currentState.some((val, i) => val !== savedState[i]);
        if (isChanged) {
            applyBtn.classList.add('active');
            applyBtn.removeAttribute('disabled');
        } else {
            applyBtn.classList.remove('active');
            applyBtn.setAttribute('disabled', 'true');
        }
    }

    function getSelectedCount() {
        return document.querySelectorAll('.child-cb:checked').length;
    }

    function updateTriggerText() {
        btnText.textContent = getSelectedCount() + ' lượt chuyển đổi';
    }

    groups.forEach(group => {
        const parentCb = group.querySelector('.parent-cb');
        const childCbs = group.querySelectorAll('.child-cb');
        const chevron = group.querySelector('.group-chevron');
        const childrenContainer = group.querySelector('.group-children');

        parentCb.addEventListener('change', (e) => {
            childCbs.forEach(cb => cb.checked = e.target.checked);
            updateParentStates();
            checkApplyState();
        });

        childCbs.forEach(cb => {
            cb.addEventListener('change', () => {
                updateParentStates();
                checkApplyState();
            });
        });

        chevron.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = childrenContainer.style.display !== 'none';
            childrenContainer.style.display = isExpanded ? 'none' : 'block';
            chevron.classList.toggle('bi-chevron-up', !isExpanded);
            chevron.classList.toggle('bi-chevron-down', isExpanded);
        });
    });

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        groups.forEach(group => {
            let hasVisibleChild = false;
            const children = group.querySelectorAll('.child-item');
            children.forEach(child => {
                const text = child.querySelector('.child-label-text').textContent.toLowerCase();
                if (text.includes(term)) {
                    child.style.display = 'flex';
                    hasVisibleChild = true;
                } else {
                    child.style.display = 'none';
                }
            });

            const parentText = group.querySelector('.parent-label-text').textContent.toLowerCase();
            if (parentText.includes(term) || hasVisibleChild) {
                group.style.display = 'block';
                if (parentText.includes(term) && !hasVisibleChild) {
                    children.forEach(child => child.style.display = 'flex');
                }
            } else {
                group.style.display = 'none';
            }
        });
    });

    applyBtn.addEventListener('click', () => {
        savedState = Array.from(checkboxes).map(cb => cb.checked);
        updateTriggerText();
        checkApplyState();
        bsDropdown.hide();
    });

    cancelBtn.addEventListener('click', () => {
        checkboxes.forEach((cb, index) => {
            cb.checked = savedState[index];
        });
        updateParentStates();
        checkApplyState();
        bsDropdown.hide();
    });

    dropdownBtn.addEventListener('show.bs.dropdown', () => {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
    });

    updateParentStates();
    updateTriggerText();
});