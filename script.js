(() => {
  const $all = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  $all('.faq-block').forEach((item) => {
    const button = item.querySelector('.faq-block_title');
    if (!button) return;
    button.setAttribute('role', 'button');
    button.setAttribute('tabindex', '0');
    item.setAttribute('aria-expanded', 'false');
    const toggle = () => {
      const open = item.classList.toggle('active');
      item.setAttribute('aria-expanded', String(open));
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
