// =========================================================
// =========== 1. LÓGICA DO CONTADOR REGRESSIVO ============
// =========================================================

const STORAGE_KEY = 'laerte_offer_expiry';
// Duração da oferta em MILISSEGUNDOS (24 horas)
const OFFER_DURATION = 24 * 60 * 60 * 1000; 

// Elementos do DOM (Verifique se esses IDs existem no seu index.html!)
const timerElement = document.getElementById('li-countdown');
const expiredElement = document.getElementById('li-timer-expired');
let countdownInterval;

// Verifica, cria ou limpa o tempo de expiração no LocalStorage
function getExpiryTime() {
    let expiryTime = localStorage.getItem(STORAGE_KEY);
    
    // 1. A oferta já expirou? (Tempo atual é maior que o tempo de expiração salvo)
    if (expiryTime && new Date().getTime() > parseInt(expiryTime) + (24 * 60 * 60 * 1000)) {
        // Se a expiração foi há mais de 24h (para evitar que reinicie em todo F5 se o usuário só voltou), 
        // ou você pode simplesmente limpar se distance <= 0
        localStorage.removeItem(STORAGE_KEY);
        return null; 
    }

    // 2. Não há tempo registrado? Cria um novo tempo de expiração (REINÍCIO)
    if (!expiryTime) {
        const newExpiryTime = new Date().getTime() + OFFER_DURATION;
        localStorage.setItem(STORAGE_KEY, newExpiryTime);
        return newExpiryTime;
    }

    // 3. Retorna o tempo existente (NÃO REINICIA)
    return parseInt(expiryTime);
}

function updateCountdown() {
    // Sai da função se os elementos HTML não forem encontrados (erro seguro)
    if (!timerElement || !expiredElement) return;

    const expiryTime = getExpiryTime();
    
    if (!expiryTime) {
        // Caso o getExpiryTime tenha limpado a chave ou o tempo acabou
        clearInterval(countdownInterval);
        timerElement.style.display = 'none';
        expiredElement.style.display = 'block';
        // Você pode adicionar aqui uma lógica para que a oferta reinicie (ex: 24h após a expiração)
        return;
    }

    const now = new Date().getTime();
    const distance = expiryTime - now;

    if (distance <= 0) {
        // Tempo acabou
        clearInterval(countdownInterval);
        localStorage.removeItem(STORAGE_KEY); // Limpa para permitir reinício
        timerElement.style.display = 'none';
        expiredElement.style.display = 'block';
        return;
    }

    // Cálculo e preenchimento dos elementos HTML
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('li-hours').innerText = String(hours).padStart(2, '0');
    document.getElementById('li-minutes').innerText = String(minutes).padStart(2, '0');
    document.getElementById('li-seconds').innerText = String(seconds).padStart(2, '0');
}

// Inicia o contador apenas após o DOM estar pronto
document.addEventListener("DOMContentLoaded", function () {
    // Certifica de que os elementos existem antes de começar
    if (document.getElementById('li-countdown')) {
        updateCountdown();
        countdownInterval = setInterval(updateCountdown, 1000); 
    }
});


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

// === THEME TOGGLE 3 MODOS (light | dark | dark-luxury) ===
(function () {
  const html = document.documentElement;
  const chk = document.querySelector('.switch input[type="checkbox"]');
  const switchEl = document.querySelector('.switch');
  if (!chk) return;

  const themes = ['light', 'dark', 'dark-luxury'];
  const prefersDark = window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  const saved = localStorage.getItem('theme');
  const current = saved || (prefersDark ? 'dark' : 'light');
  html.setAttribute('data-theme', current);
  switchEl.setAttribute('data-theme', current);

  chk.checked = (current === 'light');

  chk.addEventListener('change', () => {
    const currentTheme = html.getAttribute('data-theme');
    const nextTheme = themes[(themes.indexOf(currentTheme) + 1) % themes.length];

    html.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
    switchEl.setAttribute('data-theme', nextTheme);

    console.log(`🎨 Tema alterado para: ${nextTheme}`);
  });
})();
