// Mobile header
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  menuBtn.onclick = () => {
    mobileMenu.classList.toggle("hidden");
  };

  const servicesBtn = document.getElementById("mobileServicesBtn");
  const servicesMenu = document.getElementById("mobileServicesMenu");

  servicesBtn.onclick = () => {
    servicesMenu.classList.toggle("hidden");
  };
