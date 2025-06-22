document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  toggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const data = new FormData(form);
      fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      })
        .then(response => {
          if (response.ok) {
            alert("Your message has been sent!");
            form.reset();
          } else {
            alert("Oops! There was a problem submitting your form.");
          }
        })
        .catch(() => {
          alert("Oops! There was a problem submitting your form.");
        });
    });
  }

  // Initialize global Swiper(s)
  new Swiper('.swiper-container:not(.product-gallery)', {
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    effect: 'cube',
    grabCursor: true,
    cubeEffect: {
      shadow: true,
      slideShadows: true,
      shadowOffset: 20,
      shadowScale: 0.94,
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    }
  });

  document.querySelectorAll('.product-gallery').forEach(gallery => {
    new Swiper(gallery, {
      loop: true,
      navigation: {
        nextEl: gallery.querySelector('.custom-swiper-button-next'),
        prevEl: gallery.querySelector('.custom-swiper-button-prev'),
      },
      slidesPerView: 1,
      spaceBetween: 10
    });
  });

  // Dynamic product rendering for category pages
  const productListContainer = document.getElementById('dynamic-product-list');
  const modal = document.getElementById('productModal');
  const modalContent = document.getElementById('modal-details');
  const closeBtn = document.querySelector('.close-btn');

  if (productListContainer) {
    // Get current category from page name
    const currentPage = window.location.pathname;
    let category = '';

    if (currentPage.includes('keychains.html')) {
      category = 'keychains';
    } else if (currentPage.includes('bags.html')) {
      category = 'bags';
    }

    if (category) {
      fetch('products.json')
        .then(response => response.json())
        .then(products => {
          const filteredProducts = products.filter(product => product.category === category);
          productListContainer.innerHTML = '';

          if (filteredProducts.length === 0) {
            productListContainer.innerHTML = '<p>No products available in this category.</p>';
            return;
          }

          filteredProducts.forEach(product => {
            const card = document.createElement('a');
            card.href = '#';
            card.className = 'category-card';
            card.dataset.slug = product.slug;

            const imgSrc = (product.images && product.images.length > 0)
              ? product.images[0]
              : 'placeholder.jpg';

            card.innerHTML = `
              <img src="${imgSrc}" alt="${product.name}" />
              <h3>${product.name}</h3>
              <p>$${product.price.toFixed(2)}</p>
            `;

            card.addEventListener('click', e => {
              e.preventDefault();

              modalContent.innerHTML = `
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
                ${product.images && product.images.length > 0
                  ? product.images.map(imgPath => `<img src="${imgPath}" style="max-width:100px; margin:5px;">`).join('')
                  : ''}
              `;

              modal.classList.remove('hidden');
            });

            productListContainer.appendChild(card);
          });
        })
        .catch(err => {
          console.error('Error loading products.json:', err);
          productListContainer.innerHTML = '<p>Failed to load products.</p>';
        });
    }
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  }
});

// Search functionality
const searchMap = {
  keychain: 'keychains.html',
  keychains: 'keychains.html',
  bag: 'bags.html',
  bags: 'bags.html',
  contact: '#contact',
  home: '#home',
  product: '#products',
  products: '#products'
};

document.querySelector('.search-bar').addEventListener('submit', function (e) {
  e.preventDefault();

  const searchTerm = this.querySelector('input').value.trim().toLowerCase();

  if (searchMap[searchTerm]) {
    const destination = searchMap[searchTerm];

    if (destination.startsWith('#')) {
      const section = document.querySelector(destination);
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = destination;
    }
  } else {
    alert('No matching section found.');
  }
});
