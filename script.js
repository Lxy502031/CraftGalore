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

  new Swiper('.swiper-container', {
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
  product1: `<h3>Winnie the Pooh Keychain</h3><p>Durable. Great for daily use or gifting.</p>`,
  product2: `<h3>Minion Keychain</h3><p>Handmade. Perfect for backpacks and gifts.</p>`,
  product3: `<h3>Classic Tote Bag</h3><p>Hand-crocheted tote bag with a spacious design — perfect for daily use or shopping.</p>`,
  product4: `<h3>Canvas Shoulder Bag</h3><p>Stylish crocheted shoulder bag, lightweight yet sturdy — great for casual outings.</p>`
};


document.querySelectorAll('.more-info-btn').forEach(button => {
  button.addEventListener('click', () => {
    const id = button.getAttribute('data-product');
    modalContent.innerHTML = productInfo[id] || '<p>Info not found.</p>';
    modal.classList.remove('hidden');
  });
});

closeBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});