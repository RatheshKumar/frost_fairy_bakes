const menuCards = [...document.querySelectorAll(".menu-grid .cake-card")];
const filterButtons = [...document.querySelectorAll(".filter-button")];
const menuCount = document.querySelector(".menu-count");

function updateMenu(filter) {
  let visibleCount = 0;

  menuCards.forEach((card) => {
    const matches = filter === "all" || card.dataset.category.split(" ").includes(filter);
    card.hidden = !matches;
    if (matches) visibleCount += 1;
  });

  if (menuCount) {
    menuCount.textContent = `${visibleCount} ${visibleCount === 1 ? "cake" : "cakes"}`;
  }
}

if (menuCards.length && filterButtons.length) {
  updateMenu("all");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });

      updateMenu(button.dataset.filter);
    });
  });
}

const orderForm = document.querySelector("#cake-order-form");

if (orderForm) {
  const dateField = orderForm.elements.namedItem("date");
  const localToday = new Date();
  localToday.setMinutes(localToday.getMinutes() - localToday.getTimezoneOffset());
  dateField.min = localToday.toISOString().slice(0, 10);

  orderForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!orderForm.reportValidity()) return;

    const details = new FormData(orderForm);
    const message = [
      "Hi Frost Fairy! I'd love to ask about a custom cake.",
      "",
      `Occasion: ${details.get("occasion")}`,
      `Date: ${details.get("date")}`,
      `Flavour: ${details.get("flavour") || "I'd love a recommendation"}`,
      `Size: ${details.get("size") || "Please help me choose"}`,
      `Cake idea: ${details.get("design") || "I'd like to discuss this with you"}`,
      `Extra details: ${details.get("extra") || "None yet"}`,
    ].join("\n");
    const whatsappUrl = `https://wa.me/919080261893?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  });
}

const revealElements = [
  ...document.querySelectorAll(
    ".featured-section, .featured-grid .feature-card, .workshop-layout, .little-steps, .little-steps .step-card, .note-inner, .order-layout, .order-form, .order-aside, .menu-grid .cake-card, .collection-story, .menu-cta, .inspiration-section, .inspiration-grid .inspiration-card, .order-steps, .order-steps .step-grid article, .order-faq",
  ),
];

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (revealElements.length && "IntersectionObserver" in window && !reduceMotion) {
  revealElements.forEach((element, index) => {
    element.classList.add("reveal");
    element.style.setProperty("--reveal-delay", `${(index % 4) * 65}ms`);
  });

  document.documentElement.classList.add("motion-ready");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -7% 0px", threshold: 0.1 },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

const mobileOrderLink = document.querySelector(".mobile-order");
const mobileOrderRevealPoint = document.querySelector(".hero, .page-intro");

if (mobileOrderLink && mobileOrderRevealPoint && "IntersectionObserver" in window) {
  document.body.classList.add("mobile-order-enhanced");

  const mobileOrderObserver = new IntersectionObserver(
    ([entry]) => {
      mobileOrderLink.classList.toggle("is-visible", !entry.isIntersecting);
    },
    { threshold: 0 },
  );

  mobileOrderObserver.observe(mobileOrderRevealPoint);
}
