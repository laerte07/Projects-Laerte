// Typebot carregado como módulo (arquivo separado)
export default async function loadTypebot() {
  try {
    // ALTERAÇÃO AQUI: Removemos o '@0' para garantir a versão mais recente
    const { default: Typebot } = await import(
      "https://cdn.jsdelivr.net/npm/@typebot.io/js/dist/web.js"
    );

    Typebot.initBubble({
      typebot: "atendimento-ia-invest-osmz6q0",
      previewMessage: {
        message: " Olá! Sou a IA da Laerte Invest. Posso te ajudar a investir melhor?",
        autoShowDelay: 2000,
        // O parâmetro closeDelay está correto e deve funcionar com a versão mais recente
        closeDelay: 5000, 
      },
      theme: {
        button: {
          customIconSrc:
            "https://s3.typebot.io/public/workspaces/cmcxlr6lm002xjx04bs33ner1/typebots/ogrozwlcyhhwqdu5sunxlor5/bubble-icon?v=1753189534454",
          backgroundColor: "rgba(255, 255, 255, 0.4)",
          size: "64px",
          animation: "pulse 2s infinite",
        },
        chatWindow: {
          backgroundColor: "rgba(255, 255, 255, 0.75)",
          backdropFilter: "blur(18px) saturate(160%)",
          borderRadius: "12px",
          textColor: "#1e1e1e",
          width: "380px",
          height: "580px",
        },
        brand: {
          color: "#3cbed0",
        },
      },
      autoOpen: false,
      openOnLoadDelay: 0,
    });

    /* animação de pulsar */
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes pulse {
        0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(60,190,208,0.4); }
        70% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(60,190,208,0); }
        100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(60,190,208,0); }
      }
    `;
    document.head.appendChild(style);
  } catch (error) {
    console.error("❌ Erro ao carregar o Typebot:", error);
  }
}

// Auto-inicializa ao carregar o DOM
document.addEventListener("DOMContentLoaded", function () {
  loadTypebot();
});
