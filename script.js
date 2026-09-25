(() => {
  const $all = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  $all('.landing-gallery').forEach((section) => {
    const thumbs = $all('.landing-gallery__thumb', section);
    if (!thumbs.length) return;
    const mainImg = section.querySelector('[data-gallery-main]');
    const desc = section.querySelector('[data-gallery-desc]');
    const currentEl = section.querySelector('[data-gallery-current]');
    const prevBtn = section.querySelector('[data-gallery-prev]');
    const nextBtn = section.querySelector('[data-gallery-next]');
    let index = 0;

    const show = (i) => {
      index = (i + thumbs.length) % thumbs.length;
      const thumb = thumbs[index];
      thumbs.forEach((t, ti) => t.classList.toggle('is-active', ti === index));
      if (mainImg) {
        mainImg.src = thumb.dataset.image;
        mainImg.alt = thumb.dataset.alt || '';
      }
      if (desc) desc.innerHTML = thumb.dataset.text || '';
      if (currentEl) currentEl.textContent = String(index + 1).padStart(2, '0');
    };

    thumbs.forEach((thumb, i) => thumb.addEventListener('click', () => show(i)));
    if (prevBtn) prevBtn.addEventListener('click', () => show(index - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => show(index + 1));
  });


  const siteHeader = document.getElementById('site-header');
  if (siteHeader) {
    const updateHeaderState = () => {
      siteHeader.classList.toggle('sticky-header', window.scrollY > 10);
    };
    updateHeaderState();
    window.addEventListener('scroll', updateHeaderState, { passive: true });
  }

  $all('.pf-video-wrapper').forEach((wrapper) => {
    const video = wrapper.querySelector('.pf-video');
    const playButton = wrapper.querySelector('.pf-video-play');
    if (!video || !playButton) return;
    const showPlayButton = () => playButton.classList.remove('paused');
    const hidePlayButton = () => playButton.classList.add('paused');
    playButton.addEventListener('click', () => {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    });
    video.addEventListener('click', () => {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    });
    video.addEventListener('play', hidePlayButton);
    video.addEventListener('pause', showPlayButton);
    video.addEventListener('ended', showPlayButton);
  });

  const faqItems = $all('.faq-block');
  faqItems.forEach((item) => {
    const button = item.querySelector('.faq-block_title');
    if (!button) return;
    button.setAttribute('role', 'button');
    button.setAttribute('tabindex', '0');
    item.setAttribute('aria-expanded', 'false');
    const toggle = () => {
      const willOpen = !item.classList.contains('active');
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('active');
          other.setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('active', willOpen);
      item.setAttribute('aria-expanded', String(willOpen));
    };
    item.addEventListener('click', toggle);
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });

  $all('[data-product-reviews-show-more]').forEach((button) => {
    button.addEventListener('click', () => {
      const grid = button.closest('section')?.querySelector('.product-reviews-masonry__grid');
      if (!grid) return;
      grid.classList.add('is-expanded');
      button.hidden = true;
    });
  });

  $all('.product-showcase__gallery').forEach((gallery) => {
    const slides = $all('.swiper-slide', gallery);
    const thumbs = $all('.product-showcase__thumb', gallery);
    const current = gallery.parentElement?.querySelector('.product-showcase__current');
    const bars = gallery.parentElement?.querySelectorAll('.product-showcase__bar') || [];
    const activate = (index) => {
      slides.forEach((slide, i) => slide.classList.toggle('is-static-active', i === index));
      thumbs.forEach((thumb, i) => thumb.classList.toggle('is-active', i === index));
      [...bars].forEach((bar, i) => bar.classList.toggle('is-active', i === index));
      if (current) current.textContent = String(index + 1).padStart(2, '0');
    };
    thumbs.forEach((thumb, index) => thumb.addEventListener('click', () => activate(index)));
    activate(0);
  });

  $all('form').forEach((form) => {
    if (form.dataset.web3forms === 'true') {
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        let note = form.querySelector('.static-form-note');
        if (!note) {
          note = document.createElement('p');
          note.className = 'static-form-note';
          form.append(note);
        }
        const submitButton = form.querySelector('[type="submit"]');
        if (submitButton) submitButton.disabled = true;
        note.textContent = 'Sending...';
        try {
          const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(Object.fromEntries(new FormData(form))),
          });
          const result = await response.json();
          if (result.success) {
            note.textContent = "Thank you! We'll be in touch shortly.";
            form.reset();
          } else {
            note.textContent = 'Something went wrong. Please try again or email us directly.';
          }
        } catch (err) {
          note.textContent = 'Something went wrong. Please try again or email us directly.';
        } finally {
          if (submitButton) submitButton.disabled = false;
        }
      });
      return;
    }
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      let note = form.querySelector('.static-form-note');
      if (!note) {
        note = document.createElement('p');
        note.className = 'static-form-note';
        form.append(note);
      }
      note.textContent = 'Form submission will be connected during the next implementation stage.';
    });
  });
})();
