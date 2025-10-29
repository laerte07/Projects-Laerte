// =========================================================
// 1) CONTADOR REGRESSIVO
// =========================================================
const STORAGE_KEY = 'laerte_offer_expiry';
// Duração da oferta em ms
const OFFER_DURATION = 1727 * 1000; // 28m47s (ajuste como quiser)

const timerElement = document.getElementById('li-countdown');
let countdownInterval;

function getExpiryTime() {
  const raw = localStorage.getItem(STORAGE_KEY);
  const now = Date.now();

  if (raw && now > parseInt(raw, 10)) {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
  if (!raw) {
    const exp = now + OFFER_DURATION;
    localStorage.setItem(STORAGE_KEY, String(exp));
    return exp;
  }
  return parseInt(raw, 10);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function updateCountdown() {
  if (!timerElement) return;

  const expiryTime = getExpiryTime();
  if (!expiryTime) {
    clearInterval(countdownInterval);
    timerElement.style.display = 'none';
    return;
  }

  const distance = expiryTime - Date.now();
  if (distance <= 0) {
    clearInterval(countdownInterval);
    localStorage.removeItem(STORAGE_KEY);
    timerElement.style.display = 'none';
    return;
  }

  const hours   = Math.floor((distance % (1000*60*60*24)) / (1000*60*60));
  const minutes = Math.floor((distance % (1000*60*60)) / (1000*60));
  const seconds = Math.floor((distance % (1000*60)) / 1000);

  setText('li-hours',   String(hours).padStart(2, '0'));
  setText('li-minutes', String(minutes).padStart(2, '0'));
  setText('li-seconds', String(seconds).padStart(2, '0'));
}

// =========================================================
// 2) HOTMART (mantido)
// =========================================================
function openHotmartCheckout(url) {
  if (window.Hotmart && Hotmart.doCheckout) {
    Hotmart.doCheckout(url);
  } else {
    window.location.href = url;
    console.warn('Hotmart widget not ready, redirecting to full checkout.');
  }
}

// =========================================================
// 3) MODAL
//    -> alinhado com o CSS que usa .li-modal-show
// =========================================================
function liOpenModal() {
  const m = document.getElementById('li-checkout-modal');
  if (!m) return;
  if (m.classList.contains('li-modal-show')) return; // já aberto

  m.classList.add('li-modal-show');
  m.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function liCloseModal() {
  const m = document.getElementById('li-checkout-modal');
  if (!m) return;

  m.classList.remove('li-modal-show');
  m.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// ESC fecha
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') liCloseModal();
});

// Clique fora fecha
document.addEventListener('click', (e) => {
  const m = document.getElementById('li-checkout-modal');
  if (!m) return;
  if (e.target === m) liCloseModal();
});

// =========================================================
// 4) TROCA DE TEMA (mantida)
// =========================================================
(function () {
  const html = document.documentElement;
  const switchEl = document.querySelector('.switch');
  const themeToggleContainer = document.querySelector('.theme-toggle');
  if (!themeToggleContainer) return;

  const themes = ['light', 'dark', 'dark-luxury'];
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  const initialTheme = saved || (prefersDark ? 'dark' : 'light');

  html.setAttribute('data-theme', initialTheme);
  if (switchEl) switchEl.setAttribute('data-theme', initialTheme);

  let idx = themes.indexOf(initialTheme);
  if (idx < 0) idx = 0;

  themeToggleContainer.addEventListener('click', () => {
    idx = (idx + 1) % themes.length;
    const next = themes[idx];
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    if (switchEl) switchEl.setAttribute('data-theme', next);
    console.log(`🎨 Tema alterado para: ${next}`);
  });
})();

// =========================================================
// 5) EXIT-INTENT (mantido, evita abrir se já estiver aberto)
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
  // contador
  if (document.getElementById('li-countdown')) {
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
  }

  const isOpen = () => {
    const m = document.getElementById('li-checkout-modal');
    return m && m.classList.contains('li-modal-show');
  };

  const EXIT_DELAY_MS = 200;
  let timeoutId;

  document.body.addEventListener('mouseleave', (e) => {
    if (window.innerWidth < 768) return;
    if (isOpen() || sessionStorage.getItem('liExitPopupShown')) return;
    if (e.clientY < 10) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (!isOpen() && !sessionStorage.getItem('liExitPopupShown')) {
          liOpenModal();
          sessionStorage.setItem('liExitPopupShown', 'true');
          console.log('Pop-up de Saída disparado (mouseleave)!');
        }
      }, EXIT_DELAY_MS);
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 768) return;
    if (isOpen() || sessionStorage.getItem('liExitPopupShown')) return;
    if (e.clientY < 50) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (!isOpen() && !sessionStorage.getItem('liExitPopupShown')) {
          liOpenModal();
          sessionStorage.setItem('liExitPopupShown', 'true');
          console.log('Pop-up de Saída disparado (mousemove fallback)!');
        }
      }, 500);
    }
  });
});
