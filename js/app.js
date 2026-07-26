/* ==========================================================================
   JOYLO TRAVEL WELL - INTERACTIVITY CORE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const API_BASE_URL = 'http://localhost:5000/api';

  /* ----------------------------------------------------
     1. Sticky Header Scroll Effect
     ---------------------------------------------------- */
  const header = document.querySelector('.main-header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  /* ----------------------------------------------------
     2. Mobile Menu Toggle
     ---------------------------------------------------- */
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      
      // Animate hamburger to X
      const bars = menuToggle.querySelectorAll('.bar');
      if (menuToggle.classList.contains('active')) {
        bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
      } else {
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
      }
    });

    // Close mobile menu on link click
    const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-item');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('open');
        const bars = menuToggle.querySelectorAll('.bar');
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
      });
    });
  }

  /* ----------------------------------------------------
     3. Toast Notification System
     ---------------------------------------------------- */
  function showToast(message, type = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = '<i class="fa-solid fa-circle-check"></i>';
    if (type === 'error') {
      icon = '<i class="fa-solid fa-circle-exclamation"></i>';
    } else if (type === 'info') {
      icon = '<i class="fa-solid fa-circle-info"></i>';
    }
    
    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);
    
    // Trigger animation frame for CSS slide-in
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    // Slide out and remove
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 4000);
  }

  /* ----------------------------------------------------
     4. Form Submission Listeners
     ---------------------------------------------------- */
  // Hero search form autocomplete
  const heroSearchForm = document.getElementById('heroSearchForm');
  const searchInput = document.getElementById('destinationSearchInput');
  const searchSuggestions = document.getElementById('searchSuggestions');
  const searchClearBtn = document.getElementById('searchClearBtn');
  const searchSubmitBtn = document.getElementById('heroSearchSubmit');

  const destinations = [
    { title: "Spiti Valley Circuit", subtitle: "Himalayan Expedition (₹12,999)", link: "spiti-valley.html", image: "assets/spiti_valley.png", tags: ["spiti", "himalayas", "valley", "trek", "kaza", "india"] },
    { title: "Manali & Kasol Escape", subtitle: "Parvati Valley Retreat (₹8,999)", link: "manali-kasol.html", image: "assets/manali_kasol.png", tags: ["manali", "kasol", "parvati", "trek", "cafe", "india"] },
    { title: "McLeodganj & Triund Trek", subtitle: "Dhauladhar Trek & Camp (₹6,999)", link: "mcleodganj-triund.html", image: "assets/mcleodganj_triund.png", tags: ["mcleodganj", "triund", "dharamshala", "trek", "camp", "india"] },
    { title: "Kedarnath & Chopta Circuit", subtitle: "Sacred Pilgrimage Trek (₹18,499)", link: "kedarnath-chopta.html", image: "assets/kedarnath_chopta.png", tags: ["kedarnath", "chopta", "tungnath", "temple", "trek", "india"] },
    { title: "Leh Ladakh & Pangong", subtitle: "High Altitude Adventure (₹14,999)", link: "leh-ladakh.html", image: "assets/ladakh_pangong.png", tags: ["leh", "ladakh", "pangong", "nubra", "camel", "india"] },
    { title: "Kashmir Valley Paradise", subtitle: "Shikara Stays & Alpine Pines (₹15,999)", link: "kashmir-valley.html", image: "assets/kashmir_valley.png", tags: ["kashmir", "srinagar", "dal lake", "gulmarg", "pahalgam", "india"] },
    { title: "Manali to Jispa Expedition", subtitle: "Sissu Waterfall & Camp (₹7,999)", link: "manali-jispa.html", image: "assets/jispa_expedition.png", tags: ["jispa", "sissu", "manali", "expedition", "india"] },
    { title: "Vietnam Tropical Discovery", subtitle: "Ha Long Bay Luxury Cruise (₹67,000)", link: "vietnam-discovery.html", image: "assets/vietnam.png", tags: ["vietnam", "hanoi", "ha long bay", "hoi an", "international", "asia"] },
    { title: "Kyoto, Japan", subtitle: "Cherry Blossom Culture", link: "destinations.html", image: "assets/kyoto.png", tags: ["kyoto", "japan", "temple", "cherry blossom", "international", "asia"] },
    { title: "Santorini, Greece", subtitle: "Caldera Suites & Sunset Views", link: "destinations.html", image: "assets/santorini.png", tags: ["santorini", "greece", "caldera", "sunset", "international", "europe"] },
    { title: "Amalfi Coast, Italy", subtitle: "Cliffside Luxury & Ocean Views", link: "destinations.html", image: "assets/amalfi.png", tags: ["amalfi", "italy", "coast", "cliffside", "international", "europe"] },
    { title: "Swiss Alps, Switzerland", subtitle: "Alpine Chalets & Mountain Peaks", link: "destinations.html", image: "assets/swiss_alps.png", tags: ["swiss", "alps", "switzerland", "mountains", "snow", "international", "europe"] }
  ];

  if (searchInput && searchSuggestions) {
    let activeIndex = -1;

    // Helper to highlight matching text query
    const highlightText = (text, query) => {
      if (!query) return text;
      const escapedQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const reg = new RegExp(`(${escapedQuery})`, 'gi');
      return text.replace(reg, '<span class="highlight-match">$1</span>');
    };

    const renderSuggestions = (filtered) => {
      searchSuggestions.innerHTML = '';
      if (filtered.length === 0) {
        searchSuggestions.innerHTML = `<div class="suggestion-no-results">No destinations found matching "${searchInput.value}"</div>`;
        return;
      }

      searchSuggestions.innerHTML = `<div class="search-suggestions-header">Matching Destinations</div>`;
      filtered.forEach((item, index) => {
        const div = document.createElement('a');
        div.href = item.link;
        div.className = 'suggestion-item';
        div.innerHTML = `
          <img src="${item.image}" alt="${item.title}" class="suggestion-thumb">
          <div class="suggestion-info">
            <span class="suggestion-title">${highlightText(item.title, searchInput.value)}</span>
            <span class="suggestion-subtitle">${highlightText(item.subtitle, searchInput.value)}</span>
          </div>
        `;
        div.addEventListener('click', (e) => {
          e.preventDefault();
          selectSuggestion(item);
        });
        searchSuggestions.appendChild(div);
      });
    };

    const showTrending = () => {
      searchSuggestions.innerHTML = `
        <div class="search-suggestions-header">Trending Escapes</div>
        <a href="spiti-valley.html" class="suggestion-item" data-trending="spiti">
          <img src="assets/spiti_valley.png" alt="Spiti Valley" class="suggestion-thumb">
          <div class="suggestion-info">
            <span class="suggestion-title">Spiti Valley Complete Circuit</span>
            <span class="suggestion-subtitle">High altitude Himalayan retreat</span>
          </div>
        </a>
        <a href="kashmir-valley.html" class="suggestion-item" data-trending="kashmir">
          <img src="assets/kashmir_valley.png" alt="Kashmir Valley" class="suggestion-thumb">
          <div class="suggestion-info">
            <span class="suggestion-title">Kashmir Valley Paradise</span>
            <span class="suggestion-subtitle">Premium houseboat & Shikara stays</span>
          </div>
        </a>
        <a href="vietnam-discovery.html" class="suggestion-item" data-trending="vietnam">
          <img src="assets/vietnam.png" alt="Vietnam" class="suggestion-thumb">
          <div class="suggestion-info">
            <span class="suggestion-title">Vietnam Tropical Discovery</span>
            <span class="suggestion-subtitle">Ha Long Bay luxury cruise</span>
          </div>
        </a>
        <div class="search-suggestions-header">Explore by Vibe</div>
        <div class="trending-tags">
          <button class="trending-tag" data-tag="adventure">Adventure 🏔️</button>
          <button class="trending-tag" data-tag="relax">Relaxation 🌊</button>
          <button class="trending-tag" data-tag="culture">Cultural 🏛️</button>
          <button class="trending-tag" data-tag="wellness">Wellness 🌿</button>
        </div>
      `;

      // Bind trending items
      searchSuggestions.querySelectorAll('.suggestion-item').forEach(el => {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          const title = el.querySelector('.suggestion-title').textContent;
          searchInput.value = title;
          searchSuggestions.classList.remove('show');
          showToast(`Redirecting to ${title}...`, 'info');
          setTimeout(() => {
            window.location.href = el.getAttribute('href');
          }, 500);
        });
      });

      // Bind tag clicks
      searchSuggestions.querySelectorAll('.trending-tag').forEach(tagEl => {
        tagEl.addEventListener('click', (e) => {
          e.preventDefault();
          const vibe = tagEl.getAttribute('data-tag');
          searchInput.value = tagEl.textContent.trim();
          filterByVibe(vibe);
        });
      });

      searchSuggestions.classList.add('show');
    };

    const filterByVibe = (vibe) => {
      const filtered = destinations.filter(item => 
        item.tags.includes(vibe)
      );
      renderSuggestions(filtered);
      searchSuggestions.classList.add('show');
      activeIndex = -1;
    };

    const selectSuggestion = (item) => {
      searchInput.value = item.title;
      searchSuggestions.classList.remove('show');
      searchClearBtn.style.display = 'flex';
      showToast(`Redirecting to ${item.title}...`, 'info');
      setTimeout(() => {
        window.location.href = item.link;
      }, 500);
    };

    const filterDestinations = (query) => {
      const q = query.toLowerCase().trim();
      if (!q) {
        showTrending();
        searchClearBtn.style.display = 'none';
        return;
      }
      searchClearBtn.style.display = 'flex';

      const filtered = destinations.filter(item => 
        item.title.toLowerCase().includes(q) || 
        item.subtitle.toLowerCase().includes(q) ||
        item.tags.some(tag => tag.includes(q))
      );

      renderSuggestions(filtered);
      searchSuggestions.classList.add('show');
      activeIndex = -1;
    };

    searchInput.addEventListener('input', (e) => {
      filterDestinations(e.target.value);
    });

    searchInput.addEventListener('focus', () => {
      filterDestinations(searchInput.value);
    });

    // Close suggestions dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (heroSearchForm && !heroSearchForm.contains(e.target)) {
        searchSuggestions.classList.remove('show');
      }
    });

    // Clear search button
    searchClearBtn.addEventListener('click', () => {
      searchInput.value = '';
      showTrending();
      searchClearBtn.style.display = 'none';
      searchInput.focus();
    });

    // Keyboard navigation inside search widget
    searchInput.addEventListener('keydown', (e) => {
      const items = searchSuggestions.querySelectorAll('.suggestion-item');
      if (!searchSuggestions.classList.contains('show') || items.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = (activeIndex + 1) % items.length;
        updateActiveItem(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = (activeIndex - 1 + items.length) % items.length;
        updateActiveItem(items);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < items.length) {
          items[activeIndex].click();
        } else {
          // Default to first match if no active selection
          items[0].click();
        }
      } else if (e.key === 'Escape') {
        searchSuggestions.classList.remove('show');
      }
    });

    const updateActiveItem = (items) => {
      items.forEach((item, index) => {
        if (index === activeIndex) {
          item.classList.add('active');
          item.scrollIntoView({ block: 'nearest' });
        } else {
          item.classList.remove('active');
        }
      });
    };

    // Form submit / Search button click
    if (searchSubmitBtn) {
      searchSubmitBtn.addEventListener('click', () => {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) {
          showToast('Please type a destination to search.', 'error');
          return;
        }

        // Try to match exact or partial title
        const matched = destinations.find(item => 
          item.title.toLowerCase().includes(query) || 
          item.tags.some(tag => tag === query)
        );

        if (matched) {
          selectSuggestion(matched);
        } else {
          // Redirect to destinations directory general page
          showToast(`No exact match for "${searchInput.value}". Redirecting to all escapes...`, 'info');
          setTimeout(() => {
            window.location.href = 'destinations.html';
          }, 800);
        }
      });
    }
  }

  // Booking inquiry form
  const bookingForm = document.getElementById('bookingInquiryForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit Inquiry';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Submitting... <i class="fa-solid fa-spinner fa-spin"></i>';
      }

      try {
        const name = document.getElementById('contactName').value;
        const email = document.getElementById('contactEmail').value;
        const destSelect = document.getElementById('contactDestination');
        const destination = destSelect.options[destSelect.selectedIndex].text;
        const durationSelect = document.getElementById('contactDuration');
        const duration = durationSelect.options[durationSelect.selectedIndex].text;
        const message = document.getElementById('contactMessage').value;

        const payload = {
          name,
          email,
          destination,
          duration,
          message,
          formType: 'inquiry'
        };

        const response = await fetch(`${API_BASE_URL}/inquiries`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
          showToast(`Thank you, ${name}! Our specialized curator for ${destination} will review your parameters and email you within 24 hours.`, 'success');
          bookingForm.reset();
        } else {
          showToast(data.error || 'Failed to submit inquiry.', 'error');
        }
      } catch (error) {
        console.error('Error submitting inquiry:', error);
        showToast('Connection to backend failed. Please try again.', 'error');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    });
  }

  // Newsletter form
  const newsForm = document.getElementById('newsletterForm');
  if (newsForm) {
    newsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = newsForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Subscribe';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
      }

      try {
        const email = document.getElementById('newsletterEmail').value;

        const response = await fetch(`${API_BASE_URL}/newsletter`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
          showToast(`Successfully subscribed ${email} to the Joylo Bespoke Travel Dispatch. Welcome!`, 'success');
          newsForm.reset();
        } else if (response.status === 409) {
          showToast(data.message || 'Already subscribed!', 'info');
        } else {
          showToast(data.error || 'Failed to subscribe.', 'error');
        }
      } catch (error) {
        console.error('Error subscribing:', error);
        showToast('Connection to backend failed. Please try again.', 'error');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    });
  }

  // Request a Quote form (service pages)
  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = quoteForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send Request';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
      }

      try {
        const name = (document.getElementById('qName') || {}).value || 'there';
        const email = (document.getElementById('qEmail') || {}).value || '';
        const serviceSelect = document.getElementById('qService');
        const service = serviceSelect ? serviceSelect.value : 'your trip';
        const message = (document.getElementById('qDetails') || {}).value || '';

        const payload = {
          name,
          email,
          service,
          message,
          formType: 'quote'
        };

        const response = await fetch(`${API_BASE_URL}/inquiries`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
          showToast(`Thank you, ${name}! Our curator for ${service} will reach out within 24 hours.`, 'success');
          quoteForm.reset();
        } else {
          showToast(data.error || 'Failed to submit quote request.', 'error');
        }
      } catch (error) {
        console.error('Error submitting quote:', error);
        showToast('Connection to backend failed. Please try again.', 'error');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    });
  }

  // Centralized Trip Booking Form (destination pages)
  const tripBookingForm = document.getElementById('tripBookingForm');
  if (tripBookingForm) {
    tripBookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = tripBookingForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit Inquiry Now';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Submitting... <i class="fa-solid fa-spinner fa-spin"></i>';
      }

      try {
        const tripName = tripBookingForm.querySelector('input[name="tripName"]')?.value || 'Unknown Trip';
        const fullName = tripBookingForm.querySelector('input[placeholder="Your name"]')?.value || '';
        const phone = tripBookingForm.querySelector('input[placeholder="WhatsApp / Phone"]')?.value || '';
        const email = tripBookingForm.querySelector('input[placeholder="you@email.com"]')?.value || '';
        const sharingPreference = tripBookingForm.querySelector('select')?.value || '';
        const travelDate = tripBookingForm.querySelector('input[type="date"]')?.value || '';

        const payload = { tripName, fullName, phone, email, sharingPreference, travelDate };

        const response = await fetch(`${API_BASE_URL}/bookings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
          showToast(`Thank you, ${fullName}! Your inquiry for ${tripName} has been submitted successfully to MongoDB.`, 'success');
          tripBookingForm.reset();
        } else {
          showToast(data.error || 'Failed to submit booking inquiry.', 'error');
        }
      } catch (error) {
        console.error('Error submitting booking:', error);
        showToast('Connection to backend failed. Please try again.', 'error');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    });
  }

  /* ----------------------------------------------------
     5. Testimonials Slider Carousel
     ---------------------------------------------------- */
  const track = document.getElementById('testimonialsTrack');
  const slides = Array.from(track ? track.children : []);
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dots = Array.from(document.querySelectorAll('#sliderDots .dot'));
  
  if (track && slides.length > 0) {
    let currentIndex = 0;
    let autoSlideInterval;

    const updateSlider = (index) => {
      currentIndex = index;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      
      // Update dots
      dots.forEach((dot, idx) => {
        if (idx === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    };

    const nextSlide = () => {
      let index = currentIndex + 1;
      if (index >= slides.length) index = 0;
      updateSlider(index);
    };

    const prevSlide = () => {
      let index = currentIndex - 1;
      if (index < 0) index = slides.length - 1;
      updateSlider(index);
    };

    // Button clicks
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoSlide();
    });

    // Dot clicks
    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        const targetIndex = parseInt(e.target.getAttribute('data-index'));
        updateSlider(targetIndex);
        resetAutoSlide();
      });
    });

    // Auto sliding
    const startAutoSlide = () => {
      autoSlideInterval = setInterval(nextSlide, 6000);
    };

    const resetAutoSlide = () => {
      clearInterval(autoSlideInterval);
      startAutoSlide();
    };

    startAutoSlide();
  }

  /* ----------------------------------------------------
     6. Scroll Reveal Animations (Intersection Observer)
     ---------------------------------------------------- */
  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Reveal once
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if browser doesn't support observer
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  /* ----------------------------------------------------
      8. Region Filter (destinations listing page)
      ---------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const listingCards = document.querySelectorAll('#listingGrid .dest-card');

  if (filterBtns.length > 0 && listingCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const region = btn.getAttribute('data-region');
        listingCards.forEach(card => {
          const cardRegion = card.getAttribute('data-region');
          if (region === 'all' || cardRegion === region) {
            card.classList.remove('hide');
          } else {
            card.classList.add('hide');
          }
        });
      });
    });
  }

});
