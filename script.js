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

    const mainEl = section.querySelector('.landing-gallery__main');
    if (mainEl) {
      let touchStartX = 0;
      let touchStartY = 0;
      mainEl.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].clientX;
        touchStartY = e.changedTouches[0].clientY;
      }, { passive: true });
      mainEl.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        const SWIPE_THRESHOLD = 40;
        if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
          if (dx < 0) show(index + 1);
          else show(index - 1);
        }
      }, { passive: true });
    }
  });


  const siteHeader = document.getElementById('site-header');
  if (siteHeader) {
    const updateHeaderState = () => {
      siteHeader.classList.toggle('sticky-header', window.scrollY > 10);
    };
    updateHeaderState();
    window.addEventListener('scroll', updateHeaderState, { passive: true });
  }

  $all('[data-certificates-swiper]').forEach((track) => {
    const scrollbar = track.parentElement?.querySelector('[data-certificates-scrollbar]');
    const thumb = scrollbar?.querySelector('.certs-scrollbar__thumb');
    if (!thumb) return;
    const update = () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      const ratio = maxScroll > 0 ? track.scrollLeft / maxScroll : 0;
      const thumbWidthPercent = 25;
      const travel = 100 - thumbWidthPercent;
      thumb.style.transform = `translate3d(${(ratio * travel)}%, 0, 0)`;
    };
    track.addEventListener('scroll', update, { passive: true });
    update();
  });

  $all('.pf-video-wrapper').forEach((wrapper) => {
    const video = wrapper.querySelector('.pf-video');
    const playButton = wrapper.querySelector('.pf-video-play');
    if (!video || !playButton) return;
    const showPlayButton = () => playButton.classList.remove('paused');
    const hidePlayButton = () => playButton.classList.add('paused');
    const startPlayback = () => {
      // Fullscreen only on mobile -- desktop keeps the original inline playback.
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      if (isMobile) {
        // iOS Safari doesn't support requestFullscreen() on <video>; it has its own
        // dedicated fullscreen-video API instead, which also handles playback itself.
        if (typeof video.webkitEnterFullscreen === 'function') {
          video.webkitEnterFullscreen();
        } else if (typeof video.requestFullscreen === 'function') {
          video.requestFullscreen().catch(() => {});
        } else if (typeof video.webkitRequestFullscreen === 'function') {
          video.webkitRequestFullscreen();
        }
      }
      video.play();
    };
    playButton.addEventListener('click', () => {
      if (video.paused) {
        startPlayback();
      } else {
        video.pause();
      }
    });
    video.addEventListener('click', () => {
      if (video.paused) {
        startPlayback();
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
