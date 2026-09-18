(() => {
  const $all = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  $all('.faq-section__item, .faq-item').forEach((item) => {
    const button = item.querySelector('button, .faq-section__question, .faq-item__question');
    if (!button) return;
    button.setAttribute('aria-expanded', 'false');
    button.addEventListener('click', () => {
      const open = item.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(open));
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

  const products = {
    '1196': {
      title: 'A compact option for smaller spaces and everyday home use',
      price: '€2600',
      images: ['Round-3-1.png', 'Round-2.png', 'Round-1.png', 'Product-photos-for-LP-7.png', '9.png'],
      specs: ['130*78*78 cm', '30 mm (+/- 2 mm)', 'branchless thermo aspen', 'stainless steel', 'Treated with heated linseed oil and beeswax', 'Users up to 182 cm', 'Small rooms', 'Private homes']
    },
    '1189': {
      title: 'More internal space and additional comfort',
      price: '€3100',
      images: ['Oval-3-1.png', 'Oval-2.png', 'Product-photos-for-LP-6.png', 'Product-photos-for-LP-7.png', '9.png'],
      specs: ['130*100*78 cm', '30 mm (+/- 2 mm)', 'branchless thermo aspen', 'stainless steel', 'Treated with heated linseed oil and beeswax', 'Users up to 215 cm', 'Home or business use', 'Extra legroom and backrest']
    }
  };

  $all('.product-showcase').forEach((section) => {
    const choose = (id) => {
      const product = products[id];
      if (!product) return;
      const title = section.querySelector('[data-product-showcase-title]');
      const price = section.querySelector('[data-product-showcase-price]');
      if (title) title.textContent = product.title;
      if (price) price.textContent = product.price;
      $all('[data-product-showcase-product]', section).forEach((button) => {
        button.classList.toggle('is-active', button.dataset.productId === id);
      });
      $all('.product-showcase__spec-value', section).forEach((value, index) => {
        if (product.specs[index]) value.textContent = product.specs[index];
      });
      const thumbs = $all('.product-showcase__thumb img', section);
      const slides = $all('.product-showcase__swiper .swiper-slide', section);
      product.images.forEach((name, index) => {
        const src = `assets/${name}`;
        if (thumbs[index]) thumbs[index].src = src;
        const image = slides[index]?.querySelector('img');
        const link = slides[index]?.querySelector('a');
        if (image) image.src = src;
        if (link) link.href = src;
      });
    };
    $all('[data-product-showcase-product]', section).forEach((button) => {
      button.addEventListener('click', () => choose(button.dataset.productId));
    });
    choose('1196');
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
