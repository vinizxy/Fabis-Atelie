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

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    closeMenu();
  });
});

/* ---------- visualizador de obras ---------- */
const box = document.querySelector(".lightbox");
const boxImg = box.querySelector("img");
const boxCap = box.querySelector("figcaption");
let group = [];
let index = 0;

function show(i) {
  index = (i + group.length) % group.length;
  const obra = group[index];
  boxImg.src = obra.dataset.full;
  boxImg.alt = obra.dataset.alt;
  boxCap.textContent = obra.dataset.alt;
}

document.querySelectorAll(".obra").forEach((obra) => {
  obra.addEventListener("click", () => {
    group = [...obra.closest(".galeria__grid").querySelectorAll(".obra")];
    show(group.indexOf(obra));
    box.showModal();
  });
});

box.querySelector(".lightbox__close").addEventListener("click", () => box.close());
box.querySelector(".lightbox__nav--prev").addEventListener("click", () => show(index - 1));
box.querySelector(".lightbox__nav--next").addEventListener("click", () => show(index + 1));
box.addEventListener("click", (e) => { if (e.target === box) box.close(); });
box.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") show(index - 1);
  if (e.key === "ArrowRight") show(index + 1);
});
