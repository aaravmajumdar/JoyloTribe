lines = open('js/app.js', encoding='utf-8').read().split('\n')
start = next(i for i,l in enumerate(lines) if l.strip()=='const plannerData = {')
end = None
for i in range(start+1, len(lines)):
    if lines[i].rstrip()=='}':
        end=i
        break
print('start',start,'end',end)

new_block = '''  const plannerData = {
    essentials: { label: "Hanoi Essentials", stay: "Shared 2-bedroom apartment" },
    comfort: { label: "Hanoi Comfort", stay: "Private room, shared lounge" },
    premium: { label: "Hanoi Premium", stay: "Private hotel suite near venue" },
    accom: { label: "Accommodation Only", stay: "Your chosen room type" }
  };

  const generateBtn = document.getElementById('generateItinerary');
  const plannerOutput = document.getElementById('plannerOutput');
  const itineraryContent = document.getElementById('itineraryContent');

  if (generateBtn && plannerOutput && itineraryContent) {
    generateBtn.addEventListener('click', () => {
      plannerOutput.innerHTML = `
        <div class="output-placeholder">
          <i class="fa-solid fa-sparkles animate-spin" style="color: var(--color-primary-light); font-size: 3.5rem;"></i>
          <h4 style="margin-top: 24px;">Building your Hanoi plan...</h4>
          <p>Estimating nights, room type, and group rates for HPAIR delegates.</p>
        </div>
      `;

      const roomType = document.getElementById('planDestination').value;
      const nights = parseInt(document.getElementById('planDuration').value);
      const selectedPkg = selectedVibe;
      const transfer = document.querySelector('input[name="luxTier"]:checked').value;

      setTimeout(() => {
        const rate = planRates[selectedPkg] || planRates.essentials;
        const roomFactor = roomMul[roomType] || 1;
        const tf = transferMul[transfer] || 1;

        let perPerson = Math.round(rate * nights * roomFactor * tf);
        perPerson = Math.round(perPerson / 100) * 100;
        const inr = `₹${perPerson.toLocaleString('en-IN')}`;

        plannerOutput.innerHTML = '';
        plannerOutput.appendChild(itineraryContent);
        itineraryContent.classList.remove('hidden');

        const badgeEl = document.getElementById('itineraryBadge');
        badgeEl.textContent = plannerData[selectedPkg].label.toUpperCase();
        badgeEl.style.backgroundColor = '#135f75';

        const stayLabel = plannerData[selectedPkg].stay;
        document.getElementById('itineraryTitle').textContent = `${nights}-Night Hanoi Plan`;
        document.getElementById('itineraryHotel').innerHTML = `<i class="fa-solid fa-bed"></i> ${stayLabel}`;
        document.getElementById('itineraryPax').innerHTML = `<i class="fa-solid fa-users"></i> Group Coordinator`;
        document.getElementById('itineraryCost').textContent = inr;

        const timelineEl = document.getElementById('itineraryTimeline');
        timelineEl.innerHTML = '';
        timelineEl.appendChild(createTimelineItem(1, "Arrival in Hanoi", "Shared airport transfer to your coordinated accommodation near the HPAIR venue."));
        timelineEl.appendChild(createTimelineItem(Math.max(2, Math.round(nights/2)), "Conference Days", "Attend HPAIR Asia Conference 2026 with fellow delegates; coordinator on call."));
        timelineEl.appendChild(createTimelineItem(nights, "Departure", "Shared airport transfer. Final itinerary and details shared before you fly."));

        showToast('Travel plan ready!', 'success');

        const bookItineraryBtn = document.getElementById('bookItineraryBtn');
        if (bookItineraryBtn) {
          bookItineraryBtn.onclick = () => {
            const contactDest = document.getElementById('contactDestination');
            const contactMsg = document.getElementById('contactMessage');
            if (contactDest) contactDest.value = selectedPkg;
            if (contactMsg) {
              contactMsg.value = `I would like a booking inquiry for the ${nights}-night Hanoi plan (${plannerData[selectedPkg].label}, ${roomType} room, ${transfer} transfer, indicative ${inr}/person).`;
            }
          };
        }
      }, 1200);
    });

    function createTimelineItem(dayNum, title, desc) {
      const item = document.createElement('div');
      item.className = 'timeline-item';
      const d = dayNum < 10 ? '0'+dayNum : dayNum;
      item.innerHTML = `
        <div class="timeline-day">Day <span>${d}</span></div>
        <div class="timeline-content">
          <h5>${title}</h5>
          <p>${desc}</p>
        </div>
      `;
      return item;
    }
  }'''

lines = lines[:start] + new_block.split('\n') + lines[end+1:]
open('js/app.js','w',encoding='utf-8').write('\n'.join(lines))
print('done, new line count', len(lines))
