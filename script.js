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

  // Initialize global Swiper(s) (e.g. hero or other sliders)
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

  // Initialize Swipers inside product galleries with custom buttons
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
});

// Search functionality for navigating to sections/pages based on keywords

// Mapping search keywords to actions
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

// Listen for search form submission
document.querySelector('.search-bar').addEventListener('submit', function (e) {
  e.preventDefault();

  const searchTerm = this.querySelector('input').value.trim().toLowerCase();

  if (searchMap[searchTerm]) {
    const destination = searchMap[searchTerm];

    if (destination.startsWith('#')) {
      // Scroll to section if on the same page
      const section = document.querySelector(destination);
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Redirect to another page
      window.location.href = destination;
    }
  } else {
    alert('No matching section found.');
  }
});

const modal = document.getElementById('productModal');
const modalContent = document.getElementById('modal-details');
const closeBtn = document.querySelector('.close-btn');

const productInfo = {
  keychains: {
    minion: `<h3>Minion Keychain</h3><p>Handmade. Perfect for backpacks and gifts.</p>`,
    winnie: `<h3>Winnie the Pooh Keychain</h3><p>Durable. Great for daily use or gifting.</p>`,
    bird: `<h3>Bird Keychain</h3><p>Handmade keychain, eco-friendly and stylish — ideal for bags or everyday use.</p>`
  },
  bags: {
    tote: `<h3>Classic Tote Bag</h3><p>Hand-crocheted tote bag with a spacious design — perfect for daily use or shopping.</p>`,
    canvas: `<h3>Canvas Shoulder Bag</h3><p>Stylish crocheted shoulder bag, lightweight yet sturdy — great for casual outings.</p>`
  }
};
document.querySelectorAll('.more-info-btn').forEach(button => {
  button.addEventListener('click', () => {
    const category = button.getAttribute('data-category');
    const product = button.getAttribute('data-product');

    if (productInfo[category] && productInfo[category][product]) {
      modalContent.innerHTML = productInfo[category][product];
    } else {
      modalContent.innerHTML = '<p>Info not found.</p>';
    }

    modal.classList.remove('hidden');
  });
});




closeBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});



