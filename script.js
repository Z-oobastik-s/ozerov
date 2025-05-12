// Ждем, пока DOM полностью загрузится
document.addEventListener('DOMContentLoaded', function() {
    // ----- Элементы интерфейса -----
    const backgroundContainer = document.querySelector('.background-container');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const soundToggle = document.getElementById('sound-toggle');
    const soundOnIcon = document.querySelector('.icon-sound-on');
    const soundOffIcon = document.querySelector('.icon-sound-off');
    const welcomeSound = document.getElementById('welcome-sound');
    const backgroundMusic = document.getElementById('background-music');
    
    // ----- Фоновые изображения и звуки -----
    
    // Массив с путями к фоновым изображениям
    const backgroundImages = [
        'material/background/background.jpg',
        'material/background/background_1.jpg',
        'material/background/background_2.jpg',
        'material/background/background_3.jpg'
    ];
    
    // Функция для установки случайного фонового изображения
    function setRandomBackground() {
        const randomIndex = Math.floor(Math.random() * backgroundImages.length);
        const randomBgImage = backgroundImages[randomIndex];
        
        const img = new Image();
        img.src = randomBgImage;
        
        img.onload = function() {
            backgroundContainer.style.setProperty('--bg-image', `url(${randomBgImage})`);
            backgroundContainer.querySelector('.overlay').style.opacity = '1';
            
            // Добавляем стиль для фона с помощью ::before
            document.styleSheets[0].insertRule(`.background-container::before { background-image: url(${randomBgImage}); }`, 0);
        };
    }
    
    // Устанавливаем случайный фон при загрузке страницы
    setRandomBackground();
    
    // ----- Управление звуком -----
    
    // Состояние звука (изначально включен)
    let soundEnabled = true;
    
    // Обработчик нажатия на кнопку включения/выключения звука
    soundToggle.addEventListener('click', function() {
        soundEnabled = !soundEnabled;
        
        if (soundEnabled) {
            soundOnIcon.classList.remove('hidden');
            soundOffIcon.classList.add('hidden');
            
            // Если музыка уже начала играть, продолжаем воспроизведение
            if (welcomeSound.ended && !backgroundMusic.paused) {
                backgroundMusic.play();
            } else if (!welcomeSound.ended) {
                welcomeSound.play();
            } else {
                // Если ни один звук не воспроизводится, начинаем фоновую музыку
                backgroundMusic.play();
            }
        } else {
            soundOnIcon.classList.add('hidden');
            soundOffIcon.classList.remove('hidden');
            
            // Приостанавливаем все звуки
            welcomeSound.pause();
            backgroundMusic.pause();
        }
    });
    
    // Воспроизводим приветственный звук при загрузке страницы
    welcomeSound.volume = 0.7;
    backgroundMusic.volume = 0.5;
    
    // Проверка на автовоспроизведение
    function tryPlayAudio() {
        if (soundEnabled) {
            // Пробуем воспроизвести приветственный звук
            welcomeSound.play().catch(function(error) {
                console.log('Автовоспроизведение заблокировано браузером', error);
                
                // Если автовоспроизведение заблокировано, показываем подсказку пользователю
                const audioHint = document.createElement('div');
                audioHint.classList.add('audio-hint');
                audioHint.textContent = 'Нажмите для включения звука';
                audioHint.style.position = 'fixed';
                audioHint.style.top = '50%';
                audioHint.style.left = '50%';
                audioHint.style.transform = 'translate(-50%, -50%)';
                audioHint.style.background = 'rgba(0,0,0,0.7)';
                audioHint.style.color = 'white';
                audioHint.style.padding = '20px';
                audioHint.style.borderRadius = '10px';
                audioHint.style.zIndex = '1000';
                audioHint.style.cursor = 'pointer';
                
                document.body.appendChild(audioHint);
                
                audioHint.addEventListener('click', function() {
                    welcomeSound.play();
                    audioHint.remove();
                });
            });
        }
    }
    
    // Воспроизводим звуки с небольшой задержкой после загрузки страницы
    setTimeout(tryPlayAudio, 1000);
    
    // Когда приветственный звук закончится, начинаем воспроизводить фоновую музыку
    welcomeSound.addEventListener('ended', function() {
        if (soundEnabled) {
            backgroundMusic.play();
        }
    });
    
    // ----- Мобильное меню -----
    
    // Обработчик нажатия на гамбургер-меню
    menuToggle.addEventListener('click', function() {
        // Переключаем активное состояние меню
        navLinks.classList.toggle('active');
        
        // Анимируем иконку гамбургера
        const bars = menuToggle.querySelectorAll('.bar');
        
        if (navLinks.classList.contains('active')) {
            // Превращаем в крестик
            bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
        } else {
            // Возвращаем исходный вид
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });
    
    // Закрываем меню при нажатии на ссылку
    document.querySelectorAll('.nav-links a').forEach(function(link) {
        link.addEventListener('click', function() {
            // Только для мобильных устройств (когда виден переключатель меню)
            if (window.getComputedStyle(menuToggle).display !== 'none') {
                navLinks.classList.remove('active');
                
                // Возвращаем гамбургер в исходное состояние
                const bars = menuToggle.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    });
    
    // ----- Параллакс-эффект -----
    
    // Если на странице есть секция-герой, добавляем эффект параллакса
    const heroSection = document.querySelector('.hero');
    
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            
            // Эффект параллакса для фона
            backgroundContainer.style.transform = `translateY(${scrollPosition * 0.3}px)`;
        });
    }
    
    // ----- Анимация при скролле -----
    
    // Функция для анимации элементов при прокрутке
    function animateOnScroll() {
        const elements = document.querySelectorAll('.feature-card, .gallery-item');
        
        elements.forEach(function(element) {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            // Если элемент входит в область видимости
            if (elementPosition < windowHeight * 0.85) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Запускаем анимацию при скролле
    window.addEventListener('scroll', animateOnScroll);
    
    // Запускаем анимацию при загрузке страницы
    animateOnScroll();
    
    // ----- Галерея -----
    
    // Если на странице есть галерея, инициализируем её
    const gallerySlider = document.querySelector('.gallery-slider');
    
    if (gallerySlider) {
        const galleryNavPrev = document.querySelector('.gallery-nav-btn.prev');
        const galleryNavNext = document.querySelector('.gallery-nav-btn.next');
        
        let currentSlide = 0;
        const slidesCount = gallerySlider.children.length;
        
        // Клонируем элементы для бесконечной прокрутки
        if (slidesCount > 0) {
            // Клонируем первые и последние элементы для создания эффекта бесконечности
            const firstItems = [];
            const lastItems = [];
            
            // Клонируем первые 3 элемента (или меньше, если элементов меньше)
            for (let i = 0; i < Math.min(3, slidesCount); i++) {
                const clone = gallerySlider.children[i].cloneNode(true);
                firstItems.push(clone);
            }
            
            // Клонируем последние 3 элемента (или меньше, если элементов меньше)
            for (let i = Math.max(0, slidesCount - 3); i < slidesCount; i++) {
                const clone = gallerySlider.children[i].cloneNode(true);
                lastItems.push(clone);
            }
            
            // Добавляем клоны в начало и конец слайдера
            lastItems.forEach(item => {
                gallerySlider.insertBefore(item, gallerySlider.firstChild);
            });
            
            firstItems.forEach(item => {
                gallerySlider.appendChild(item);
            });
            
            // Обновляем счетчик слайдов с учетом клонов
            currentSlide = lastItems.length;
            
            // Устанавливаем начальную позицию слайдера
            setTimeout(() => {
                const slideWidth = gallerySlider.children[0].offsetWidth;
                const slideGap = parseInt(window.getComputedStyle(gallerySlider).gap);
                gallerySlider.style.transition = 'none';
                gallerySlider.style.transform = `translateX(-${currentSlide * (slideWidth + slideGap)}px)`;
                
                // Возвращаем анимацию после установки начальной позиции
                setTimeout(() => {
                    gallerySlider.style.transition = 'transform 0.5s var(--transition-function)';
                }, 50);
            }, 100);
        }
        
        // Функция для прокрутки галереи
        function scrollGallery(direction) {
            const totalSlides = gallerySlider.children.length;
            const slideWidth = gallerySlider.children[0].offsetWidth;
            const slideGap = parseInt(window.getComputedStyle(gallerySlider).gap);
            
            if (direction === 'next') {
                currentSlide++;
                
                // Проверка достижения клона первого слайда
                if (currentSlide >= totalSlides - Math.min(3, slidesCount)) {
                    // Анимируем переход к клону
                    gallerySlider.style.transform = `translateX(-${currentSlide * (slideWidth + slideGap)}px)`;
                    
                    // После анимации перемещаем к реальному первому слайду без анимации
                    setTimeout(() => {
                        currentSlide = lastItems.length;
                        gallerySlider.style.transition = 'none';
                        gallerySlider.style.transform = `translateX(-${currentSlide * (slideWidth + slideGap)}px)`;
                        
                        // Восстанавливаем анимацию
                        setTimeout(() => {
                            gallerySlider.style.transition = 'transform 0.5s var(--transition-function)';
                        }, 50);
                    }, 500);
                } else {
                    // Обычное перемещение вперед
                    gallerySlider.style.transform = `translateX(-${currentSlide * (slideWidth + slideGap)}px)`;
                }
            } else {
                currentSlide--;
                
                // Проверка достижения клона последнего слайда
                if (currentSlide < 0) {
                    // Анимируем переход к клону
                    gallerySlider.style.transform = `translateX(-${currentSlide * (slideWidth + slideGap)}px)`;
                    
                    // После анимации перемещаем к реальному последнему слайду без анимации
                    setTimeout(() => {
                        currentSlide = totalSlides - lastItems.length - 1;
                        gallerySlider.style.transition = 'none';
                        gallerySlider.style.transform = `translateX(-${currentSlide * (slideWidth + slideGap)}px)`;
                        
                        // Восстанавливаем анимацию
                        setTimeout(() => {
                            gallerySlider.style.transition = 'transform 0.5s var(--transition-function)';
                        }, 50);
                    }, 500);
                } else {
                    // Обычное перемещение назад
                    gallerySlider.style.transform = `translateX(-${currentSlide * (slideWidth + slideGap)}px)`;
                }
            }
        }
        
        // Добавляем обработчики
        if (galleryNavPrev && galleryNavNext) {
            galleryNavPrev.addEventListener('click', function() {
                scrollGallery('prev');
            });
            
            galleryNavNext.addEventListener('click', function() {
                scrollGallery('next');
            });
        }
        
        // Автоматическая прокрутка галереи
        const autoScrollInterval = setInterval(function() {
            scrollGallery('next');
        }, 5000);
        
        // Останавливаем автоскролл при наведении на галерею
        gallerySlider.addEventListener('mouseenter', function() {
            clearInterval(autoScrollInterval);
        });
        
        // Возобновляем автоскролл при уходе курсора
        gallerySlider.addEventListener('mouseleave', function() {
            clearInterval(autoScrollInterval);
            autoScrollInterval = setInterval(function() {
                scrollGallery('next');
            }, 5000);
        });
    }
    
    // ----- Аккордеон на странице информации -----
    
    // Если на странице есть аккордеон, инициализируем его
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    if (accordionItems.length > 0) {
        accordionItems.forEach(function(item) {
            const header = item.querySelector('.accordion-header');
            
            header.addEventListener('click', function() {
                // Проверяем, активен ли текущий элемент
                const isActive = item.classList.contains('active');
                
                // Закрываем все элементы
                accordionItems.forEach(function(accordionItem) {
                    accordionItem.classList.remove('active');
                });
                
                // Если текущий элемент не был активен, открываем его
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
        
        // По умолчанию открываем первый элемент
        accordionItems[0].classList.add('active');
    }
    
    // ----- Форма бронирования -----
    
    // Если на странице есть форма бронирования, инициализируем её
    const bookingForm = document.getElementById('booking-form');
    const successModal = document.getElementById('booking-success');
    
    if (bookingForm && successModal) {
        // Обработчик отправки формы
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Проверяем, выбрана ли хотя бы одна услуга
            const services = document.querySelectorAll('input[name="services"]:checked');
            if (services.length === 0) {
                alert('Пожалуйста, выберите хотя бы одну услугу');
                return;
            }
            
            // Имитация отправки формы на сервер
            const submitButton = bookingForm.querySelector('.submit-button');
            submitButton.disabled = true;
            submitButton.textContent = 'Отправка...';
            
            // Имитируем задержку отправки на сервер
            setTimeout(function() {
                // Отображаем модальное окно с успешной отправкой
                successModal.classList.add('active');
                
                // Сбрасываем форму
                bookingForm.reset();
                
                // Восстанавливаем кнопку
                submitButton.disabled = false;
                submitButton.textContent = 'Забронировать';
                
                // Добавляем обработчики для закрытия модального окна
                const closeModal = successModal.querySelector('.close-modal');
                const modalButton = successModal.querySelector('.modal-button');
                
                function hideModal() {
                    successModal.classList.remove('active');
                }
                
                closeModal.addEventListener('click', hideModal);
                modalButton.addEventListener('click', hideModal);
                
                // Закрываем модальное окно при клике вне его содержимого
                successModal.addEventListener('click', function(e) {
                    if (e.target === successModal) {
                        hideModal();
                    }
                });
            }, 1500);
        });
        
        // Проверка времени работы при выборе времени
        const timeFromInput = document.getElementById('time-from');
        const timeToInput = document.getElementById('time-to');
        
        if (timeFromInput && timeToInput) {
            // Функция для проверки допустимого диапазона времени
            function validateTimeRange() {
                const timeFrom = timeFromInput.value;
                const timeTo = timeToInput.value;
                
                if (timeFrom && timeTo) {
                    // Преобразуем время в минуты для сравнения
                    const fromMinutes = convertTimeToMinutes(timeFrom);
                    const toMinutes = convertTimeToMinutes(timeTo);
                    
                    // Проверяем, что время "с" раньше, чем время "до"
                    if (fromMinutes >= toMinutes) {
                        timeToInput.setCustomValidity('Время "до" должно быть позже времени "с"');
                    } else {
                        timeToInput.setCustomValidity('');
                    }
                }
            }
            
            // Функция для преобразования времени в минуты
            function convertTimeToMinutes(time) {
                const [hours, minutes] = time.split(':').map(Number);
                return hours * 60 + minutes;
            }
            
            // Добавляем обработчики событий для проверки времени
            timeFromInput.addEventListener('change', validateTimeRange);
            timeToInput.addEventListener('change', validateTimeRange);
        }
        
        // Обновление стоимости при изменении услуг
        const serviceCheckboxes = document.querySelectorAll('input[name="services"]');
        
        serviceCheckboxes.forEach(function(checkbox) {
            checkbox.addEventListener('change', function() {
                // Если выбран комплексный пакет, снимаем выбор с отдельных услуг
                if (checkbox.id === 'package' && checkbox.checked) {
                    serviceCheckboxes.forEach(function(cb) {
                        if (cb.id !== 'package') {
                            cb.checked = false;
                            cb.disabled = true;
                        }
                    });
                } 
                // Если снят комплексный пакет, разблокируем отдельные услуги
                else if (checkbox.id === 'package' && !checkbox.checked) {
                    serviceCheckboxes.forEach(function(cb) {
                        cb.disabled = false;
                    });
                }
                
                // Если выбраны отдельные услуги, блокируем комплексный пакет
                const anyServiceChecked = Array.from(serviceCheckboxes)
                    .some(cb => cb.id !== 'package' && cb.checked);
                
                const packageCheckbox = document.getElementById('package');
                
                if (anyServiceChecked && packageCheckbox) {
                    packageCheckbox.disabled = true;
                } else if (packageCheckbox) {
                    packageCheckbox.disabled = false;
                }
            });
        });
    }
    
    // ----- Чекбоксы с пакетами услуг -----
    
    if (document.querySelector('.package-checkboxes')) {
        const packageCheckboxes = document.querySelectorAll('.package-checkbox');
        
        packageCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    // Отключаем другие чекбоксы
                    packageCheckboxes.forEach(otherCheckbox => {
                        if (otherCheckbox !== this) {
                            otherCheckbox.checked = false;
                            otherCheckbox.disabled = true;
                        }
                    });
                } else {
                    // Включаем все чекбоксы обратно
                    packageCheckboxes.forEach(packageCheckbox => {
                        packageCheckbox.disabled = false;
                    });
                }
            });
        });
    }
});

// ----- Прелоадер -----

// Скрываем прелоадер после полной загрузки страницы
window.addEventListener('load', function() {
    const body = document.body;
    
    // Добавляем класс для плавного появления контента
    body.classList.add('loaded');
    
    // Скрываем прелоадер
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        
        // Удаляем прелоадер после исчезновения
        setTimeout(function() {
            preloader.style.display = 'none';
        }, 500);
    }
}); 