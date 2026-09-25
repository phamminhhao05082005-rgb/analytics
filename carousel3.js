document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('recentTrack');
    const prevBtn = document.getElementById('recentPrevBtn');
    const nextBtn = document.getElementById('recentNextBtn');
    
    const cardWidth = 296; 
    let currentPosition = 0;

    const updateButtons = () => {
        const containerWidth = document.getElementById('recentTrackContainer').offsetWidth;
        const trackWidth = track.scrollWidth;

        if (currentPosition === 0) {
            prevBtn.disabled = true;
        } else {
            prevBtn.disabled = false;
        }

        if (Math.abs(currentPosition) + containerWidth >= trackWidth) {
            nextBtn.disabled = true;
        } else {
            nextBtn.disabled = false;
        }
    };

    nextBtn.addEventListener('click', () => {
        const containerWidth = document.getElementById('recentTrackContainer').offsetWidth;
        const maxScroll = (track.scrollWidth - containerWidth) * -1;
        
        currentPosition -= cardWidth;
        
        if (currentPosition < maxScroll) {
            currentPosition = maxScroll;
        }

        track.style.transform = `translateX(${currentPosition}px)`;
        updateButtons();
    });

    prevBtn.addEventListener('click', () => {
        currentPosition += cardWidth;
        
        if (currentPosition > 0) {
            currentPosition = 0;
        }

        track.style.transform = `translateX(${currentPosition}px)`;
        updateButtons();
    });

    window.addEventListener('resize', updateButtons);
    
    setTimeout(updateButtons, 100);
});