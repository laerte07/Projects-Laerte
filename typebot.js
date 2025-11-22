/* <!-- ==============================
     📱 Chatbot Zaia - Laerte Invest
     ============================== -->

<script>
  document.addEventListener("DOMContentLoaded", function () {
    try {
      // 🔹 Configuração principal do widget
      window.ZWidget = {
        AgentURL: "https://platform.zaia.app/embed/chat/70741",
      };

      // 🔹 Carrega o script do widget (igual o da documentação)
      const script = document.createElement("script");
      script.src = "https://platform.zaia.app/script/widget-loader.js";
      script.defer = true;
      document.body.appendChild(script);

      // 🔹 Espera o widget estar pronto para enviar dados customizados
      window.addEventListener("message", function (event) {
        if (event.data?.type === "widget-data" && window.ZWidget?.setCustomData) {
          window.ZWidget.setCustomData({
            userId: 222,
            userData: JSON.stringify({
              name: "Laerte Invest",
              origem: "Site Oficial",
              interesse: "Investimentos com IA",
            }),
          });
        }
      });

      console.log("💬 Zaia Widget iniciado com sucesso!"); */
    } catch (err) {
      console.error("❌ Erro ao iniciar o widget da Zaia:", err);
    }
  });
</script>
