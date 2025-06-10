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

    if (distance < 0) {
      document.getElementById('countdown').innerHTML = "We're married! 🎉";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('countdown').innerHTML = `
      <div class="countdown-item">
        <span class="countdown-number">${days}</span>
        <span class="countdown-label">Days</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-number">${hours}</span>
        <span class="countdown-label">Hours</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-number">${minutes}</span>
        <span class="countdown-label">Minutes</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-number">${seconds}</span>
        <span class="countdown-label">Seconds</span>
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

  // 4. Add confirmation when clicking the join button
  const joinButton = document.querySelector('.join-button');
  if (joinButton) {
    joinButton.addEventListener('click', function(e) {
      e.preventDefault();
      const confirmation = confirm("You're about to join Jacob & Viktoriia's wedding ceremony. The link will be available closer to the date. Would you like to be notified when it's ready?");
      if (confirmation) {
        const email = prompt("Please enter your email address to be notified:");
        if (email) {
          alert(`Thank you! We'll notify you at ${email} when the ceremony link is ready.`);
          // In a real implementation, you would send this to your backend
        }
      }
    });
  }

  // 5. Add a simple photo gallery functionality
  const createPhotoGallery = function() {
    const photos = [
      { src: './assets/cottagecore.jpg', alt: 'Jacob & Viktoriia together' },
      { src: './assets/cottagecore.jpg', alt: 'Engagement moment' },
      { src: './assets/cottagecore.jpg', alt: 'Happy couple' },
      { src: './assets/cottagecore.jpg', alt: 'Happy couple' }
    ];

    const galleryHTML = `
      <div class="photo-gallery">
        <h2>Our Moments</h2>
        <div class="gallery-container">
          ${photos.map(photo => `
            <div class="gallery-item">
              <img src="${photo.src}" alt="${photo.alt}" loading="lazy">
              <div class="photo-caption">${photo.alt}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    const introSection = document.querySelector('.intro');
    if (introSection) {
      introSection.insertAdjacentHTML('afterend', galleryHTML);
    }
  };

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
});