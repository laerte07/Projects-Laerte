// =========================================================
// =========== 1. LÓGICA DO CONTADOR REGRESSIVO ============
// =========================================================

const STORAGE_KEY = 'laerte_offer_expiry';

// Duração da oferta em MILISSEGUNDOS: 1727 segundos * 1000 ms/seg
const OFFER_DURATION = 1727 * 1000; 

// Elementos do DOM (Verifique se esses IDs existem no seu index.html!)
const timerElement = document.getElementById('li-countdown');
// REMOVEMOS: const expiredElement = document.getElementById('li-timer-expired');
let countdownInterval;

// Verifica, cria ou limpa o tempo de expiração no LocalStorage
function getExpiryTime() {
    let expiryTime = localStorage.getItem(STORAGE_KEY);
    
    // 1. VERIFICAÇÃO DE EXPIRAÇÃO: Se o tempo atual é maior que o tempo de expiração salvo
    if (expiryTime && new Date().getTime() > parseInt(expiryTime)) {
        // Se a expiração ocorreu, removemos o registro para forçar um novo ciclo (reinício)
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
    // Agora só precisamos verificar se o elemento do TIMER existe
    if (!timerElement) return;

    const expiryTime = getExpiryTime();
    
    if (!expiryTime) {
        // Caso o getExpiryTime tenha limpado a chave (tempo expirou)
        clearInterval(countdownInterval);
        
        // Aqui, em vez de mostrar a mensagem de expiração, apenas esconde o contador.
        timerElement.style.display = 'none'; 
        
        // Você pode inserir aqui o código para esconder o header/hero inteiro se desejar.
        return;
    }

    const now = new Date().getTime();
    const distance = expiryTime - now;

    if (distance <= 0) {
        // Tempo acabou
        clearInterval(countdownInterval);
        localStorage.removeItem(STORAGE_KEY); // Limpa para permitir reinício
        
        // Esconde o contador.
        timerElement.style.display = 'none';
        
        // Se a oferta não deve mais aparecer, você deve esconder o elemento pai.
        return;
    }

    // Cálculo e preenchimento dos elementos HTML (Correto)
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
// =========== 2. FUNÇÃO HOTMART (ADICIONADA) ==============
// =========================================================

/**
 * ✅ FUNÇÃO HOTMART: Aciona o checkout em modo modal/pop-up.
 * @param {string} url - A URL do checkout da Hotmart com ?checkoutMode=10.
 */
function openHotmartCheckout(url) {
    if (window.Hotmart && Hotmart.doCheckout) {
        // Usa a API do widget Hotmart (preferencial)
        Hotmart.doCheckout(url);
    } else {
        // Fallback: Se o script ainda não carregou, redireciona diretamente
        window.location.href = url; 
        console.warn("Hotmart widget not ready, redirecting to full checkout.");
    }
}


// =========================================================
// Funções de modal e listeners (MANTIDAS)
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

// =========================================================
// 3. LÓGICA DO POP-UP DE SAÍDA (EXIT-INTENT) - MANTIDA
// =========================================================

document.addEventListener("DOMContentLoaded", function () {
    // Continua a lógica do Exit-Intent
    if (typeof liOpenModal === 'function') {
        
        const EXIT_DELAY_MS = 200; // Um pequeno delay
        let timeoutId;
        
        // Tentativa 1: Monitora a saída do mouse de TODO o documento
        document.body.addEventListener('mouseleave', function(e) {
            
            // Apenas para desktop e se não foi mostrado
            if (window.innerWidth >= 768 && !sessionStorage.getItem('liExitPopupShown')) {
                
                // Verifica a coordenada Y (se o mouse saiu pela parte superior)
                if (e.clientY < 10) { // Um limite bem próximo do topo
                    
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(() => {
                        if (!sessionStorage.getItem('liExitPopupShown')) {
                            liOpenModal();
                            sessionStorage.setItem('liExitPopupShown', 'true');
                            console.log("Pop-up de Saída disparado (mouseleave)!");
                        }
                    }, EXIT_DELAY_MS);
                }
            }
        });

        // Tentativa 2: Fallback (monitora o movimento do mouse para a borda superior)
        document.addEventListener('mousemove', function(e) {
            if (window.innerWidth >= 768 && e.clientY < 50) {
                if (!sessionStorage.getItem('liExitPopupShown')) {
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(() => {
                        if (!sessionStorage.getItem('liExitPopupShown')) {
                            liOpenModal();
                            sessionStorage.setItem('liExitPopupShown', 'true');
                            console.log("Pop-up de Saída disparado (mousemove fallback)!");
                        }
                    }, 500); // Aumentamos o delay neste para maior certeza
                }
            }
        });
        
    } else {
        console.warn("Função liOpenModal não está definida. O Exit-Intent não foi iniciado.");
    }
});
