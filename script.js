// Card scroll animations
const cards = document.querySelectorAll(".card");

window.addEventListener("scroll", () => {
  cards.forEach(card => {
    const top = card.getBoundingClientRect().top;
    if (top < window.innerHeight - 100) {
      card.classList.add("show");
    }
  });
});

// Counter animation — fires when metrics section scrolls into view
const counters = document.querySelectorAll(".count");

const animateCounter = (counter) => {
  counter.innerText = "0";
  const target = +counter.getAttribute("data-target");

  const update = () => {
    const c = +counter.innerText;
    const inc = target / 80;

    if (c < target) {
      counter.innerText = Math.ceil(c + inc);
      setTimeout(update, 20);
    } else {
      counter.innerText = target;
    }
  };

  update();
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      observer.unobserve(entry.target); // only animate once
    }
  });
}, { threshold: 0.5 });

counters.forEach(counter => observer.observe(counter));
