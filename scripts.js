//Checks if running on a mobile device
function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

//Creates the image/video elements of the portfolio carousel 
function createImageElement(imageName, containerID) {
    var container = document.querySelector('#' + containerID)

    if (container) {
        if (container.querySelector('img')) {
            return;
        }

        var existingVideo = container.querySelector('video');
        if (existingVideo) {
            existingVideo.remove();
            console.log(`Video removed from container ${containerID}`);
        }

        var imageElement = document.createElement('img');
        imageElement.setAttribute('src', './img/' + imageName);
        imageElement.className = 'mobile-image';    
        container.appendChild(imageElement);
    }
}

$(document).ready(function() {
    // Initialize Slick carousel
    $('.portfolio-items').slick({
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
        nextArrow: '<div class="right-arrow"><span class="scroll-arrow-right">&#8250;</span></div>',
        prevArrow: '<div class="left-arrow"><span class="scroll-arrow-left">&#8249;</span></div>',
        pauseOnHover: false, // Ensure that hovering over videos doesn't pause them
        responsive: [
            {
                breakpoint: 1500,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: isMobileDevice() ? 1100 : 1000,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    });

    var videoTimes = {}; // Object to store playback times for all slides

    // Set initial video times and play videos on the first load
    $('.portfolio-items .slick-slide').each(function(index, slide) {
        var video = $(slide).find('video').get(0);
        if (video) {
            videoTimes[index] = videoTimes[index] || 0;
            video.currentTime = videoTimes[index];
            video.play();
        }
    });
    
    //Change items for mobile versus PC viewing
    if (isMobileDevice()) {
        document.querySelector('#ucsd-blockquote blockquote').textContent = "UC San Diego";
        document.querySelector('#shiver-blockquote blockquote').textContent = "Shiver Entertainment";
        document.querySelector('#kalloc-blockquote blockquote').textContent = "Kalloc Studios";

        createImageElement('LunarLanderFallback.png', 'lander_container');
        createImageElement('ImprovizFallback.png', 'improviz_container');
        createImageElement('FPSFallback.png', 'fps_game_container');
        createImageElement('RPGFallback.png', 'rpg_game_container');
    } else {
        document.querySelector('#ucsd-blockquote blockquote').textContent = "University of California, San Diego";
        document.querySelector('#shiver-blockquote blockquote').textContent = "Shiver Entertainment Inc.";
        document.querySelector('#kalloc-blockquote blockquote').textContent = "Kalloc Studios Inc.";
    }

    // Initialize Isotope layout and filters
    document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
        let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
        let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
        let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

        let initIsotope;
        imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
            initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
                itemSelector: '.isotope-item',
                layoutMode: layout,
                filter: filter,
                sortBy: sort
            });
        });

        isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
            filters.addEventListener('click', function() {
                isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
                this.classList.add('filter-active');
                initIsotope.arrange({
                    filter: this.getAttribute('data-filter')
                });
                if (typeof aosInit === 'function') {
                    aosInit();
                }
            }, false);
        });
    });
});