document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    closeMenu();
  });
});

const burger = document.querySelector(".nav__burger");
const menu = document.querySelector(".menu-mobile");

function closeMenu() {
  burger.setAttribute("aria-expanded", "false");
  menu.classList.remove("menu-mobile--open");
}

burger.addEventListener("click", () => {
  const open = burger.getAttribute("aria-expanded") === "true";
  burger.setAttribute("aria-expanded", String(!open));
  menu.classList.toggle("menu-mobile--open", !open);
});
