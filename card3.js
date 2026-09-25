document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('metricTrack');
    const prevBtn = document.getElementById('metricPrevBtn');
    const nextBtn = document.getElementById('metricNextBtn');
    
    let currentPos = 0;
    const itemWidth = 200;

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

    const metricItems = document.querySelectorAll('.metric-item');
    metricItems.forEach(item => {
        item.addEventListener('click', () => {
            metricItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });

    const points = document.querySelectorAll('.chart-point');
    const popover = document.getElementById('chartPopover');
    const popDate = document.getElementById('popDate');
    const popVal = document.getElementById('popVal');

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
});