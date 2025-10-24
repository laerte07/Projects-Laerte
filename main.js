// =========================================================
// Funções de modal e listeners
// =========================================================
function liOpenModal() {
  var m = document.getElementById("li-checkout-modal");
  if (m) {
    m.style.display = "flex";
    m.classList.add("show");
    document.body.style.overflow = "hidden";
  }
}

function liCloseModal() {
  var m = document.getElementById("li-checkout-modal");
  if (m) {
    m.style.display = "none";
    m.classList.remove("show");
    document.body.style.overflow = "";
  }
}

// Fechar modal com ESC
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") liCloseModal();
});

// Fechar modal clicando fora
document.addEventListener("click", function (e) {
  if (e.target && e.target.id === "li-checkout-modal") liCloseModal();
});

// =========================================================
// Toggle de Tema Claro/Escuro
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
  const checkbox = document.getElementById("checkbox");

  if (!checkbox) return; // segurança: se não houver switch, não faz nada

  // Carregar preferência salva
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    checkbox.checked = true;
  }

  // Listener para alternar tema
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  });
});

// === THEME TOGGLE (light | dark | dark-luxury) ===
(function () {
  const html = document.documentElement;
  const btn = document.getElementById('theme-toggle');
  const icon = btn.querySelector('.icon');
  const themes = ['light', 'dark', 'dark-luxury'];

  // Detecta tema preferido
  const prefersDark = window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  const saved = localStorage.getItem('theme');
  const current = saved || (prefersDark ? 'dark' : 'light');
  html.setAttribute('data-theme', current);

  // Define ícone inicial
  const icons = {
    light: '☀️',
    dark: '🌙',
    'dark-luxury': '💎'
  };
  icon.textContent = icons[current];

  btn.addEventListener('click', () => {
    // Animação de rotação
    btn.classList.add('rotate');
    setTimeout(() => btn.classList.remove('rotate'), 400);

    // Define próximo tema
    const currentTheme = html.getAttribute('data-theme');
    const nextTheme = themes[(themes.indexOf(currentTheme) + 1) % themes.length];
    html.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);

    // Atualiza ícone
    icon.textContent = icons[nextTheme];

    console.log(`🎨 Tema alterado para: ${nextTheme}`);
  });
})();
