document.addEventListener('DOMContentLoaded', () => {
    const vennCircles = document.querySelectorAll('.venn-circle');
    const popover = document.getElementById('vennPopover');
    const popPlatform = document.getElementById('popPlatform');
    const popVal = document.getElementById('popVal');
    const popPct = document.getElementById('popPct');

    function resetCircles() {
        vennCircles.forEach(c => {
            c.classList.remove('active-hover');
            c.style.borderColor = '#669df6';
            c.style.borderWidth = '1.5px';
            c.style.backgroundColor = 'rgba(173, 200, 246, 0.5)';
        });
    }

    vennCircles.forEach(circle => {
        circle.addEventListener('mouseenter', () => {
            resetCircles();
            
            circle.classList.add('active-hover');
            
            vennCircles.forEach(c => {
                if(c !== circle) {
                    c.style.borderColor = '#9aa0a6';
                    c.style.backgroundColor = 'transparent';
                }
            });

            popPlatform.textContent = circle.getAttribute('data-platform');
            popVal.textContent = circle.getAttribute('data-val');
            popPct.textContent = circle.getAttribute('data-pct');

            popover.style.display = 'block';
        });

        circle.addEventListener('mousemove', (e) => {
            let left = e.clientX + 15;
            let top = e.clientY + 15;
            
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

        circle.addEventListener('mouseleave', () => {
            resetCircles();
            popover.style.display = 'none';
        });
    });
});