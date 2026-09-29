google.charts.load('current', {
    'packages': ['geochart']
});
google.charts.setOnLoadCallback(drawRegionsMap);

function drawRegionsMap() {
    var data = google.visualization.arrayToDataTable([
        ['Country', 'Users'],
        ['India', 4700],
        ['Bangladesh', 3200],
        ['United States', 2900],
        ['Nigeria', 1100],
        ['Pakistan', 894],
        ['Indonesia', 845],
        ['Brazil', 542],
        ['Canada', 1200],
        ['France', 900],
        ['Australia', 850],
        ['Mexico', 600],
        ['South Africa', 400],
        ['Russia', 1500]
    ]);

    var options = {
        colorAxis: { colors: ['#c6d8f9', '#4285f4', '#2a56c6'] },
        backgroundColor: 'transparent',
        datalessRegionColor: '#f1f3f4',
        defaultColor: '#f1f3f4',
        legend: 'none',
        tooltip: { trigger: 'focus' },
        keepAspectRatio: true
    };

    var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));
    chart.draw(data, options);
}

document.addEventListener('DOMContentLoaded', () => {
    const mapDiv = document.getElementById('regions_div');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const wrapper = document.getElementById('mapWrapper');

    let currentScale = 1;
    let isDragging = false;
    let startX, startY;
    let translateX = 0;
    let translateY = 0;

    function updateTransform() {
        mapDiv.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;
    }

    zoomInBtn.addEventListener('click', () => {
        currentScale += 0.4;
        updateTransform();
    });

    zoomOutBtn.addEventListener('click', () => {
        currentScale = Math.max(1, currentScale - 0.4);
        if (currentScale === 1) {
            translateX = 0;
            translateY = 0;
        }
        updateTransform();
    });

    wrapper.addEventListener('mousedown', (e) => {
        if (currentScale > 1) {
            isDragging = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
        }
    });

    window.addEventListener('mousemove', (e) => {
        if (isDragging) {
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            updateTransform();
        }
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });
});