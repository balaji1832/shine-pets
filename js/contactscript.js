  document.addEventListener("DOMContentLoaded", function () {
    /* =========================
       MODAL OPEN / CLOSE
    ========================= */

    const petModal = document.querySelector(".pet-modal");
    const petModalBox = document.querySelector(".pet-modal-box");

    function openPetModal() {
      if (!petModal || !petModalBox) return;

      petModal.classList.remove("hidden");
      petModal.classList.add("flex");
      document.body.classList.add("overflow-hidden");

      petModalBox.classList.add("scale-95", "opacity-0");

      setTimeout(function () {
        petModalBox.classList.remove("scale-95", "opacity-0");
        petModalBox.classList.add("scale-100", "opacity-100");
      }, 20);
    }

    function closePetModal() {
      if (!petModal || !petModalBox) return;

      petModalBox.classList.remove("scale-100", "opacity-100");
      petModalBox.classList.add("scale-95", "opacity-0");

      setTimeout(function () {
        petModal.classList.add("hidden");
        petModal.classList.remove("flex");
        document.body.classList.remove("overflow-hidden");
      }, 250);
    }

    document.querySelectorAll(".open-pet-modal").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        openPetModal();
      });
    });

    document
      .querySelectorAll(".close-pet-modal, .pet-modal-overlay")
      .forEach(function (btn) {
        btn.addEventListener("click", function () {
          closePetModal();
        });
      });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closePetModal();
      }
    });

    /* =========================
       TOAST MESSAGE
    ========================= */

    function showPetToast(type, title, message) {
      const toast = document.querySelector(".pet-toast");
      const toastIcon = document.querySelector(".pet-toast-icon");
      const toastTitle = document.querySelector(".pet-toast-title");
      const toastMessage = document.querySelector(".pet-toast-message");

      if (!toast || !toastIcon || !toastTitle || !toastMessage) return;

      toastTitle.innerText = title;
      toastMessage.innerText = message;

      if (type === "success") {
        toastIcon.innerText = "✓";
        toastIcon.className =
          "pet-toast-icon flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700";
      } else {
        toastIcon.innerText = "!";
        toastIcon.className =
          "pet-toast-icon flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-700";
      }

      toast.classList.remove("hidden");

      setTimeout(function () {
        toast.classList.remove("opacity-0", "translate-y-[-10px]");
        toast.classList.add("opacity-100", "translate-y-0");
      }, 20);

      clearTimeout(window.petToastTimer);

      window.petToastTimer = setTimeout(function () {
        toast.classList.remove("opacity-100", "translate-y-0");
        toast.classList.add("opacity-0", "translate-y-[-10px]");

        setTimeout(function () {
          toast.classList.add("hidden");
        }, 300);
      }, 3500);
    }

    /* =========================
       FORM SUBMIT
    ========================= */

    document.querySelectorAll(".pet-enquiry-form").forEach(function (form) {
      form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const submitBtn = form.querySelector(".pet-submit-btn");
        const originalBtnText = submitBtn ? submitBtn.innerText : "Send Message";

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerText = "Sending...";
        }

        const formData = new FormData(form);

        try {
          const response = await fetch("pet-enquiry.php", {
            method: "POST",
            body: formData,
          });

          const result = await response.json();

          if (result.status === "success") {
            showPetToast(
              "success",
              "Enquiry Submitted",
              "Thank you! Your enquiry has been submitted successfully."
            );

            form.reset();

            // Close modal only if this form is inside modal
            if (form.closest(".pet-modal")) {
              closePetModal();
            }
          } else {
            showPetToast(
              "error",
              "Submission Failed",
              result.message || "Something went wrong. Please try again."
            );
          }
        } catch (error) {
          showPetToast(
            "error",
            "Server Error",
            "Unable to submit the form. Please try again later."
          );
        }

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = originalBtnText;
        }
      });
    });
  });
