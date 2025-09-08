document.addEventListener('DOMContentLoaded', () => {

    // --- КОНФИГУРАЦИЯ ---
    const imagesToLoad = [
        './assets/icons/images/gallery-1.jpg', './assets/icons/images/gallery-2.jpg',
        './assets/icons/images/gallery-3.jpg', './assets/icons/images/gallery-4.jpg',
        './assets/icons/images/gallery-5.jpg', './assets/icons/images/gallery-6.jpg',
        './assets/icons/images/gallery-7.jpg', './assets/icons/images/gallery-8.jpg',
    ];
    const galleryChangeInterval = 800;

    // --- ПОИСК ЭЛЕМЕНТОВ ---
    const body = document.body;
    const preloader = document.querySelector('.preloader');
    const preloaderOverlay = document.querySelector('.preloader__overlay');
    const animatableImage = document.querySelector('.preloader__image-animatable');
    const galleryContainer = document.querySelector('.item-2');

    let loadedImagesCount = 0;
    let currentImageIndex = 0;

    // --- ФУНКЦИЯ ПРЕДЗАГРУЗКИ ---
    function preloadImages() {
        animatableImage.style.backgroundImage = `url(${imagesToLoad[0]})`;
        if (imagesToLoad.length === 0) { startApp(); return; }
        imagesToLoad.forEach(src => {
            const img = new Image();
            img.src = src;
            img.onload = imageLoaded;
            img.onerror = imageLoaded;
        });
    }

    // --- КОЛБЭК НА ЗАГРУЗКУ ОДНОГО ИЗОБРАЖЕНИЯ ---
    function imageLoaded() {
        loadedImagesCount++;
        if (loadedImagesCount >= imagesToLoad.length) {
            setTimeout(startApp, 500);
        }
    }

    // --- ФУНКЦИЯ ЗАПУСКА ОСНОВНОГО ПРИЛОЖЕНИЯ (ОБНОВЛЕНА) ---
    function startApp() {
        // --- ЛОГИКА ДЛЯ ДЕСКТОПА ---
        if (window.innerWidth > 900) {
            preloaderOverlay.style.transform = 'scaleY(0)'; // 1. Сначала убираем оверлей
            preloaderOverlay.addEventListener('transitionend', () => {
                // 2. Оверлей скрылся, запускаем анимацию картинки
                const targetRect = galleryContainer.getBoundingClientRect();

                // 3. Эффект "пульсации" - сначала чуть увеличиваем
                animatableImage.style.transform = 'scale(1.05)';

                setTimeout(() => {
                    // 4. Через 200мс запускаем основную анимацию
                    const bodyRect = document.body.getBoundingClientRect();
                    animatableImage.style.width = `${targetRect.width}px`;
                    animatableImage.style.height = `${targetRect.height}px`;
                    // Считаем смещение относительно всего документа
                    animatableImage.style.transform = `translate(${targetRect.left - bodyRect.left}px, ${targetRect.top - bodyRect.top}px) scale(1)`;
                    animatableImage.style.borderRadius = 'var(--border-radius-desktop)';
                }, 200);

                // 5. Когда анимация картинки закончится
                animatableImage.addEventListener('transitionend', () => {
                    // 6. Прячем прелоадер и показываем основной контент
                    preloader.style.display = 'none';
                    body.classList.add('loaded'); // Появляются остальные блоки
                    galleryContainer.style.backgroundImage = `url(${imagesToLoad[0]})`;
                    setInterval(changeGalleryImage, galleryChangeInterval);
                }, { once: true });

            }, { once: true });
        } 
        // --- ЛОГИКА ДЛЯ МОБИЛЬНЫХ (без изменений) ---
        else {
            preloader.style.display = 'none';
            body.classList.add('loaded');
            galleryContainer.style.backgroundImage = `url(${imagesToLoad[0]})`;
            setInterval(changeGalleryImage, galleryChangeInterval);
            setupMobileAnimations();
        }
    }

    // --- ФУНКЦИЯ СМЕНЫ ИЗОБРАЖЕНИЙ В ГАЛЕРЕЕ ---
    function changeGalleryImage() {
        currentImageIndex = (currentImageIndex + 1) % imagesToLoad.length;
        galleryContainer.style.backgroundImage = `url(${imagesToLoad[currentImageIndex]})`;
    }

    // --- ФУНКЦИЯ ДЛЯ АНИМАЦИИ НА МОБИЛЬНЫХ ПРИ СКРОЛЛЕ ---
    const setupMobileAnimations = () => {
        if (window.innerWidth > 900) return;
        const animatedItems = document.querySelectorAll('.item-1, .item-2, .horizontal-scroll-wrapper, .item-3, .item-6');
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        animatedItems.forEach(item => observer.observe(item));
    };

    // --- СТАРТ ---
    preloadImages();
    if (window.innerWidth <= 900) {
        // На мобильных setupMobileAnimations вызывается внутри startApp, чтобы не было конфликта
    }
});
