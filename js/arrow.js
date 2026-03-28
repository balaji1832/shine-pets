//  <!-- Arrow script -->

      const btn = document.getElementById("scrollTopBtn");

      // Show button when scrolling
      window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
          btn.classList.remove("hidden");
          btn.classList.add("flex");
        } else {
          btn.classList.add("hidden");
        }
      });

      // Scroll to top
      btn.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
