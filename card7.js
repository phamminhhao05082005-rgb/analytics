document.addEventListener('DOMContentLoaded', () => {
    const datasets = [
        {
            name: "Số người dùng đang hoạt động",
            yLabels: ["8 N", "6 N", "4 N", "2 N", "0"],
            linePts: "50,115 150,105 250,120 350,110 450,75 550,145 650,150",
            dashedPts: "50,110 150,112 250,115 350,118 450,120 550,160 650,160",
            bandPts: "50,195 150,195 250,198 350,195 450,192 550,205 650,206 650,220 50,220",
            benchmarkPts: "50,195 150,195 250,198 350,195 450,192 550,205 650,206",
            hoverVals: ["4,2 N", "4,6 N", "4,0 N", "4,4 N", "5,8 N", "3,0 N", "2,8 N"],
            dotY: [115, 105, 120, 110, 75, 145, 150]
        },
        {
            name: "Sự kiện quan trọng",
            yLabels: ["8 N", "6 N", "4 N", "2 N", "0"],
            linePts: "50,108 150,100 250,115 350,105 450,63 550,150 650,155",
            dashedPts: "50,118 150,118 250,113 350,110 450,118 550,163 650,163",
            bandPts: "50,195 150,195 250,198 350,195 450,192 550,205 650,206 650,220 50,220",
            benchmarkPts: "50,195 150,195 250,198 350,195 450,192 550,205 650,206",
            hoverVals: ["4,5 N", "4,8 N", "4,2 N", "4,6 N", "6,3 N", "2,8 N", "2,6 N"],
            dotY: [108, 100, 115, 105, 63, 150, 155]
        },
        {
            name: "Phiên",
            yLabels: ["10 N", "7,5 N", "5 N", "2,5 N", "0"],
            linePts: "50,95 150,90 250,105 350,92 450,55 550,135 650,140",
            dashedPts: "50,100 150,102 250,105 350,108 450,110 550,145 650,148",
            bandPts: "50,190 150,192 250,195 350,190 450,188 550,200 650,202 650,220 50,220",
            benchmarkPts: "50,190 150,192 250,195 350,190 450,188 550,200 650,202",
            hoverVals: ["5,2 N", "5,5 N", "4,8 N", "5,4 N", "7,1 N", "3,4 N", "3,2 N"],
            dotY: [95, 90, 105, 92, 55, 135, 140]
        },
        {
            name: "Mua hàng",
            yLabels: ["500", "375", "250", "125", "0"],
            linePts: "50,130 150,120 250,140 350,125 450,70 550,160 650,165",
            dashedPts: "50,145 150,145 250,142 350,138 450,140 550,175 650,175",
            bandPts: "50,198 150,198 250,200 350,198 450,195 550,208 650,210 650,220 50,220",
            benchmarkPts: "50,198 150,198 250,200 350,198 450,195 550,208 650,210",
            hoverVals: ["225", "250", "200", "235", "375", "150", "140"],
            dotY: [130, 120, 140, 125, 70, 160, 165]
        }
    ];

    const hoverDates = ["21 thg", "22 thg", "23 thg", "24 thg", "25 thg", "26 thg", "27 thg"];
    let activeIdx = 0;

    const yLabelEls = document.querySelectorAll('.y-label');
    const chartLine = document.getElementById('chartLine7') || document.getElementById('chartLine');
    const chartDashedLine = document.getElementById('chartDashedLine7') || document.getElementById('chartDashedLine');
    const chartBand = document.getElementById('chartBand7') || document.getElementById('chartBand');
    const benchmarkLine = document.getElementById('benchmarkLine7') || document.getElementById('benchmarkLine');
    const metricBoxes = document.querySelectorAll('.metric-box');
    const ttName = document.getElementById('ttName7') || document.getElementById('ttName');
    const ttDate = document.getElementById('ttDate7') || document.getElementById('ttDate');
    const ttVal = document.getElementById('ttVal7') || document.getElementById('ttVal');
    const popover = document.getElementById('tooltipPopover7') || document.getElementById('tooltipPopover');
    const hoverTriggers = document.querySelectorAll('.hover-trigger');

    metricBoxes.forEach((box, index) => {
        box.addEventListener('click', () => {
            metricBoxes.forEach(b => b.classList.remove('active'));
            box.classList.add('active');

            activeIdx = index;
            const data = datasets[activeIdx];

            yLabelEls.forEach((el, i) => {
                if (data.yLabels[i]) el.textContent = data.yLabels[i];
            });

            if (chartLine) chartLine.setAttribute('points', data.linePts);
            if (chartDashedLine) chartDashedLine.setAttribute('points', data.dashedPts);
            if (chartBand) chartBand.setAttribute('points', data.bandPts);
            if (benchmarkLine) benchmarkLine.setAttribute('points', data.benchmarkPts);

            for (let i = 0; i < 7; i++) {
                const dot = document.getElementById(`dot7-${i}`) || document.getElementById(`dot-${i}`);
                if (dot) dot.setAttribute('cy', data.dotY[i]);
            }
        });
    });

    hoverTriggers.forEach(trigger => {
        const i = trigger.getAttribute('data-idx');
        trigger.addEventListener('mouseenter', () => {
            const vline = document.getElementById(`vline7-${i}`) || document.getElementById(`vline-${i}`);
            const dot = document.getElementById(`dot7-${i}`) || document.getElementById(`dot-${i}`);
            if (vline) vline.style.opacity = '1';
            if (dot) dot.style.opacity = '1';

            if (ttDate) ttDate.textContent = hoverDates[i];
            if (ttName) ttName.textContent = datasets[activeIdx].name;
            if (ttVal) ttVal.textContent = datasets[activeIdx].hoverVals[i];
            if (popover) popover.style.display = 'block';
        });

        trigger.addEventListener('mousemove', (e) => {
            if (!popover) return;
            let left = e.clientX + 15;
            let top = e.clientY - 30;
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

        trigger.addEventListener('mouseleave', () => {
            const vline = document.getElementById(`vline7-${i}`) || document.getElementById(`vline-${i}`);
            const dot = document.getElementById(`dot7-${i}`) || document.getElementById(`dot-${i}`);
            if (vline) vline.style.opacity = '0';
            if (dot) dot.style.opacity = '0';
            if (popover) popover.style.display = 'none';
        });
    });

    const slider = document.getElementById('metricSlider7') || document.getElementById('metricSlider');
    const prevBtn = document.getElementById('navPrev7') || document.getElementById('navPrev');
    const nextBtn = document.getElementById('navNext7') || document.getElementById('navNext');
    let sliderPos = 0;

    function updateNavButtons() {
        if (!slider || !prevBtn || !nextBtn) return;
        const maxScroll = -(slider.scrollWidth - slider.parentElement.offsetWidth);
        if (sliderPos >= 0) {
            prevBtn.classList.add('disabled');
        } else {
            prevBtn.classList.remove('disabled');
        }
        if (sliderPos <= maxScroll || maxScroll >= 0) {
            nextBtn.classList.add('disabled');
        } else {
            nextBtn.classList.remove('disabled');
        }
    }

    if (nextBtn && slider) {
        nextBtn.addEventListener('click', () => {
            const maxScroll = -(slider.scrollWidth - slider.parentElement.offsetWidth);
            if (sliderPos > maxScroll) {
                sliderPos -= 232;
                if (sliderPos < maxScroll) sliderPos = maxScroll;
                slider.style.transform = `translateX(${sliderPos}px)`;
                updateNavButtons();
            }
        });
    }

    if (prevBtn && slider) {
        prevBtn.addEventListener('click', () => {
            if (sliderPos < 0) {
                sliderPos += 232;
                if (sliderPos > 0) sliderPos = 0;
                slider.style.transform = `translateX(${sliderPos}px)`;
                updateNavButtons();
            }
        });
    }

    updateNavButtons();
    window.addEventListener('resize', updateNavButtons);
});