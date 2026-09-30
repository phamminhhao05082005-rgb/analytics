document.addEventListener('DOMContentLoaded', () => {
    const dimWrapper = document.getElementById('dimSelectWrapper');
    const matchWrapper = document.getElementById('matchSelectWrapper');
    const valueInput = document.getElementById('valueInput');
    const clearBtn = document.getElementById('clearBtn');
    const applyBtn = document.getElementById('applyBtn');

    function checkFormStatus() {
        const dimText = document.querySelector('#dimTrigger .select-text').textContent;
        const matchText = document.querySelector('#matchTrigger .select-text').textContent;
        const valText = valueInput.value.trim();

        if (dimText !== 'Chọn phương diện' && matchText !== 'Chọn kiểu khớp' && valText !== '') {
            applyBtn.classList.add('active');
            applyBtn.removeAttribute('disabled');
        } else {
            applyBtn.classList.remove('active');
            applyBtn.setAttribute('disabled', 'true');
        }
    }

    function setupCustomDropdown(wrapperId, defaultText) {
        const wrapper = document.getElementById(wrapperId);
        const trigger = wrapper.querySelector('.custom-select-trigger');
        const textSpan = trigger.querySelector('.select-text');
        const options = wrapper.querySelectorAll('.custom-option');

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = wrapper.classList.contains('open');
            document.querySelectorAll('.custom-select-wrapper').forEach(w => w.classList.remove('open'));
            if (!isOpen) wrapper.classList.add('open');
        });

        options.forEach(opt => {
            opt.addEventListener('click', (e) => {
                e.stopPropagation();
                options.forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
                textSpan.textContent = opt.getAttribute('data-value');
                wrapper.classList.remove('open');
                checkFormStatus();
            });
        });

        wrapper.resetDropdown = () => {
            options.forEach(o => o.classList.remove('selected'));
            textSpan.textContent = defaultText;
        };
    }

    setupCustomDropdown('dimSelectWrapper', 'Chọn phương diện');
    setupCustomDropdown('matchSelectWrapper', 'Chọn kiểu khớp');

    valueInput.addEventListener('input', checkFormStatus);

    document.addEventListener('click', () => {
        document.querySelectorAll('.custom-select-wrapper').forEach(w => w.classList.remove('open'));
    });

    clearBtn.addEventListener('click', () => {
        dimWrapper.resetDropdown();
        matchWrapper.resetDropdown();
        valueInput.value = '';
        checkFormStatus();
    });
});