document.addEventListener('DOMContentLoaded', function() {
  // Add event listener for Request Services button
  document.getElementById('requestServicesBtn').addEventListener('click', openPopup);

  // Add event listeners for media package cards
  const mediaCards = document.querySelectorAll('.media-card');
  mediaCards.forEach(card => {
    card.addEventListener('click', function() {
      this.classList.toggle('selected');
    });
  });
});

function getSelectedItems() {
  const checkboxes = document.querySelectorAll('.checkbox:checked');
  const items = [];
  let total = 0;

  // Get checked items from regular checkboxes
  checkboxes.forEach(cb => {
    const name = cb.dataset.name;
    const price = parseFloat(cb.dataset.price);
    items.push({ name, price });
    total += price;
  });

  // Get selected media packages
  const selectedCards = document.querySelectorAll('.media-card.selected');
  selectedCards.forEach(card => {
    const name = card.dataset.name;
    const price = parseFloat(card.dataset.price);
    items.push({ name, price });
    total += price;
  });

  return { items, total };
}

function openPopup() {
  const { items, total } = getSelectedItems();
  const list = document.getElementById('selectedList');

  if (items.length === 0) {
    list.innerHTML = '<li class="no-items">No services selected</li>';
  } else {
    let html = items.map(item =>
      `<li><span>${item.name}</span><span class="item-total">${item.price.toFixed(2)}</span></li>`
    ).join('');
    html += `<li class="total-row"><span>Total</span><span>${total.toFixed(2)}</span></li>`;
    list.innerHTML = html;
  }

  document.getElementById('hiddenServices').value =
    items.map(i => `${i.name} (${i.price.toFixed(2)})`).join(', ');
  document.getElementById('hiddenTotal').value = `${total.toFixed(2)}`;

  const overlay = document.getElementById('popupOverlay');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  const popup = document.querySelector('.popup');
  setTimeout(() => {
    overlay.scrollTo({ top: 0, behavior: 'auto' });
    popup.scrollTo({ top: 0, behavior: 'auto' });
    popup.scrollIntoView({ behavior: 'auto', block: 'start' });
  }, 50);
}

function closePopup() {
  document.getElementById('popupOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

// Close popup when clicking outside
document.getElementById('popupOverlay').addEventListener('click', function(e) {
  if (e.target === this) {
    closePopup();
  }
});

// Handle form submission
document.getElementById('contactForm').addEventListener('submit', function() {
  const successOverlay = document.getElementById('successOverlay');

  document.body.classList.add('success-active');

  requestAnimationFrame(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  });

  successOverlay.classList.add('show');

  setTimeout(() => {
    closePopup();
  }, 200);

  setTimeout(() => {
    successOverlay.classList.remove('show');
    document.body.classList.remove('success-active');
  }, 5000);
});

const sliderInput = document.querySelector('.ba-slider');
const beforeImg = document.querySelector('.ba-before');
const handle = document.querySelector('.ba-handle');
const inlineSlider = document.getElementById('inlineSlider');
const packageSlideshowOverlay = document.getElementById('packageSlideshowOverlay');
const packageSlideshowPopup = document.querySelector('.slideshow-popup');
const packageSlideshowTitle = document.getElementById('packageSlideshowTitle');
const packageSlideshowImage = document.getElementById('packageSlideshowImage');
const packageSlideshowCounter = document.getElementById('packageSlideshowCounter');
const packageSlides = {
  /* silver: {
    title: 'Silver Package',
    slides: [
      {
        src: 'https://placehold.co/1200x675?text=Silver+Slide+1',
        alt: 'Silver package placeholder slide 1'
      },
      {
        src: 'https://placehold.co/1200x675?text=Silver+Slide+2',
        alt: 'Silver package placeholder slide 2'
      },
      {
        src: 'https://placehold.co/1200x675?text=Silver+Slide+3',
        alt: 'Silver package placeholder slide 3'
      }
    ]
  },
  gold: {
    title: 'Gold Package',
    slides: [
      {
        src: 'https://placehold.co/1200x675?text=Gold+Slide+1',
        alt: 'Gold package placeholder slide 1'
      },
      {
        src: 'https://placehold.co/1200x675?text=Gold+Slide+2',
        alt: 'Gold package placeholder slide 2'
      },
      {
        src: 'https://placehold.co/1200x675?text=Gold+Slide+3',
        alt: 'Gold package placeholder slide 3'
      }
    ]
  }, */
  platinum: {
    title: 'Platinum Package',
    slides: [
      {
        src: 'https://opi.x02.me/i/ZY5B.jpg',
        alt: 'Platinum package placeholder slide 1'
      },
      {
        src: 'https://opi.x02.me/i/A5XBP.jpg',
        alt: 'Platinum package placeholder slide 2'
      },
      {
        src: 'https://opi.x02.me/i/EZTB.jpg',
        alt: 'Platinum package placeholder slide 3'
      },
      {
        src: 'https://opi.x02.me/i/DT5YTX.jpg',
        alt: 'Platinum package placeholder slide 4'
      },
      {
        src: 'https://opi.x02.me/i/ZAW9.jpg',
        alt: 'Platinum package placeholder slide 5'
      },
      {
        src: 'https://opi.x02.me/i/7QNBS3.jpg',
        alt: 'Platinum package placeholder slide 7'
      },
      {
        src: 'https://opi.x02.me/i/DWQR7.jpg',
        alt: 'Platinum package placeholder slide 8'
      },
      {
        src: 'https://opi.x02.me/i/82R9.jpg',
        alt: 'Platinum package placeholder slide 9'
      },
      {
        src: 'https://opi.x02.me/i/HXT3Y8.jpg',
        alt: 'Platinum package placeholder slide 10'
      },
      {
        src: 'https://opi.x02.me/i/TF2KW.jpg',
        alt: 'Platinum package placeholder slide 11'
      },
      {
        src: 'https://opi.x02.me/i/UWHZ.jpg',
        alt: 'Platinum package placeholder slide 12'
      }
    ]
  }
};
let activePackageKey = null;
let activePackageSlideIndex = 0;

function updateBASlider() {
  const val = sliderInput.value;
  beforeImg.style.clipPath = `inset(0 ${100 - val}% 0 0)`;
  handle.style.left = val + '%';
}

sliderInput.addEventListener('input', updateBASlider);
updateBASlider();

function openInlineSlider(trigger, beforeSrc, afterSrc) {
  const slider = inlineSlider;
  if (!slider) return;

  document.getElementById('sliderBefore').src = beforeSrc;
  document.getElementById('sliderAfter').src = afterSrc;

  sliderInput.value = 50;
  updateBASlider();

  const item = trigger.closest('.menu-item');
  if (item) {
    item.after(slider);
  }

  slider.classList.add('active');
  slider.setAttribute('aria-hidden', 'false');
}

function closeInlineSlider() {
  if (!inlineSlider) return;
  inlineSlider.classList.remove('active');
  inlineSlider.setAttribute('aria-hidden', 'true');
}

function renderPackageSlide() {
  const config = packageSlides[activePackageKey];
  if (!config || !config.slides.length) return;

  const slide = config.slides[activePackageSlideIndex];
  packageSlideshowTitle.textContent = config.title;
  packageSlideshowImage.src = slide.src;
  packageSlideshowImage.alt = slide.alt;
  packageSlideshowCounter.textContent = `${activePackageSlideIndex + 1} / ${config.slides.length}`;
}

function positionPackageSlideshowInView() {
  if (!packageSlideshowOverlay) return;

  const viewport = window.visualViewport;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
  const viewportTop = scrollTop + (viewport ? viewport.offsetTop : 0);
  const viewportLeft = scrollLeft + (viewport ? viewport.offsetLeft : 0);
  const viewportHeight = viewport ? viewport.height : window.innerHeight;
  const viewportWidth = viewport ? viewport.width : window.innerWidth;

  // In embedded iframe environments, absolute positioning tied to the current
  // viewport is more reliable than fixed positioning.
  packageSlideshowOverlay.style.position = 'absolute';
  packageSlideshowOverlay.style.top = `${viewportTop}px`;
  packageSlideshowOverlay.style.left = `${viewportLeft}px`;
  packageSlideshowOverlay.style.right = 'auto';
  packageSlideshowOverlay.style.bottom = 'auto';
  packageSlideshowOverlay.style.width = `${viewportWidth}px`;
  packageSlideshowOverlay.style.height = `${viewportHeight}px`;
  packageSlideshowOverlay.style.minHeight = `${viewportHeight}px`;
}

function resetPackageSlideshowPosition() {
  if (!packageSlideshowOverlay) return;

  packageSlideshowOverlay.style.position = '';
  packageSlideshowOverlay.style.top = '';
  packageSlideshowOverlay.style.left = '';
  packageSlideshowOverlay.style.right = '';
  packageSlideshowOverlay.style.bottom = '';
  packageSlideshowOverlay.style.width = '';
  packageSlideshowOverlay.style.height = '';
  packageSlideshowOverlay.style.minHeight = '';
}

function openPackageSlideshow(event, packageKey) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  if (!packageSlides[packageKey]) return;

  activePackageKey = packageKey;
  activePackageSlideIndex = 0;
  renderPackageSlide();
  packageSlideshowOverlay.classList.add('active');
  packageSlideshowOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  requestAnimationFrame(() => {
    positionPackageSlideshowInView();
    packageSlideshowOverlay.scrollTo({ top: 0, behavior: 'auto' });
    packageSlideshowPopup.scrollTo({ top: 0, behavior: 'auto' });
  });
}

function changePackageSlide(direction) {
  const config = packageSlides[activePackageKey];
  if (!config || !config.slides.length) return;

  activePackageSlideIndex = (activePackageSlideIndex + direction + config.slides.length) % config.slides.length;
  renderPackageSlide();
}

function closePackageSlideshow() {
  packageSlideshowOverlay.classList.remove('active');
  packageSlideshowOverlay.setAttribute('aria-hidden', 'true');
  activePackageKey = null;
  resetPackageSlideshowPosition();

  if (!document.getElementById('popupOverlay').classList.contains('active')) {
    document.body.style.overflow = '';
  }
}

packageSlideshowOverlay.addEventListener('click', function(e) {
  if (e.target === this) {
    closePackageSlideshow();
  }
});

document.addEventListener('keydown', function(e) {
  if (!packageSlideshowOverlay.classList.contains('active')) return;

  if (e.key === 'Escape') {
    closePackageSlideshow();
  }

  if (e.key === 'ArrowLeft') {
    changePackageSlide(-1);
  }

  if (e.key === 'ArrowRight') {
    changePackageSlide(1);
  }
});

window.addEventListener('resize', function() {
  if (packageSlideshowOverlay.classList.contains('active')) {
    positionPackageSlideshowInView();
  }
});

if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', function() {
    if (packageSlideshowOverlay.classList.contains('active')) {
      positionPackageSlideshowInView();
    }
  });
}
