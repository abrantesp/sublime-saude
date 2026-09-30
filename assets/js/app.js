(() => {
  const menuButton = document.querySelector("[data-menu-toggle]");
  const navigation = document.querySelector("[data-site-nav]");

  if (menuButton && navigation) {
    const closeMenu = () => {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Abrir menu");
      menuButton.textContent = "Menu";
      navigation.classList.remove("is-open");
    };

    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
      menuButton.textContent = isOpen ? "Menu" : "Fechar menu";
      navigation.classList.toggle("is-open", !isOpen);
    });

    navigation.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  const status = document.querySelector("[data-accessibility-status]");
  const announce = (message) => {
    if (status) status.textContent = message;
  };

  document.querySelectorAll('[data-action="speak"]').forEach((button) => {
    button.addEventListener("click", () => {
      if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
        announce("A leitura em voz alta não está disponível neste navegador. Use o leitor de tela do dispositivo.");
        return;
      }

      const main = document.querySelector("main");
      const text = main ? main.innerText.replace(/\s+/g, " ").trim() : "";
      if (!text) {
        announce("Não há conteúdo para ler nesta página.");
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pt-BR";
      utterance.rate = 0.92;
      const portugueseVoice = window.speechSynthesis.getVoices().find((voice) => voice.lang.toLowerCase().startsWith("pt-br"));
      if (portugueseVoice) utterance.voice = portugueseVoice;
      utterance.onstart = () => announce("Leitura da página iniciada.");
      utterance.onend = () => announce("Leitura da página concluída.");
      utterance.onerror = (event) => {
        if (event.error !== "canceled" && event.error !== "interrupted") {
          announce("Não foi possível iniciar a leitura. Verifique o suporte de voz do dispositivo.");
        }
      };
      window.speechSynthesis.speak(utterance);
    });
  });

  document.querySelectorAll('[data-action="stop-speaking"]').forEach((button) => {
    button.addEventListener("click", () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      announce("Leitura interrompida.");
    });
  });

  document.querySelectorAll('[data-action="text-size"]').forEach((button) => {
    button.addEventListener("click", () => {
      const enabled = document.body.classList.toggle("text-large");
      button.setAttribute("aria-pressed", String(enabled));
      button.textContent = enabled ? "Texto padrão" : "Aumentar texto";
      announce(enabled ? "Texto ampliado." : "Tamanho de texto padrão restaurado.");
    });
  });

  document.querySelectorAll('[data-action="contrast"]').forEach((button) => {
    button.addEventListener("click", () => {
      const enabled = document.body.classList.toggle("high-contrast");
      button.setAttribute("aria-pressed", String(enabled));
      button.textContent = enabled ? "Contraste padrão" : "Alto contraste";
      announce(enabled ? "Alto contraste ativado." : "Contraste padrao restaurado.");
    });
  });

  const form = document.querySelector("#appointment-form");
  if (!form) return;

  const modality = form.querySelector("#modalidade");
  const unitField = form.querySelector("#unit-field");
  const unit = form.querySelector("#unidade");
  const date = form.querySelector("#data");
  const confirmation = document.querySelector("#confirmation");
  const summary = document.querySelector("#confirmation-summary");
  const today = new Date();
  const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  date.min = localDate;

  const query = new URLSearchParams(window.location.search);
  const requestedModality = query.get("modalidade");
  if (["presencial", "online"].includes(requestedModality)) modality.value = requestedModality;

  const specialty = form.querySelector("#especialidade");
  const requestedSpecialty = query.get("especialidade");
  if (requestedSpecialty) {
    const option = Array.from(specialty.options).find((item) => item.value.toLocaleLowerCase("pt-BR") === requestedSpecialty.toLocaleLowerCase("pt-BR"));
    if (option) specialty.value = option.value;
  }

  const updateUnit = () => {
    const isInPerson = modality.value === "presencial";
    unitField.hidden = !isInPerson;
    unit.required = isInPerson;
    if (!isInPerson) unit.value = "";
  };

  modality.addEventListener("change", updateUnit);
  updateUnit();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    const chosenDate = new Date(`${formData.get("data")}T12:00:00`).toLocaleDateString("pt-BR");
    const chosenModality = formData.get("modalidade") === "online" ? "Online" : "Presencial";
    const chosenUnit = formData.get("unidade");
    const details = [
      `${chosenModality} - ${formData.get("especialidade")}`,
      chosenUnit ? chosenUnit : "",
      `${chosenDate} às ${formData.get("horario")}`
    ].filter(Boolean);

    summary.textContent = `${details.join(" | ")}. Esta é apenas uma simulação; nenhum atendimento foi marcado.`;
    confirmation.hidden = false;
    confirmation.focus();
    announce("Resumo demonstrativo pronto. Nenhuma consulta foi marcada.");
  });
})();
