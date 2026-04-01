  // Mobile header
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const servicesBtn = document.getElementById("mobileServicesBtn");
  const servicesMenu = document.getElementById("mobileServicesMenu");
  const arrow = document.getElementById("arrow");

  // Toggle mobile menu
  menuBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    mobileMenu.classList.toggle("hidden");
  });

  // Toggle mobile services submenu
  servicesBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    servicesMenu.classList.toggle("hidden");
    arrow.classList.toggle("rotate-180");
  });

  // Close menu when clicking outside
  document.addEventListener("click", function (e) {
    const isClickInsideMenu = mobileMenu.contains(e.target);
    const isClickOnMenuBtn = menuBtn.contains(e.target);

    if (!isClickInsideMenu && !isClickOnMenuBtn) {
      mobileMenu.classList.add("hidden");
      servicesMenu.classList.add("hidden");
      arrow.classList.remove("rotate-180");
    }
  });

  // Prevent menu from closing when clicking inside mobile menu
  mobileMenu.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  // Active page highlight
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  // Desktop links
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });

  // Mobile links
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");
  mobileLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });

  // Services active state if dropdown page is open
  const servicePages = [
    "pet-boarding.html",
    "pet-training.html",
    "pet-servicing.html",
    "pet-swimming.html"
  ];

  if (servicePages.includes(currentPage)) {
    const serviceDesktopBtn = document.querySelector(".group > .nav-link");
    if (serviceDesktopBtn) {
      serviceDesktopBtn.classList.add("active");
    }

    servicesMenu.classList.remove("hidden");
    arrow.classList.add("rotate-180");
  }
