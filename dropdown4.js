document.addEventListener('DOMContentLoaded', () => {
    const dropdownBtn = document.getElementById('settingsDropdownBtn');
    const triggerModel = document.getElementById('triggerModel');
    const applyBtn = document.getElementById('applySettingsBtn');
    const cancelBtn = document.getElementById('cancelSettingsBtn');
    const radios = document.querySelectorAll('.custom-ga-radio');
    const bsDropdown = new bootstrap.Dropdown(dropdownBtn);

    let savedState = {
        attrModel: document.querySelector('input[name="attrModel"]:checked').value,
        attrTime: document.querySelector('input[name="attrTime"]:checked').value
    };

    function checkChanges() {
        const currentModel = document.querySelector('input[name="attrModel"]:checked').value;
        const currentTime = document.querySelector('input[name="attrTime"]:checked').value;

        if (currentModel !== savedState.attrModel || currentTime !== savedState.attrTime) {
            applyBtn.removeAttribute('disabled');
        } else {
            applyBtn.setAttribute('disabled', 'true');
        }
    }

    function restoreState() {
        document.querySelector(`input[name="attrModel"][value="${savedState.attrModel}"]`).checked = true;
        document.querySelector(`input[name="attrTime"][value="${savedState.attrTime}"]`).checked = true;
        checkChanges();
    }

    radios.forEach(radio => {
        radio.addEventListener('change', checkChanges);
    });

    applyBtn.addEventListener('click', () => {
        savedState.attrModel = document.querySelector('input[name="attrModel"]:checked').value;
        savedState.attrTime = document.querySelector('input[name="attrTime"]:checked').value;
        
        triggerModel.textContent = savedState.attrModel;
        
        checkChanges();
        bsDropdown.hide();
    });

    cancelBtn.addEventListener('click', () => {
        restoreState();
        bsDropdown.hide();
    });
    
    dropdownBtn.addEventListener('hidden.bs.dropdown', () => {
        restoreState();
    });
});