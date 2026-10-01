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

/* ---------- galerias: linhas justificadas ---------- */
// Escolhe onde quebrar as linhas para que todas fiquem perto da altura-alvo
// e encostem nas duas bordas, sem cortar nenhuma obra. Sem JS, vale o CSS.
function justificar(grid) {
  const obras = [...grid.querySelectorAll(".obra")];
  const r = obras.map((o) => parseFloat(o.style.getPropertyValue("--r")));
  const W = grid.clientWidth - 1;
  const gap = parseFloat(getComputedStyle(grid).columnGap) || 0;
  const alvo = W < 600 ? 210 : W < 1000 ? 260 : 330;
  const alturaLinha = (i, j) => {
    let soma = 0;
    for (let k = i; k < j; k++) soma += r[k];
    return (W - gap * (j - i - 1)) / soma;
  };

  // melhor[j] = menor custo para arrumar as j primeiras obras
  const melhor = [0];
  const corte = [0];
  for (let j = 1; j <= r.length; j++) {
    melhor[j] = Infinity;
    for (let i = j - 1; i >= 0; i--) {
      const h = alturaLinha(i, j);
      if (h < alvo * 0.55) break;
      const custo = melhor[i] + ((h - alvo) / alvo) ** 2 * (h > alvo ? 1.6 : 1);
      if (custo < melhor[j]) { melhor[j] = custo; corte[j] = i; }
    }
  }

  const linhas = [];
  for (let j = r.length; j > 0; j = corte[j]) linhas.unshift([corte[j], j]);
  linhas.forEach(([i, j]) => {
    const h = alturaLinha(i, j);
    for (let k = i; k < j; k++) {
      obras[k].style.flex = "none";
      obras[k].style.width = `${h * r[k]}px`;
      obras[k].style.height = `${h}px`;
    }
  });
  grid.classList.add("is-justified");
}

const grids = document.querySelectorAll(".galeria__grid");
const observador = new ResizeObserver((entradas) => entradas.forEach((e) => justificar(e.target)));
grids.forEach((g) => observador.observe(g));

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
