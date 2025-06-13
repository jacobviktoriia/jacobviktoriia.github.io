document.addEventListener('DOMContentLoaded', function() {
  // 1. Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // 2. Wedding countdown timer
  function updateCountdown() {
    const weddingDate = new Date('July 7, 2025 18:00:00 UTC-6').getTime();
    const now = new Date().getTime();
    const distance = weddingDate - now;

    // Default English labels
    let labels = {
      days: "Days",
      hours: "Hours", 
      minutes: "Minutes",
      seconds: "Seconds",
      marriedMessage: "We're married! 🎉"
    };

    // Check if translations are loaded and get current language labels
    if (typeof window.translations !== 'undefined' && typeof window.currentLanguage !== 'undefined') {
      const currentLang = window.currentLanguage();
      if (window.translations[currentLang]) {
        labels = window.translations[currentLang];
      }
    }

    if (distance < 0) {
      document.getElementById('countdown').innerHTML = labels.marriedMessage;
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('countdown').innerHTML = `
      <div class="countdown-item">
        <span class="countdown-number">${days}</span>
        <span class="countdown-label">${labels.days}</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-number">${hours}</span>
        <span class="countdown-label">${labels.hours}</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-number">${minutes}</span>
        <span class="countdown-label">${labels.minutes}</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-number">${seconds}</span>
        <span class="countdown-label">${labels.seconds}</span>
      </div>
    `;
  }

  // Create countdown element if it doesn't exist
  if (!document.getElementById('countdown')) {
    const countdownDiv = document.createElement('div');
    countdownDiv.id = 'countdown';
    countdownDiv.className = 'countdown-container';
    document.querySelector('.event').insertBefore(countdownDiv, document.querySelector('.event-details'));
  }

  // Initialize and update countdown every second
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 3. Animate elements when they come into view - ONE DIRECTION ONLY
  const animateOnScroll = function() {
    const elements = document.querySelectorAll('.milestone, .detail-card, section');
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.3;

      // Only fade in when scrolling down and element comes into view
      // Once faded in, stay visible
      if (elementPosition < screenPosition && element.style.opacity !== '1') {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    });
  };

  // Function to set initial styles for animation
  const setInitialAnimationStyles = function() {
    document.querySelectorAll('.milestone, .detail-card, section').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'all 0.6s ease-out';
    });
  };

  // Set initial styles for existing elements
  setInitialAnimationStyles();

  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll(); // Run once on load

  // // 4. Add confirmation when clicking the join button
  // const joinButton = document.querySelector('.join-button');
  // if (joinButton) {
  //   joinButton.addEventListener('click', function(e) {
  //     e.preventDefault();
  //     const confirmation = confirm("You're about to join Jacob & Viktoriia's wedding ceremony. The link will be available closer to the date. Would you like to be notified when it's ready?");
  //     if (confirmation) {
  //       const email = prompt("Please enter your email address to be notified:");
  //       if (email) {
  //         alert(`Thank you! We'll notify you at ${email} when the ceremony link is ready.`);
  //         // In a real implementation, you would send this to your backend
  //       }
  //     }
  //   });
  // }

  // 5. Updated photo gallery functionality with modal enlargement
  const createPhotoGallery = function() {
    const photos = [
      { src: './assets/arm.jpg', alt: 'First Time Meeting 😍' },
      { src: './assets/happy.jpg', alt: 'Happy Together 😊' },
      { src: './assets/engagement.jpg', alt: 'Engagement Day 💍' },
      { src: './assets/baby.jpg', alt: 'Pretty Little Baby 🐣' }
    ];

    const galleryHTML = `
      <div class="photo-gallery">
        <h2>Our Moments</h2>
        <div class="gallery-container">
          ${photos.map((photo, index) => `
            <div class="gallery-item" onclick="openPhotoModal(${index})">
              <img src="${photo.src}" alt="${photo.alt}" loading="lazy">
              <div class="photo-caption">${photo.alt}</div>
            </div>
          `).join('')}
        </div>
        <p class="gallery-subtitle">We've got many pictures, moments, and stories to share, so stay tuned!</p>
      </div>
      
      <!-- Photo Modal -->
      <div id="photoModal" class="photo-modal" onclick="closePhotoModal(event)">
        <div class="modal-content">
          <button class="close-modal" onclick="closePhotoModal()">&times;</button>
          <button class="modal-nav prev-btn" onclick="changePhoto(-1)">&#10094;</button>
          <img id="modalImage" class="modal-image" src="" alt="">
          <button class="modal-nav next-btn" onclick="changePhoto(1)">&#10095;</button>
          <div id="modalCaption" class="modal-caption"></div>
        </div>
      </div>
    `;

    const introSection = document.querySelector('.intro');
    if (introSection) {
      introSection.insertAdjacentHTML('afterend', galleryHTML);
    }

    // Store photos globally for modal navigation
    window.galleryPhotos = photos;
    window.currentPhotoIndex = 0;
  };

  // Photo modal functions - Add these to your script.js
  window.openPhotoModal = function(photoIndex) {
    const modal = document.getElementById('photoModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    
    window.currentPhotoIndex = photoIndex;
    const photo = window.galleryPhotos[photoIndex];
    
    modalImage.src = photo.src;
    modalImage.alt = photo.alt;
    modalCaption.textContent = photo.alt;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  window.closePhotoModal = function(event) {
    const modal = document.getElementById('photoModal');
    
    // Only close if clicking on the backdrop or close button
    if (!event || event.target === modal || event.target.classList.contains('close-modal')) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto'; // Restore scrolling
    }
  };

  window.changePhoto = function(direction) {
    const photos = window.galleryPhotos;
    window.currentPhotoIndex += direction;
    
    // Wrap around if at beginning or end
    if (window.currentPhotoIndex >= photos.length) {
      window.currentPhotoIndex = 0;
    } else if (window.currentPhotoIndex < 0) {
      window.currentPhotoIndex = photos.length - 1;
    }
    
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const photo = photos[window.currentPhotoIndex];
    
    modalImage.src = photo.src;
    modalImage.alt = photo.alt;
    modalCaption.textContent = photo.alt;
  };

  // Close modal with Escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      const modal = document.getElementById('photoModal');
      if (modal.style.display === 'block') {
        window.closePhotoModal();
      }
    }
  });

  // Navigate photos with arrow keys
  document.addEventListener('keydown', function(event) {
    const modal = document.getElementById('photoModal');
    if (modal.style.display === 'block') {
      if (event.key === 'ArrowLeft') {
        window.changePhoto(-1);
      } else if (event.key === 'ArrowRight') {
        window.changePhoto(1);
      }
    }
  });

  // Enable photo gallery
  createPhotoGallery();

  // 6. Add a simple guestbook functionality - WITH DELETE CAPABILITY
  const createGuestbook = function() {
    const guestbookHTML = `
      <section class="guestbook">
        <h2>Leave Us a Message</h2>
        <form id="guestbook-form">
          <div class="form-group">
            <label for="guest-name">Your Name:</label>
            <input type="text" id="guest-name" required>
          </div>
          <div class="form-group">
            <label for="guest-message">Your Message:</label>
            <textarea id="guest-message" rows="4" required></textarea>
          </div>
          <button type="submit" class="submit-button">Submit</button>
        </form>
        <div class="guestbook-entries"></div>
      </section>
    `;

    // Insert the guestbook section INSIDE the main container, not before the footer
    const mainElement = document.querySelector('main');
    if (mainElement) {
      // Add it as the last section inside main
      mainElement.insertAdjacentHTML('beforeend', guestbookHTML);
      
      // Apply animation styles to the new guestbook section
      const guestbookSection = document.querySelector('.guestbook');
      if (guestbookSection) {
        guestbookSection.style.opacity = '0';
        guestbookSection.style.transform = 'translateY(20px)';
        guestbookSection.style.transition = 'all 0.6s ease-out';
      }
      
      // Now add the event listener after the form is in the DOM
      const form = document.getElementById('guestbook-form');
      if (form) {
        form.addEventListener('submit', async function(e) {
          e.preventDefault();
          
          const name = document.getElementById('guest-name').value;
          const message = document.getElementById('guest-message').value;
          
          // Disable the submit button to prevent double submission
          const submitButton = form.querySelector('.submit-button');
          const originalText = submitButton.textContent;
          submitButton.textContent = 'Submitting...';
          submitButton.disabled = true;
          
          try {
            // Check if Firebase function is available
            if (typeof window.submitGuestbookMessage === 'function') {
              const success = await window.submitGuestbookMessage(name, message);
              
              if (success) {
                form.reset();
                // alert('Thank you for your message! It will appear below.');
                
                // Store the user's name in localStorage so they can delete their messages
                const userMessages = JSON.parse(localStorage.getItem('userMessages') || '[]');
                userMessages.push(name.trim().toLowerCase());
                localStorage.setItem('userMessages', JSON.stringify(userMessages));
              } else {
                alert('Sorry, there was an error submitting your message. Please try again or contact Jacob ASAP!');
              }
            } else {
              // Fallback if Firebase isn't loaded yet
              alert('Firebase is still loading. Please try again in a moment.');
            }
          } catch (error) {
            console.error('Form submission error:', error);
            alert('Sorry, there was an error submitting your message. Please try again.');
          } finally {
            // Re-enable the submit button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
          }
        });
      }
      
      // Trigger animation check after guestbook is added
      setTimeout(() => {
        animateOnScroll();
      }, 100);
    }
  };

  // Enable guestbook - now it will be properly contained within the main container
  createGuestbook();

  // 7. Add a music toggle button
  const addMusicPlayer = function() {
    const musicButton = document.createElement('button');
    musicButton.id = 'music-toggle';
    musicButton.innerHTML = '🎵 Play Music';
    musicButton.className = 'music-button';
    
    document.body.appendChild(musicButton);
    
    const audio = new Audio('./assets/moon-river.mp3'); // Replace with your music file
    audio.loop = true;
    
    musicButton.addEventListener('click', function() {
      if (audio.paused) {
        audio.play();
        musicButton.innerHTML = '🔇 Pause Music';
      } else {
        audio.pause();
        musicButton.innerHTML = '🎵 Play Music';
      }
    });
  };

  // Enable music player
  addMusicPlayer();

  // Language Toggle System - Add this to your script.js

  // Language data object
  const translations = {
    en: {
      // Header
      headerTitle: "Jacob & Viktoriia",
      headerSubtitle: "We're getting married!",
      
      // Navigation/Intro
      ourJourney: "Our Journey",
      introText1: "Hello! It's <strong>Jacob</strong> and <strong>Viktoriia</strong>. Please press \"Play Music\" at the bottom right corner to enjoy the moment with us!",
      introText2: "We're so excited to share this special season of our lives with you. After months of planning, multiple adjustments, unexpected visa hurdles, and the everyday work/life obstacles, our wedding preparations have often felt nearly impossible. But with God, all things are possible through prayer and faith.",
      introText3: "First, we warmly invite you to join us <strong>virtually</strong> to witness the exchange of our wedding vows. Although visa issues have kept our families apart, this virtual gathering will allow both our families and friends to be present as we say \"I do.\" Your presence (even from afar!) means everything to us. And don't worry, once visas are finalized, we'll celebrate <strong>in person</strong> together with even more joy!",
      
      // Event Details
      eventTitle: "Online Courthouse Wedding Ceremony",
      dateLabel: "Date",
      timeLabel: "Time",
      locationLabel: "Location",
      date: "7ᵗʰ July 2025",
      time: "6:00 PM (UTC-6)",
      location: "Linked Below",
      joinButton: "Join Our Ceremony",
      ceremonyDetails1: "No RSVP required. The ceremony will be recorded for visa documentation (and of course, for our own cherished memories!). We’d love to see your faces with cameras on, but there’s absolutely no pressure.",
      ceremonyDetails2: "We kindly ask our guests to remain silent until Jacob & Viktoriia are officially pronounced husband and wife. Thank you so much! We can't wait to see you all soon! ❤️",

      
      // Timeline
      timelineTitle: "Our Timeline",
      milestone1Title: "Marriage Documents & Apostille Process",
      milestone1Time: "Estimated: 4–6 weeks after the ceremony",
      milestone1Text: "We'll be processing the official paperwork to make everything legally recognized.",
      milestone2Title: "Visa Documentation & Travel",
      milestone2Time: "Timeline: Aug-Sep 2025",
      milestone2Text: "We'll finally reunite in person to celebrate our new life as husband and wife — after nearly a year apart! (During this time, we’ll also gather the necessary documentation for the visa process.)",
      milestone3Title: "Marriage Visa Application",
      milestone3Time: "Estimated Processing Time: ~18 months",
      milestone3Text: "While we wait for our visa applications to finish processing, we plan to stay in Georgia 🇬🇪 to see each other as often and as long as possible. We'll share a short, interesting story about how the Lord gave us a clear and faithful path to lead us here. We'd also love to continue updating you on where He leads us next in our lives.",
      milestone4Title: "In-Person Wedding Celebration",
      milestone4Time: "When: 2026",
      milestone4Text: "We plan to celebrate our marriage with your presence in our home countries (United States 🇺🇸 with Jacob's family & friends and Russia 🇷🇺 with Viktoriia's family & friends). We will send a formal invitation as we approach that date, soon after Viktoriia's US marriage visa and Jacob's Russian marriage visa gets approved.",
      milestone4Note: "Note: This will be a physical celebration with full wedding experience including menu, registry, and all traditional elements.",
      
      // Prayer Section
      prayerTitle: "Our Prayer Request",
      prayerText1: "We thank you for your prayers as we journey through what God has planned for us. Please pray for our marriage and visa processes.",
      prayerText2: "Thank you for your love and support, through God's mercy and grace, as we continue this beautiful journey together.",
      
      // Stay Connected
      stayConnectedTitle: "Stay Connected",
      stayConnectedText1: "We'll keep this website open and updated with major life updates moving forward, such as visa progress, our day-to-day marriage life, and even future blessings like having children!",
      stayConnectedText2: "Feel free to bookmark this address to follow our journey:",
      
      // Photo Gallery
      ourMomentsTitle: "Our Moments",
      gallerySubtitle: "We've got many pictures, moments, and stories to share, so stay tuned!",
      photo1Alt: "First Time Meeting 😍",
      photo2Alt: "Happy Together 😊",
      photo3Alt: "Engagement Day 💍",
      photo4Alt: "Pretty Little Baby 🐣",
      
      // Guestbook
      guestbookTitle: "Leave Us a Message",
      nameLabel: "Your Name:",
      messageLabel: "Your Message:",
      submitButton: "Submit",
      
      // Footer
      footerText: "With love and great joy,",
      
      // Music Button
      playMusic: "🎵 Play Music",
      pauseMusic: "🔇 Pause Music",
      
      // Countdown
      days: "Days",
      hours: "Hours",
      minutes: "Minutes",
      seconds: "Seconds",
      marriedMessage: "We're married! 🎉"
    },
    
    ru: {
      // Header
      headerTitle: "Джейкоб и Виктория",
      headerSubtitle: "Скоро мы станем мужем и женой!",
      
      // Navigation/Intro
      ourJourney: "Наша История",
      introText1: "Привет! Это <strong>Джейкоб</strong> и <strong>Виктория</strong>. Пожалуйста, нажмите \"Включить музыку\" в правом нижнем углу, чтобы насладиться этим моментом вместе с нами!",
      introText2: "Мы так рады поделиться с вами этим особенным периодом нашей жизни. После месяцев планирования, множественных корректировок, неожиданных визовых препятствий и повседневных рабочих/жизненных трудностей, подготовка к нашей свадьбе часто казалась почти невозможной. Но с Богом всё возможно через молитву и веру.",
      introText3: "Прежде всего, мы тепло приглашаем вас присоединиться к нам <strong>виртуально</strong>, чтобы стать свидетелями обмена нашими свадебными клятвами. Хотя визовые проблемы разделили наши семьи, это виртуальное собрание позволит и нашим семьям, и друзьям присутствовать, когда мы скажем \"да\". Ваше присутствие (даже издалека!) значит для нас всё. И не волнуйтесь, как только визы будут готовы, мы отпразднуем <strong>лично</strong> вместе с ещё большей радостью!",
      
      // Event Details
      eventTitle: "Онлайн Церемония Бракосочетания",
      dateLabel: "Дата",
      timeLabel: "Время",
      locationLabel: "Место",
      date: "7 июля 2025",
      time: "18:00 (UTC-6)",
      location: "Ссылка ниже",
      joinButton: "Присоединиться к церемонии",
      ceremonyDetails1: "Подтверждение присутствия не требуется. Церемония будет записана для визовой документации (и, конечно же, для наших собственных дорогих воспоминаний!). Мы бы хотели видеть ваши лица с включёнными камерами, но никакого давления нет.",
      ceremonyDetails2: "Мы вежливо просим наших гостей оставаться в режиме без звука до тех пор, пока Джейкоб и Виктория не будут официально объявлены мужем и женой. Большое спасибо! Мы не можем дождаться встречи с вами всеми в ближайшее время! ❤️",

      
      // Timeline
      timelineTitle: "Наш План",
      milestone1Title: "Оформление документов и апостиль",
      milestone1Time: "Примерно: 4–6 недель после церемонии",
      milestone1Text: "Мы будем обрабатывать официальные документы, чтобы всё было законно признано.",
      milestone2Title: "Визовая документация и поездка",
      milestone2Time: "Сроки: авг-сен 2025",
      milestone2Text: "Наконец-то мы встретимся лично, чтобы отпраздновать нашу новую жизнь как мужа и жены — после почти года разлуки! (В это время мы также соберём необходимые документы для визового процесса.)",
      milestone3Title: "Подача заявления на брачную визу",
      milestone3Time: "Примерное время обработки: ~18 месяцев",
      milestone3Text: "Пока мы ждём окончания обработки наших визовых заявлений, мы планируем оставаться в Грузии 🇬🇪, чтобы видеться как можно чаще и дольше. Мы поделимся короткой, интересной историей о том, как Господь дал нам ясный и верный путь, который привёл нас сюда. Мы также хотели бы продолжать обновлять вас о том, куда Он ведёт нас дальше в нашей жизни.",
      milestone4Title: "Личное свадебное торжество",
      milestone4Time: "Когда: 2026",
      milestone4Text: "Мы планируем отпраздновать наш брак в вашем присутствии в наших родных странах (США 🇺🇸 с семьёй и друзьями Джейкоба и Россия 🇷🇺 с семьёй и друзьями Виктории). Мы отправим официальное приглашение по мере приближения этой даты, вскоре после одобрения американской брачной визы Виктории и российской брачной визы Джейкоба.",
      milestone4Note: "Примечание: Это будет физическое празднование с полным свадебным опытом, включая меню, подарки и все традиционные элементы.",
      
      // Prayer Section
      prayerTitle: "Наша молитвенная просьба",
      prayerText1: "Мы благодарим вас за ваши молитвы, пока мы проходим через то, что Бог запланировал для нас. Пожалуйста, молитесь за наш брак и визовые процессы.",
      prayerText2: "Спасибо за вашу любовь и поддержку, через Божью милость и благодать, пока мы продолжаем это прекрасное путешествие вместе.",
      
      // Stay Connected
      stayConnectedTitle: "Оставайтесь на связи",
      stayConnectedText1: "Мы будем поддерживать этот сайт в рабочем состоянии и обновлять его важными жизненными новостями, такими как прогресс с визами, наша повседневная семейная жизнь и даже будущие благословения, как рождение детей!",
      stayConnectedText2: "Не стесняйтесь добавить этот адрес в закладки, чтобы следить за нашим путешествием:",
      
      // Photo Gallery
      ourMomentsTitle: "Наши Моменты",
      gallerySubtitle: "У нас есть много фотографий, моментов и историй, которыми мы хотим поделиться, так что следите за обновлениями!",
      photo1Alt: "Первая встреча 😍",
      photo2Alt: "Счастливы вместе 😊", 
      photo3Alt: "День помолвки 💍",
      photo4Alt: "хорошенький малыш 🐣",
      
      // Guestbook
      guestbookTitle: "Оставьте нам сообщение",
      nameLabel: "Ваше имя:",
      messageLabel: "Ваше сообщение:",
      submitButton: "Отправить",
      
      // Footer
      footerText: "С любовью и великой радостью,",
      
      // Music Button
      playMusic: "🎵 Включить музыку",
      pauseMusic: "🔇 Пауза",
      
      // Countdown
      days: "Дней",
      hours: "Часов",
      minutes: "Минут",
      seconds: "Секунд",
      marriedMessage: "Мы поженились! 🎉"
    }
  };

  // Current language state
  let currentLanguage = 'en';

  // Function to create language toggle button
  const createLanguageToggle = function() {
    const toggleButton = document.createElement('button');
    toggleButton.id = 'language-toggle';
    toggleButton.innerHTML = '🇷🇺 Русский';
    toggleButton.className = 'language-toggle';
    
    // Position it near the music button
    document.body.appendChild(toggleButton);
    
    toggleButton.addEventListener('click', function() {
      currentLanguage = currentLanguage === 'en' ? 'ru' : 'en';
      updateLanguage();
      toggleButton.innerHTML = currentLanguage === 'en' ? '🇷🇺 Русский' : '🇺🇸 English';
    });
  };

  // Function to update all text content
  const updateLanguage = function() {
    const t = translations[currentLanguage];
    
    // Update header
    const headerTitle = document.querySelector('h1');
    if (headerTitle) headerTitle.textContent = t.headerTitle;
    
    const subtitle = document.querySelector('.subtitle');
    if (subtitle) subtitle.textContent = t.headerSubtitle;
    
    // Update intro section
    const introSection = document.querySelector('.intro');
    if (introSection) {
      const h2 = introSection.querySelector('h2');
      if (h2) h2.textContent = t.ourJourney;
      
      const paragraphs = introSection.querySelectorAll('p');
      if (paragraphs[0]) paragraphs[0].innerHTML = t.introText1;
      if (paragraphs[1]) paragraphs[1].innerHTML = t.introText2;
      if (paragraphs[2]) paragraphs[2].innerHTML = t.introText3;
    }
    
    // Update event section
    const eventSection = document.querySelector('.event');
    if (eventSection) {
      // ... your existing event section updates ...
      
      // Update the ceremony details paragraphs
      const ceremonyParagraphs = eventSection.querySelectorAll('p');
      // Find the paragraphs by their position (they should be the last two paragraphs)
      const paragraphsArray = Array.from(ceremonyParagraphs);
      
      // Update the paragraph with "No RSVP required" content
      const rsvpParagraph = paragraphsArray.find(p => 
        p.textContent.includes('No RSVP required') || 
        p.textContent.includes('Подтверждение присутствия не требуется')
      );
      if (rsvpParagraph) {
        rsvpParagraph.textContent = t.ceremonyDetails1;
      }
      
      // Update the "Thank you so much" paragraph
      const thankYouParagraph = paragraphsArray.find(p => 
        p.textContent.includes('Thank you so much') || 
        p.textContent.includes('Большое спасибо')
      );
      if (thankYouParagraph) {
        thankYouParagraph.textContent = t.ceremonyDetails2;
      }
    }
    
    // Update timeline
    const timelineSection = document.querySelector('.timeline');
    if (timelineSection) {
      const h2 = timelineSection.querySelector('h2');
      if (h2) h2.textContent = t.timelineTitle;
      
      const milestones = timelineSection.querySelectorAll('.milestone');
      if (milestones[0]) {
        milestones[0].querySelector('h3').textContent = t.milestone1Title;
        const paras = milestones[0].querySelectorAll('p');
        if (paras[0]) {
          // Fix: Use current language prefix instead of hardcoded Russian
          const prefix = currentLanguage === 'ru' ? 'Примерно:' : 'Estimated:';
          const timeText = t.milestone1Time.replace(/^(Estimated:|Примерно:)\s*/, '');
          paras[0].innerHTML = `<strong>${prefix}</strong> ${timeText}`;
        }
        if (paras[1]) paras[1].textContent = t.milestone1Text;
      }
      if (milestones[1]) {
        milestones[1].querySelector('h3').textContent = t.milestone2Title;
        const paras = milestones[1].querySelectorAll('p');
        if (paras[0]) {
          // Fix: Use current language prefix instead of hardcoded Russian
          const prefix = currentLanguage === 'ru' ? 'Сроки:' : 'Timeline:';
          const timeText = t.milestone2Time.replace(/^(Timeline:|Сроки:)\s*/, '');
          paras[0].innerHTML = `<strong>${prefix}</strong> ${timeText}`;
        }
        if (paras[1]) paras[1].textContent = t.milestone2Text;
      }
      if (milestones[2]) {
        milestones[2].querySelector('h3').textContent = t.milestone3Title;
        const paras = milestones[2].querySelectorAll('p');
        if (paras[0]) {
          // Fix: Use current language prefix instead of hardcoded Russian
          const prefix = currentLanguage === 'ru' ? 'Примерное время обработки:' : 'Estimated Processing Time:';
          const timeText = t.milestone3Time.replace(/^(Estimated Processing Time:|Примерное время обработки:)\s*/, '');
          paras[0].innerHTML = `<strong>${prefix}</strong> ${timeText}`;
        }
        if (paras[1]) paras[1].textContent = t.milestone3Text;
      }
      if (milestones[3]) {
        milestones[3].querySelector('h3').textContent = t.milestone4Title;
        const paras = milestones[3].querySelectorAll('p');
        if (paras[0]) {
          // Fix: Use current language prefix instead of hardcoded Russian
          const prefix = currentLanguage === 'ru' ? 'Когда:' : 'When:';
          const timeText = t.milestone4Time.replace(/^(When:|Когда:)\s*/, '');
          paras[0].innerHTML = `<strong>${prefix}</strong> ${timeText}`;
        }
        if (paras[1]) paras[1].textContent = t.milestone4Text;
        if (paras[2]) {
          // Fix: Use current language prefix instead of hardcoded Russian
          const prefix = currentLanguage === 'ru' ? 'Примечание:' : 'Note:';
          const noteText = t.milestone4Note.replace(/^(Note:|Примечание:)\s*/, '');
          paras[2].innerHTML = `<em>${prefix} ${noteText}</em>`;
        }
      }
    }
    
    // Update prayer section
    const prayerSection = document.querySelector('.prayer');
    if (prayerSection) {
      const h2 = prayerSection.querySelector('h2');
      if (h2) h2.textContent = t.prayerTitle;
      
      const paragraphs = prayerSection.querySelectorAll('p');
      if (paragraphs[0]) paragraphs[0].textContent = t.prayerText1;
      if (paragraphs[1]) paragraphs[1].textContent = t.prayerText2;
    }
    
    // Update stay connected section
    const bonusSection = document.querySelector('.bonus');
    if (bonusSection) {
      const h2 = bonusSection.querySelector('h2');
      if (h2) h2.textContent = t.stayConnectedTitle;
      
      const paragraphs = bonusSection.querySelectorAll('p');
      if (paragraphs[0]) paragraphs[0].textContent = t.stayConnectedText1;
      if (paragraphs[1]) paragraphs[1].textContent = t.stayConnectedText2;
    }
    
    // Update photo gallery
    const photoGallery = document.querySelector('.photo-gallery');
    if (photoGallery) {
      const h2 = photoGallery.querySelector('h2');
      if (h2) h2.textContent = t.ourMomentsTitle;
      
      const subtitle = photoGallery.querySelector('.gallery-subtitle');
      if (subtitle) subtitle.textContent = t.gallerySubtitle;
      
      // Update photo captions
      const captions = photoGallery.querySelectorAll('.photo-caption');
      if (captions[0]) captions[0].textContent = t.photo1Alt;
      if (captions[1]) captions[1].textContent = t.photo2Alt;
      if (captions[2]) captions[2].textContent = t.photo3Alt;
      if (captions[3]) captions[3].textContent = t.photo4Alt;
    }
    
    // Update guestbook
    const guestbookSection = document.querySelector('.guestbook');
    if (guestbookSection) {
      const h2 = guestbookSection.querySelector('h2');
      if (h2) h2.textContent = t.guestbookTitle;
      
      const nameLabel = guestbookSection.querySelector('label[for="guest-name"]');
      if (nameLabel) nameLabel.textContent = t.nameLabel;
      
      const messageLabel = guestbookSection.querySelector('label[for="guest-message"]');
      if (messageLabel) messageLabel.textContent = t.messageLabel;
      
      const submitButton = guestbookSection.querySelector('.submit-button');
      if (submitButton && !submitButton.disabled) submitButton.textContent = t.submitButton;
    }
    
    // Update footer
    const footer = document.querySelector('footer');
    if (footer) {
      const paragraphs = footer.querySelectorAll('p');
      if (paragraphs[0]) paragraphs[0].textContent = t.footerText;
    }
    
    // Update music button
    const musicButton = document.getElementById('music-toggle');
    if (musicButton) {
      const isPlaying = musicButton.innerHTML.includes('Pause') || musicButton.innerHTML.includes('Пауза');
      musicButton.innerHTML = isPlaying ? t.pauseMusic : t.playMusic;
    }
    
    // Update countdown labels
    updateCountdownLanguage();
  };

  // Function to update countdown with current language
  const updateCountdownLanguage = function() {
    const t = translations[currentLanguage];
    const countdown = document.getElementById('countdown');
    if (countdown && !countdown.innerHTML.includes('married') && !countdown.innerHTML.includes('поженились')) {
      const labels = countdown.querySelectorAll('.countdown-label');
      if (labels[0]) labels[0].textContent = t.days;
      if (labels[1]) labels[1].textContent = t.hours;
      if (labels[2]) labels[2].textContent = t.minutes;
      if (labels[3]) labels[3].textContent = t.seconds;
    }
  };

  // Export functions for use in other parts of the code
  window.updateLanguage = updateLanguage;
  window.currentLanguage = () => currentLanguage;
  window.translations = translations;

  createLanguageToggle();
});