/* ==========================================================================
   JOYLO TRAVEL WELL - INTERACTIVITY CORE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

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
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = '<i class="fa-solid fa-circle-check"></i>';
    if (type === 'error') {
      icon = '<i class="fa-solid fa-circle-exclamation"></i>';
    } else if (type === 'info') {
      icon = '<i class="fa-solid fa-circle-info"></i>';
    }
    
    toast.innerHTML = `${icon} <span>${message}</span>`;
    toastContainer.appendChild(toast);
    
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
  // Hero search form
  const heroSearchForm = document.getElementById('heroSearchForm');
  if (heroSearchForm) {
    heroSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const destSelect = document.getElementById('searchDest');
      const destName = destSelect.options[destSelect.selectedIndex].text;
      const dateVal = document.getElementById('searchDate').value;
      const guestsSelect = document.getElementById('searchGuests');
      const guestsVal = guestsSelect.options[guestsSelect.selectedIndex].text;
      
      showToast(`Searching curated retreats in ${destName} for ${guestsVal} starting ${dateVal}...`, 'info');
      
      // Auto scroll to planner
      setTimeout(() => {
        const plannerSection = document.getElementById('planner');
        if (plannerSection) {
          // Set selection in planner
          const planDest = document.getElementById('planDestination');
          if (planDest) {
            planDest.value = destSelect.value;
          }
          plannerSection.scrollIntoView({ behavior: 'smooth' });
          // Auto generate
          document.getElementById('generateItinerary').click();
        }
      }, 1000);
    });
  }

  // Booking inquiry form
  const bookingForm = document.getElementById('bookingInquiryForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName').value;
      const destSelect = document.getElementById('contactDestination');
      const destName = destSelect.options[destSelect.selectedIndex].text;
      
      showToast(`Thank you, ${name}! Our specialized curator for ${destName} will review your parameters and email you within 24 hours.`, 'success');
      bookingForm.reset();
    });
  }

  // Newsletter form
  const newsForm = document.getElementById('newsletterForm');
  if (newsForm) {
    newsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('newsletterEmail').value;
      showToast(`Successfully subscribed ${email} to the Joylo Bespoke Travel Dispatch. Welcome!`, 'success');
      newsForm.reset();
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
     7. Dynamic Travel Itinerary Planner Logic
     ---------------------------------------------------- */
  const vibeBtns = document.querySelectorAll('.vibe-btn');
  let selectedVibe = 'adventure';

  // Vibe selections
  vibeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      vibeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedVibe = btn.getAttribute('data-vibe');
    });
  });

  const plannerData = {
    kyoto: {
      name: "Kyoto sanctuary",
      hotel: "Sujin Sekisuitei Ryokan",
      costPerDay: 600,
      vibes: {
        adventure: [
          { title: "Bamboo Grove Cycling", desc: "Embark on an early morning private guided cycling journey through Arashiyama bamboo forest to beat the crowd." },
          { title: "Hozugawa River Rafting", desc: "Experience a dramatic 2-hour traditional flat-bottom boat trip running the wild rapids of the Hozugawa River gorge." },
          { title: "Mount Atago Sacred Hike", desc: "Climb the highest peak in Kyoto, traversing ancient forest paths to reach the fire-god shrine at the summit." }
        ],
        relax: [
          { title: "Private Karesansui Viewing", desc: "Sit in silence at a temple stone garden, listening to the history and philosophy of zen meditation from a local monk." },
          { title: "Forest Onsen Soak", desc: "Rejuvenate in mineral-rich hot springs nestled inside cedar woods, enjoying traditional multi-course Kaiseki cuisine." },
          { title: "Kamogawa River Stroll", desc: "Take a relaxed sunset stroll alongside local musicians, finishing with private dining on wooden over-river platforms (Yuka)." }
        ],
        culture: [
          { title: "Sacred Matcha Tea Ceremony", desc: "Partake in a quiet, authentic matcha preparation masterclass inside an exclusive 400-year-old tea estate villa." },
          { title: "Gion Geisha Historic Walking", desc: "Stroll lantern-lit streets with a historic preservation specialist, learning about tea house traditions and geisha culture." },
          { title: "Gold Pagoda and Shrine Exploration", desc: "Enjoy private VIP entry to Kinkaku-ji (Golden Pavilion) and Fushimi Inari to view the iconic thousands of vermilion torii gates." }
        ],
        wellness: [
          { title: "Shinrin-Yoku Forest Bathing", desc: "Immerse your senses in quiet cedar groves guided by a certified biological health practitioner to lower stress." },
          { title: "Buddhist Shojin Ryori Dinner", desc: "Dine on award-winning traditional vegan cuisine prepared strictly by Buddhist monks using seasonal mountain plants." },
          { title: "Meditative Zen Calligraphy", desc: "Express mindfulness through the ancient art of Japanese ink brush calligraphy under the guidance of a Master Shodo artist." }
        ]
      }
    },
    santorini: {
      name: "Santorini Odyssey",
      hotel: "Grace Hotel (Auberge Resorts)",
      costPerDay: 850,
      vibes: {
        adventure: [
          { title: "Caldera Rim Hike", desc: "Hike the dramatic volcanic rim trail from Fira to Oia, witnessing vertical drops and panoramic sea vistas." },
          { title: "Red Beach Cave Scuba", desc: "Dive into underwater volcanic arches, lava caves, and clear marine structures off the red sand coastlines." },
          { title: "Volcano & Hot Springs Climb", desc: "Sail to the active volcanic islet of Nea Kameni and trek to the smoking crater, before swimming in iron-warm sulfur springs." }
        ],
        relax: [
          { title: "Private Infinity Pool Gazing", desc: "Enjoy a lazy morning floating in your private cliffside infinity pool, looking down at the deep blue Aegean sea." },
          { title: "Caldera Sunset Yacht Charter", desc: "Board a private catamaran for a sunset cruise, complete with snorkeling, swimming, and an onboard freshly cooked seafood grill." },
          { title: "Caldera Wine Cave Tasting", desc: "Taste local Assyrtiko grapes in ancient volcanic cellars built 15 feet underground, paired with Greek artisan cheeses." }
        ],
        culture: [
          { title: "Akrotiri Archaeological Tour", desc: "Explore the exceptionally preserved Minoan Bronze Age city buried under volcanic ash, guided by a lead historian." },
          { title: "Traditional Greek Kitchen Class", desc: "Cook authentic dishes like tomato keftedes and moussaka inside a quiet rural farmhouse kitchen, tasting estate wines." },
          { title: "Oia Cliffside Sunset Painting", desc: "Create a watercolor painting of the blue domes at sunset during an intimate workshop with a local resident painter." }
        ],
        wellness: [
          { title: "Sunrise Caldera Yoga", desc: "Stretch in soft wind on a private luxury deck facing the rising sun over the Aegean archipelago." },
          { title: "Volcanic Mud Healing Spa", desc: "Indulge in a signature volcanic body wrap and mineral bath utilizing pure local Santorini volcanic clay." },
          { title: "Sunset Sound Therapy", desc: "Rebalance mental clarity during a crystal bowl sound meditation session overlooking the sea cliffs." }
        ]
      }
    },
    amalfi: {
      name: "Amalfi Coastline",
      hotel: "Il San Pietro di Positano",
      costPerDay: 900,
      vibes: {
        adventure: [
          { title: "Path of the Gods Trek", desc: "Walk high above coastal villages on the Sentiero degli Dei, taking in spectacular sea views extending to Capri." },
          { title: "Capri Sea Caves Speedboat", desc: "Dash across waves on an Italian speedboat to circle the Faraglioni rocks, exploring hidden green and white grottos." },
          { title: "Furore Fjord Cliff Kayaking", desc: "Kayak into a dramatic vertical gorge where traditional fishing houses cluster under high highway arch bridges." }
        ],
        relax: [
          { title: "Private Amalfi Cove Beach Cabana", desc: "Lounge in ultimate privacy under lemon trees on customized wooden decks directly touching the Mediterranean water." },
          { title: "Vintage Alfa Romeo Coastal Cruise", desc: "Drive along coastal roads in a cherry-red classic roadster, stopping at small seaside lookout cafes." },
          { title: "Cliffside Lemon Grove Dinner", desc: "Dine on freshly tossed lemon pasta directly under hanging lemon pergolas at a family farm closed to public." }
        ],
        culture: [
          { title: "Pompeii Ruins Private Tour", desc: "Skip lines for a private stroll through preserved homes, villas, and thermal baths of ancient Pompeii with a classical archaeologist." },
          { title: "Historic Amalfi Paper Workshop", desc: "Learn the 12th-century art of manufacturing thick cotton Amalfi paper by hand at a medieval mill museum." },
          { title: "Michelin-Star Limoncello Infusion", desc: "Sample high-end variations and learn standard recipes of standard digestifs directly from local chefs." }
        ],
        wellness: [
          { title: "Mediterranean Herbal Spa", desc: "Rejuvenate with custom olive oil and rosemary body wraps inside wellness suites carved into limestone cliffs." },
          { title: "Cliffside Sunrise Meditation", desc: "Listen to waves breaking below as a local mindfulness guide leads breathing exercises on Positano terraces." },
          { title: "Organic Slow-Food Cooking", desc: "Learn natural recipes using handpicked vegetables, fresh basil, and extra virgin olive oil from coastal gardens." }
        ]
      }
    },
    alps: {
      name: "Swiss Alps retreat",
      hotel: "The Chedi Andermatt",
      costPerDay: 950,
      vibes: {
        adventure: [
          { title: "Matterhorn Glacier Ski Run", desc: "Carve turns on high-altitude powder slopes, skiing from Switzerland directly across the border to Italy for lunch." },
          { title: "Glacier Paragliding Tandem Flight", desc: "Leap off snowy cliffs for a bird's-eye drift past the Matterhorn, landing safely in pine forests below." },
          { title: "Ice Cave Crevasse Climbing", desc: "Ascend ancient vertical blue ice walls under the strict harness-safeguards of a certified alpine mountain guide." }
        ],
        relax: [
          { title: "Leukerbad Thermal Baths", desc: "Soak in hot volcanic spring waters surrounded by towering vertical snow walls under crisp blue alpine skies." },
          { title: "Glacier Express Private Coupe", desc: "Glide through gorges and across high stone bridges while drinking champagne inside a glass-ceiling carriage." },
          { title: "Alpine Chalet Fireplace Fondue", desc: "Cozy up next to crackling hearth fires inside a century-old chalet, enjoying local melted gruyère and wines." }
        ],
        culture: [
          { title: "Alpine Cheese Dairy Cooking", desc: "Watch traditional copper-cauldron cheese-making in high pastures, sampling fresh wheel curds." },
          { title: "Zermatt Car-Free Village History", desc: "Walk historic wooden barns standing on stilts, learning about early mountaineering expeditions." },
          { title: "Traditional Alpine Yodeling Dinner", desc: "Enjoy a hearty mountain feast accompanied by acoustic folk music and traditional alphorn demonstrations." }
        ],
        wellness: [
          { title: "High-Altitude Cedar Sauna", desc: "Enjoy extreme dry-heat saunas, following up with a traditional cool-plunge in fresh glacier stream pools." },
          { title: "Swiss Pine Leaf Oil Massage", desc: "Melt muscle tension away with warm organic massages utilizing forest pine extract and essential oils." },
          { title: "Glacier Water Hydrotherapy", desc: "Engage in refreshing Kneipp water-therapy circuits designed to boost circulation and metabolic recovery." }
        ]
      }
    }
  };

  const generateBtn = document.getElementById('generateItinerary');
  const plannerOutput = document.getElementById('plannerOutput');
  const itineraryContent = document.getElementById('itineraryContent');

  if (generateBtn && plannerOutput && itineraryContent) {
    generateBtn.addEventListener('click', () => {
      // 1. Show loading state in output area
      plannerOutput.innerHTML = `
        <div class="output-placeholder">
          <i class="fa-solid fa-sparkles animate-spin" style="color: var(--color-primary-light); font-size: 3.5rem;"></i>
          <h4 style="margin-top: 24px;">Curating Your Experience...</h4>
          <p>Analyzing parameters, contacting resort hosts, and structuring your bespoke day-by-day luxury itinerary...</p>
        </div>
      `;
      
      const region = document.getElementById('planDestination').value;
      const duration = parseInt(document.getElementById('planDuration').value);
      const luxTier = document.querySelector('input[name="luxTier"]:checked').value;
      
      // Simulate API load
      setTimeout(() => {
        const destInfo = plannerData[region];
        const vibeInfo = destInfo.vibes[selectedVibe];
        
        // Calculate dynamic cost estimate
        let baseCost = destInfo.costPerDay * duration;
        if (luxTier === 'ultra') {
          baseCost = baseCost * 1.8;
        }
        // Round to nearest hundred
        const finalCost = Math.round(baseCost / 100) * 100;
        
        // Restore standard output template container
        plannerOutput.innerHTML = '';
        plannerOutput.appendChild(itineraryContent);
        itineraryContent.classList.remove('hidden');
        
        // Update Itinerary content
        const badgeEl = document.getElementById('itineraryBadge');
        badgeEl.textContent = selectedVibe.toUpperCase();
        
        // Vibe badge colors
        if (selectedVibe === 'adventure') badgeEl.style.backgroundColor = '#d35400';
        else if (selectedVibe === 'relax') badgeEl.style.backgroundColor = '#135f75';
        else if (selectedVibe === 'culture') badgeEl.style.backgroundColor = '#8e44ad';
        else if (selectedVibe === 'wellness') badgeEl.style.backgroundColor = '#27ae60';
        
        document.getElementById('itineraryTitle').textContent = `${duration}-Day Bespoke ${destInfo.name.charAt(0).toUpperCase() + destInfo.name.slice(1)}`;
        document.getElementById('itineraryHotel').innerHTML = `<i class="fa-solid fa-hotel"></i> ${destInfo.hotel}`;
        
        if (luxTier === 'ultra') {
          document.getElementById('itineraryPax').innerHTML = `<i class="fa-solid fa-user-shield"></i> Dedicated 24/7 Private Host Assigned`;
        } else {
          document.getElementById('itineraryPax').innerHTML = `<i class="fa-solid fa-bell-concierge"></i> Standard Concierge Included`;
        }
        
        document.getElementById('itineraryCost').textContent = `$${finalCost.toLocaleString()}`;
        
        // Build timeline HTML based on duration
        const timelineEl = document.getElementById('itineraryTimeline');
        timelineEl.innerHTML = '';
        
        // Generate daily cards
        if (duration === 3) {
          // Show 3 distinct vibes
          vibeInfo.forEach((item, index) => {
            timelineEl.appendChild(createTimelineItem(index + 1, item.title, item.desc));
          });
        } else if (duration === 7) {
          // Distribute items across 7 days
          timelineEl.appendChild(createTimelineItem(1, "Arrival & Welcome Dinner", `Arrive in style. Private luxury transfer directly to ${destInfo.hotel}. Evening VIP orientation wine pairing.`));
          timelineEl.appendChild(createTimelineItem(3, vibeInfo[0].title, vibeInfo[0].desc));
          timelineEl.appendChild(createTimelineItem(5, vibeInfo[1].title, vibeInfo[1].desc));
          timelineEl.appendChild(createTimelineItem(7, `${vibeInfo[2].title} & Farewell`, `${vibeInfo[2].desc} Afternoon private towncar transfer to airport.`));
        } else {
          // 14 days
          timelineEl.appendChild(createTimelineItem(1, "VIP Fast-Track Check-In", `Custom customs bypass. Airport greeting. Unpack at ${destInfo.hotel} penthouse. Private yacht/resort welcoming ceremony.`));
          timelineEl.appendChild(createTimelineItem(4, vibeInfo[0].title, vibeInfo[0].desc));
          timelineEl.appendChild(createTimelineItem(8, vibeInfo[1].title, vibeInfo[1].desc));
          timelineEl.appendChild(createTimelineItem(12, vibeInfo[2].title, vibeInfo[2].desc));
          timelineEl.appendChild(createTimelineItem(14, "Grand Farewell Breakfast", "Helicopter transfers to regional airport terminals. Final local artisan gift packages distributed. Depart home."));
        }
        
        showToast('Itinerary Curated Successfully!', 'success');
        
        // Trigger scroll update inside itinerary output for focus if needed
        const bookItineraryBtn = document.getElementById('bookItineraryBtn');
        if (bookItineraryBtn) {
          bookItineraryBtn.addEventListener('click', () => {
            const contactDest = document.getElementById('contactDestination');
            const contactMsg = document.getElementById('contactMessage');
            if (contactDest) contactDest.value = region;
            if (contactMsg) {
              contactMsg.value = `I would like to make a booking inquiry for the ${duration}-Day Bespoke ${destInfo.name.charAt(0).toUpperCase() + destInfo.name.slice(1)} (${selectedVibe} theme, ${luxTier === 'ultra' ? 'Ultra Luxe' : 'Premium Boutique'} tier, estimated $${finalCost.toLocaleString()}).`;
            }
          });
        }
      }, 1200);
    });
    
    function createTimelineItem(dayNum, title, desc) {
      const item = document.createElement('div');
      item.className = 'timeline-item';
      item.innerHTML = `
        <div class="timeline-day">Day <span>0${dayNum}</span></div>
        <div class="timeline-content">
          <h5>${title}</h5>
          <p>${desc}</p>
        </div>
      `;
      return item;
    }
  }

});
