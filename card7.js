document.addEventListener('DOMContentLoaded', () => {
    
    const datasets = [
        {
            yLabels: ["1 phút 20 giây", "1 phút 00 giây", "40 giây", "20 giây", "0 giây"],
            linePts: "0,220 100,220 250,220 400,220 550,220 680,220 720,110",
            bandPts: "0,120 40,120 70,90 140,90 170,120 240,120 270,90 340,90 370,120 440,120 470,90 540,90 570,120 640,120 670,90 740,90 750,90 750,140 740,140 670,140 640,170 570,170 540,140 470,140 440,170 370,170 340,140 270,140 240,170 170,170 140,140 70,140 40,170 0,170",
            hoverVals: ["0 giây", "0 giây", "0 giây", "0 giây", "38 giây"],
            dotY: [220, 220, 220, 220, 110],
            name: "Thời gian tương tác trung bình trên mỗi người dùng đang hoạt động"
        },
        {
            yLabels: ["2", "1,5", "1", "0,5", "0"],
            linePts: "0,220 100,220 250,220 400,220 550,220 680,220 720,120",
            bandPts: "0,130 40,130 70,100 140,100 170,130 240,130 270,100 340,100 370,130 440,130 470,100 540,100 570,130 640,130 670,100 740,100 750,100 750,150 740,150 670,150 640,180 570,180 540,150 470,150 440,180 370,180 340,150 270,150 240,180 170,180 140,150 70,150 40,180 0,180",
            hoverVals: ["0", "0", "0", "0", "1"],
            dotY: [220, 220, 220, 220, 120],
            name: "Số phiên có sự tương tác trên mỗi người dùng đang hoạt động"
        },
        {
            yLabels: ["40 giây", "30 giây", "20 giây", "10 giây", "0 giây"],
            linePts: "0,220 100,220 250,220 400,220 550,220 680,220 720,136",
            bandPts: "0,140 40,140 70,110 140,110 170,140 240,140 270,110 340,110 370,140 440,140 470,110 540,110 570,140 640,140 670,110 740,110 750,110 750,160 740,160 670,160 640,190 570,190 540,160 470,160 440,190 370,190 340,160 270,160 240,190 170,190 140,160 70,160 40,190 0,190",
            hoverVals: ["0 giây", "0 giây", "0 giây", "0 giây", "12 giây"],
            dotY: [220, 220, 220, 220, 136],
            name: "Thời gian tương tác trung bình/phiên hoạt động"
        }
    ];

    const hoverDates = ["30 thg", "06 thg", "13 thg", "20 thg", "Hôm nay"];
    
    let activeIdx = 0;

    const yLabelEls = document.querySelectorAll('.y-label');
    const chartLine = document.getElementById('chartLine');
    const chartBand = document.getElementById('chartBand');
    const metricBoxes = document.querySelectorAll('.metric-box');
    const ttName = document.getElementById('ttName');
    
    metricBoxes.forEach((box, index) => {
        box.addEventListener('click', () => {
            metricBoxes.forEach(b => {
                b.classList.remove('active');
                b.querySelector('.metric-title').classList.remove('text-primary');
                b.querySelector('.metric-title').classList.add('text-secondary');
            });
            
            box.classList.add('active');
            box.querySelector('.metric-title').classList.remove('text-secondary');
            box.querySelector('.metric-title').classList.add('text-primary');
            
            activeIdx = index;
            const data = datasets[activeIdx];
            
            yLabelEls.forEach((el, i) => {
                el.textContent = data.yLabels[i];
            });
            
            chartLine.setAttribute('points', data.linePts);
            chartBand.setAttribute('points', data.bandPts);
            
            for(let i=0; i<5; i++) {
                document.getElementById(`dot-${i}`).setAttribute('cy', data.dotY[i]);
            }
        });
    });

    const hoverTriggers = document.querySelectorAll('.hover-trigger');
    const popover = document.getElementById('tooltipPopover');
    const ttDate = document.getElementById('ttDate');
    const ttVal = document.getElementById('ttVal');

    hoverTriggers.forEach(trigger => {
        const i = trigger.getAttribute('data-idx');
        
        trigger.addEventListener('mouseenter', () => {
            document.getElementById(`vline-${i}`).style.opacity = '1';
            document.getElementById(`dot-${i}`).style.opacity = '1';
            
            ttDate.textContent = hoverDates[i];
            ttName.textContent = datasets[activeIdx].name;
            ttVal.textContent = datasets[activeIdx].hoverVals[i];
            
            popover.style.display = 'block';
        });

        trigger.addEventListener('mousemove', (e) => {
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
            document.getElementById(`vline-${i}`).style.opacity = '0';
            document.getElementById(`dot-${i}`).style.opacity = '0';
            popover.style.display = 'none';
        });
    });

    const slider = document.getElementById('metricSlider');
    const prevBtn = document.getElementById('navPrev');
    const nextBtn = document.getElementById('navNext');
    let sliderPos = 0;

    nextBtn.addEventListener('click', () => {
        const maxScroll = -(slider.scrollWidth - slider.parentElement.offsetWidth);
        if (sliderPos > maxScroll) {
            sliderPos -= 250;
            if (sliderPos < maxScroll) sliderPos = maxScroll;
            slider.style.transform = `translateX(${sliderPos}px)`;
        }
    });

    prevBtn.addEventListener('click', () => {
        if (sliderPos < 0) {
            sliderPos += 250;
            if (sliderPos > 0) sliderPos = 0;
            slider.style.transform = `translateX(${sliderPos}px)`;
        }
    });

});