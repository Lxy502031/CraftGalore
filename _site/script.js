document.addEventListener("DOMContentLoaded", () => {
  // Helper: extract Payhip product ID from URL or ID string
  function extractPayhipId(payhipLink) {
    if (!payhipLink.includes("payhip.com")) return payhipLink;
    const match = payhipLink.match(/payhip\.com\/b\/([\w]+)/);
    return match ? match[1] : payhipLink;
  }

  

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
  const productModal = document.getElementById('productModal');
  const modalContent = document.getElementById('modal-details');
  const productModalClose = document.getElementById('productModalClose');

  const imageModal = document.getElementById('imageModal');
  const imageModalImg = document.getElementById('imageModalImg');
  const imageModalClose = document.getElementById('imageModalClose');

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

    // Refresh Payhip buttons so cart works on dynamically added buttons
    if (window.Payhip && typeof window.Payhip.renderButtons === 'function') {
      window.Payhip.renderButtons();
    }

    // Prevent jump to top on click for all payhip buttons
    document.querySelectorAll('.payhip-add-to-cart-button').forEach(button => {
      button.addEventListener('click', function (e) {
        e.preventDefault();
      });
    });
  }

  function showCategory(category) {
    document.getElementById('categoryPreview').style.display = 'none';
    document.getElementById('productSection').style.display = 'block';

    renderProducts(category); // already filters and renders dynamically
  }

  function goBackToCategories() {
    document.getElementById('productSection').style.display = 'none';
    document.getElementById('categoryPreview').style.display = 'flex'; // or block
  }

  function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'category-card';
    card.dataset.slug = product.slug;

    const imgSrc = (product.images && product.images.length > 0) ? product.images[0] : 'placeholder.jpg';
    const payhipId = extractPayhipId(product.payhipLink);

    card.innerHTML = `
      <img src="${imgSrc}" alt="${product.name}" class="product-image" style="cursor:pointer;" />
      <h3>${product.name}</h3>
      <p>$${product.price.toFixed(2)}</p>
      <button class="more-info-btn">More Info</button>
      <a href="#"
         class="payhip-add-to-cart-button"
         data-product="${payhipId}"
         data-theme="green"
         aria-label="Add ${product.name} to cart">
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
          ? product.images.map(imgPath => `<img src="${imgPath}" style="max-width:100px; margin:5px; cursor:pointer;" class="modal-thumb">`).join('')
          : ''}
      `;
      productModal.classList.remove('hidden');

      // Add click event to images in modal to enlarge
      modalContent.querySelectorAll('.modal-thumb').forEach(img => {
        img.addEventListener('click', () => {
          imageModalImg.src = img.src;
          imageModal.classList.remove('hidden');
        });
      });
    });

    // Clicking product image opens image modal
    card.querySelector('.product-image').addEventListener('click', () => {
      imageModalImg.src = imgSrc;
      imageModal.classList.remove('hidden');
    });

    return card;
  }

  // Close product details modal
  if (productModalClose && productModal) {
    productModalClose.addEventListener('click', () => {
      productModal.classList.add('hidden');
    });
  }

  // Close image modal
  if (imageModalClose && imageModal) {
    imageModalClose.addEventListener('click', () => {
      imageModal.classList.add('hidden');
    });

    // Also close image modal on clicking outside the image
    imageModal.addEventListener('click', (e) => {
      if (e.target === imageModal) {
        imageModal.classList.add('hidden');
      }
    });
  }

  // Filter buttons functionality
  document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', () => {
      const category = button.getAttribute('data-category');
      renderProducts(category);
    });
  });

  const searchBar = document.querySelector('.search-bar');
  if (searchBar) {
    const categories = ['keychains', 'bags', 'dolls','decorations'];

    searchBar.addEventListener('submit', function (e) {
      e.preventDefault();

      const input = this.querySelector('input');
      if (!input) return;

      const searchTerm = input.value.trim().toLowerCase();

      if (searchTerm === 'product' || searchTerm === 'products') {
        renderProducts('all');
        productListContainer.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      const matchedCategory = categories.find(cat =>
        cat === searchTerm || cat === searchTerm + 's' || cat + 's' === searchTerm
      );

      if (matchedCategory) {
        renderProducts(matchedCategory);
        productListContainer.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      const section = document.querySelector(`#${searchTerm}`);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      alert('No matching section found.');
    });
  }
});
