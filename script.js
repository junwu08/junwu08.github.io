document.addEventListener("DOMContentLoaded", function () {
  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const buttons = document.querySelectorAll(".filter-btn");
  const items = document.querySelectorAll(".pub-item");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      items.forEach((item) => {
        if (filter === "all") {
          item.classList.remove("hidden");
          return;
        }

        if (item.classList.contains(filter)) {
          item.classList.remove("hidden");
        } else {
          item.classList.add("hidden");
        }
      });
    });
  });

  const backToTop = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    if (!backToTop) return;

    if (window.scrollY > 500) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  });

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  const avatar = document.querySelector(".bio-avatar");

  if (avatar) {
    avatar.addEventListener("error", () => {
      avatar.style.display = "none";
    });
  }
});
