document.addEventListener("DOMContentLoaded", () => {
  // Menu toggle
  const toggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  toggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  // Contact form submission
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

  // Swiper setup
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

  // Modal elements
  const modal = document.getElementById('productModal');
  const modalContent = document.getElementById('modal-details');
  const closeBtn = document.querySelector('.close-btn');

  // Single container for all products
  const productListContainer = document.getElementById('dynamic-product-list');

  let allProducts = [];

  // Load products.json and render all products initially
  fetch('products.json')
    .then(response => response.json())
    .then(products => {
      allProducts = products;
      renderProducts('all'); // Show all products on load
    })
    .catch(err => {
      console.error('Error loading products.json:', err);
      if (productListContainer) productListContainer.innerHTML = '<p>Failed to load products.</p>';
    });

  // Render products filtered by category
  function renderProducts(category) {
    if (!productListContainer) return;
    productListContainer.innerHTML = '';

    let filteredProducts = [];

    if (category === 'all') {
      filteredProducts = allProducts;
    } else {
      filteredProducts = allProducts.filter(p => p.category === category);
    }

    if (filteredProducts.length === 0) {
      productListContainer.innerHTML = '<p>No products available in this category.</p>';
      return;
    }

    filteredProducts.forEach(product => {
      productListContainer.appendChild(createProductCard(product));
    });
  }

  // Create a product card element
  function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'category-card';
    card.dataset.slug = product.slug;

    const imgSrc = (product.images && product.images.length > 0) ? product.images[0] : 'placeholder.jpg';

    card.innerHTML = `
      <img src="${imgSrc}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>$${product.price.toFixed(2)}</p>
      <button class="more-info-btn">More Info</button>
      <a href="${product.payhipLink}" 
         class="payhip-add-to-cart-button" 
         data-product="${product.payhipLink}" 
         data-theme="green"
         target="_blank" 
         rel="noopener noreferrer">
         Add to Cart
      </a>
    `;

    // More Info button shows modal with details
    card.querySelector('.more-info-btn').addEventListener('click', () => {
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

    return card;
  }

  // Close modal event
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  }

  // Filter buttons functionality
  document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', () => {
      const category = button.getAttribute('data-category');
      renderProducts(category);
    });
  });

  // Search functionality adapted for categories and sections
  const searchBar = document.querySelector('.search-bar');
  if (searchBar) {
    searchBar.addEventListener('submit', function (e) {
      e.preventDefault();

      const input = this.querySelector('input');
      if (!input) return;

      const searchTerm = input.value.trim().toLowerCase();

      // Scroll or filter by search term
      if (searchTerm === 'keychain' || searchTerm === 'keychains') {
        renderProducts('keychains');
        productListContainer.scrollIntoView({ behavior: 'smooth' });
      } else if (searchTerm === 'bag' || searchTerm === 'bags') {
        renderProducts('bags');
        productListContainer.scrollIntoView({ behavior: 'smooth' });
      } else if (searchTerm === 'contact') {
        const section = document.querySelector('#contact');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
      } else if (searchTerm === 'home') {
        const section = document.querySelector('#home');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
      } else if (searchTerm === 'product' || searchTerm === 'products') {
        renderProducts('all');
        productListContainer.scrollIntoView({ behavior: 'smooth' });
      } else {
        alert('No matching section found.');
      }
    });
  }
});
