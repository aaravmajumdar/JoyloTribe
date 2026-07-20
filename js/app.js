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

  // Request a Quote form (service pages)
  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (document.getElementById('qName') || {}).value || 'there';
      const service = (document.getElementById('qService') || {}).value || 'your trip';
      showToast(`Thank you, ${name}! Our curator for ${service} will reach out within 24 hours.`, 'success');
      quoteForm.reset();
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
    },
    vietnam: {
      name: "Vietnam Coastal Discovery",
      hotel: "Paradise Elegance Luxury Cruise",
      costPerDay: 520,
      vibes: {
        adventure: [
          { title: "Ha Long Bay Kayaking", desc: "Paddle through hidden emerald lagoons and beneath towering limestone karsts on a private guided sea kayak expedition." },
          { title: "Cat Ba Island Jungle Trek", desc: "Hike dense national park rainforest trails to panoramic viewpoints over the bay's scattered islets." },
          { title: "Sung Sot Cave Exploration", desc: "Climb to the spectacular 'Surprise Cave' chambers filled with dramatic stalactite formations away from the crowds." }
        ],
        relax: [
          { title: "Private Deck Sunset Cruise", desc: "Unwind on the top deck of your luxury junk with a sundowner as limestone peaks glow at golden hour." },
          { title: "Tai Chi at Dawn", desc: "Greet the misty morning with a gentle tai chi session on the sundeck led by your onboard wellness host." },
          { title: "Spa & Bayfront Pool Lounge", desc: "Soak in the cruise spa and infinity-edge pool while drifting past surreal karst scenery." }
        ],
        culture: [
          { title: "Hanoi Old Quarter Walking", desc: "Wander lantern-lit streets with a local historian, sampling pho and exploring hidden temples and clan houses." },
          { title: "Water Puppet & Temple Tour", desc: "Enjoy a traditional Thang Long water puppet show followed by a visit to the ancient Temple of Literature." },
          { title: "Floating Village Homestay", desc: "Meet local fishing families in a UNESCO bay floating village and learn their daily routines first-hand." }
        ],
        wellness: [
          { title: "Vietnamese Herbal Bath", desc: "Rebalance with a warm therapeutic herbal soak using mountain ginger and locally sourced botanicals." },
          { title: "Bayfront Meditation", desc: "Practice mindful breathing on a quiet private beach as the morning mist lifts over the water." },
          { title: "Organic Vietnamese Cooking", desc: "Harvest fresh herbs and learn to craft spring rolls and fusion dishes with an onboard private chef." }
        ]
      }
    },
    himachal: {
      name: "Himalayan Himachal retreat",
      hotel: "The Oberoi Cecil, Shimla",
      costPerDay: 420,
      vibes: {
        adventure: [
          { title: "Rohtang Pass Private Drive", desc: "Cruise hairpin Himalayan roads in a chauffeured luxury SUV to snow-bound passes with panoramic glacier views." },
          { title: "Solang Valley Paragliding", desc: "Soar above cedar forests and alpine meadows on a tandem glide with a certified mountain pilot." },
          { title: "Beas River White-Water Rafting", desc: "Navigate grade-III rapids through pine gorges with expert safety guides and riverside picnics." }
        ],
        relax: [
          { title: "Glass Cabin Valley View", desc: "Unwind in a floor-to-ceiling glass retreat above the clouds with private bonfire and stargazing." },
          { title: "Himalayan Spa Soak", desc: "Ease altitude chill with warm stone massages and cedar-oil therapies at a hillside wellness sanctuary." },
          { title: "Toy Train to Shimla", desc: "Ride the UNESCO heritage mountain railway in a private first-class carriage through tunnels and orchards." }
        ],
        culture: [
          { title: "Tibetan Monastery Visit", desc: "Tour the hilltop monasteries of Dharamshala with a monk guide, learning thangka art and prayer rituals." },
          { title: "Colonial Shimla Walk", desc: "Stroll the Viceregal Lodge and Mall Road with a heritage historian recounting Raj-era tales." },
          { title: "Himachali Farm Feast", desc: "Dine on slow-cooked siddu and river trout at a family orchard closed to the public." }
        ],
        wellness: [
          { title: "Altitude Yoga Terrace", desc: "Breathe crisp mountain air through gentle asana led by a certified Himalayan instructor." },
          { title: "Forest Bathing in Pine Groves", desc: "Immerse senses in silent deodar forests guided by a local naturalist for deep restoration." },
          { title: "Herbal Tisane Ritual", desc: "Learn to brew indigenous mountain herbs into healing teas with a village elder." }
        ]
      }
    },
    kerala: {
      name: "Kerala Backwaters escape",
      hotel: "Spice Village, Thekkady",
      costPerDay: 380,
      vibes: {
        adventure: [
          { title: "Periyar Jungle Boat Safari", desc: "Glide across the lake spotting wild elephants and birds with a private naturalist guide." },
          { title: "Munnar Tea-Trek", desc: "Hike emerald plantation hills at dawn, plucking leaves alongside estate workers." },
          { title: "Backwater Kayak Explorer", desc: "Paddle narrow village canals past coir weavers and rice paddies in a private sea kayak." }
        ],
        relax: [
          { title: "Private Houseboat Cruise", desc: "Drift the Vembanad backwaters aboard a crewed luxury houseboat with sunset dining on deck." },
          { title: "Ayurvedic Rejuvenation", desc: "Reset with a personalized Panchakarma program at a lakeside wellness retreat." },
          { title: "Coconut Grove Hammock Day", desc: "Lounge under palms with fresh tender coconut and a private butler on a quiet beach." }
        ],
        culture: [
          { title: "Kathakali Performance Night", desc: "Witness the elaborate classical dance-drama up close with a backstage artist introduction." },
          { title: "Spice Plantation Tour", desc: "Walk cardamom and pepper trails with a planter, ending in a farm-to-table lunch." },
          { title: "Fort Kochi Heritage Walk", desc: "Explore Chinese fishing nets and colonial lanes with a local historian and art curator." }
        ],
        wellness: [
          { title: "Yoga by the Lake", desc: "Practice sunrise flow on a floating platform as mist lifts over the water." },
          { title: "Ayurvedic Cooking Class", desc: "Learn healing vegetarian recipes using local spices with a retreat chef." },
          { title: "Meditative Village Canal Row", desc: "Glide silently in a country boat through lily-filled canals for mindful stillness." }
        ]
      }
    },
    rajasthan: {
      name: "Royal Rajasthan journey",
      hotel: "Taj Lake Palace, Udaipur",
      costPerDay: 560,
      vibes: {
        adventure: [
          { title: "Thar Desert Camel Safari", desc: "Ride private dromedaries to a sunset dune camp with folk music and starlit dinner." },
          { title: "Mehrangarh Fort Rappel", desc: "Descend the ramparts of Jodhpur's blue city fortress on a guided vertical adventure." },
          { title: "Lake Pichola Speedboat", desc: "Cruise the royal lake past the Lake Palace in a private speedboat at golden hour." }
        ],
        relax: [
          { title: "Palace Suite Indulgence", desc: "Reside in a restored maharaja suite with private courtyard, jacuzzi, and butler service." },
          { title: "Rooftop Pool & Lounge", desc: "Float above the pink city with a cooling lassi and live traditional instrumentation." },
          { title: "Royal Spa Ritual", desc: "Rejuvenate with ubtan wraps and rose-oil massage in a heritage spa chamber." }
        ],
        culture: [
          { title: "City Palace Private Tour", desc: "Explore Udaipur's royal apartments with a historian, including closed museum wings." },
          { title: "Block-Print & Bazaar Walk", desc: "Shop kaleidoscopic textiles with an artisan guide through Jaipur's old city." },
          { title: "Royal Thali Feast", desc: "Dine on a 30-dish silver-platter thali inside a former prince's dining hall." }
        ],
        wellness: [
          { title: "Sunrise Lakeside Meditation", desc: "Center the mind on a ghat terrace as birds and boats stir on the water." },
          { title: "Yoga in the Courtyard", desc: "Flow through asana in a marble palace courtyard scented with jasmine." },
          { title: "Heritage Hammam Ritual", desc: "Purify with a traditional royal bath using marble heat and herbal steam." }
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
        
        // Calculate dynamic cost estimate (stored internally in USD, displayed in INR)
        const USD_TO_INR = 83;
        let baseCostUSD = destInfo.costPerDay * duration;
        if (luxTier === 'ultra') {
          baseCostUSD = baseCostUSD * 1.8;
        }
        const finalCostINR = Math.round((baseCostUSD * USD_TO_INR) / 100) * 100;
        const inr = `₹${finalCostINR.toLocaleString('en-IN')}`;
        
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
        
        document.getElementById('itineraryCost').textContent = inr;
        
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
              contactMsg.value = `I would like to make a booking inquiry for the ${duration}-Day Bespoke ${destInfo.name.charAt(0).toUpperCase() + destInfo.name.slice(1)} (${selectedVibe} theme, ${luxTier === 'ultra' ? 'Ultra Luxe' : 'Premium Boutique'} tier, estimated ${inr}).`;
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
