(() => {
  const menuButton = document.querySelector("[data-menu-toggle]");
  const navigation = document.querySelector("[data-site-nav]");
  const accessibilityButton = document.querySelector("[data-accessibility-toggle]");
  const accessibilityPanel = document.querySelector("[data-accessibility-panel]");

  const closeAccessibilityPanel = () => {
    if (!accessibilityButton || !accessibilityPanel) return;
    accessibilityButton.setAttribute("aria-expanded", "false");
    accessibilityButton.setAttribute("aria-label", "Abrir opções de acessibilidade");
    accessibilityPanel.hidden = true;
  };

  if (menuButton && navigation) {
    const closeMenu = () => {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Abrir menu");
      menuButton.textContent = "Menu";
      navigation.classList.remove("is-open");
    };

    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      if (!isOpen) closeAccessibilityPanel();
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

  if (accessibilityButton && accessibilityPanel) {
    accessibilityButton.addEventListener("click", () => {
      const isOpen = accessibilityButton.getAttribute("aria-expanded") === "true";
      if (!isOpen && menuButton) {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Abrir menu");
        menuButton.textContent = "Menu";
        navigation?.classList.remove("is-open");
      }
      accessibilityButton.setAttribute("aria-expanded", String(!isOpen));
      accessibilityButton.setAttribute("aria-label", isOpen ? "Abrir opções de acessibilidade" : "Fechar opções de acessibilidade");
      accessibilityPanel.hidden = isOpen;
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest("[data-accessibility-widget]")) closeAccessibilityPanel();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeAccessibilityPanel();
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

  const appointmentStorageKey = "sublimeSaudeAppointmentsV1";
  const consultationList = document.querySelector("[data-consultation-list]");

  const readAppointments = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(appointmentStorageKey) || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  };

  const writeAppointments = (appointments) => {
    try {
      localStorage.setItem(appointmentStorageKey, JSON.stringify(appointments));
      return true;
    } catch {
      announce("Não foi possível salvar neste navegador. Verifique as configurações de armazenamento.");
      return false;
    }
  };

  const formatAppointmentDate = (date) => new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR");

  if (consultationList) {
    const filterButtons = Array.from(document.querySelectorAll("[data-appointment-filter]"));
    let activeStatus = "agendada";

    const renderConsultations = () => {
      consultationList.replaceChildren();
      const appointments = readAppointments().filter((appointment) => appointment.status === activeStatus);

      if (appointments.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "consultation-empty";
        emptyMessage.textContent = activeStatus === "agendada"
          ? "Não há consultas agendadas neste navegador."
          : "Não há consultas canceladas neste navegador.";
        consultationList.append(emptyMessage);
        return;
      }

      appointments.forEach((appointment) => {
        const item = document.createElement("article");
        item.className = "consultation-item";
        item.dataset.status = appointment.status;

        const details = document.createElement("div");
        const heading = document.createElement("h2");
        heading.textContent = appointment.specialty;
        const modality = document.createElement("p");
        modality.textContent = appointment.modality;
        const dateAndTime = document.createElement("p");
        dateAndTime.textContent = `${formatAppointmentDate(appointment.date)} às ${appointment.time}`;
        details.append(heading, modality, dateAndTime);

        if (appointment.unit) {
          const unit = document.createElement("p");
          unit.textContent = appointment.unit;
          details.append(unit);
        }

        const status = document.createElement("p");
        status.textContent = appointment.status === "agendada" ? "Status: Agendada" : "Status: Cancelada";
        details.append(status);
        item.append(details);

        if (appointment.status === "agendada") {
          const cancelButton = document.createElement("button");
          cancelButton.className = "button button-secondary";
          cancelButton.type = "button";
          cancelButton.textContent = "Cancelar consulta";
          cancelButton.addEventListener("click", () => {
            const currentAppointments = readAppointments();
            const selectedAppointment = currentAppointments.find((saved) => saved.id === appointment.id);
            if (!selectedAppointment) return;
            selectedAppointment.status = "cancelada";
            selectedAppointment.cancelledAt = new Date().toISOString();
            if (writeAppointments(currentAppointments)) {
              renderConsultations();
              announce("Simulação de consulta cancelada.");
              filterButtons.find((button) => button.dataset.appointmentFilter === "agendada")?.focus();
            }
          });
          item.append(cancelButton);
        }

        consultationList.append(item);
      });
    };

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        activeStatus = button.dataset.appointmentFilter;
        filterButtons.forEach((filterButton) => {
          filterButton.setAttribute("aria-pressed", String(filterButton === button));
        });
        renderConsultations();
      });
    });

    renderConsultations();
    window.addEventListener("storage", (event) => {
      if (event.key === appointmentStorageKey) renderConsultations();
    });
  }

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

    const appointments = readAppointments();
    appointments.push({
      id: window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      modality: chosenModality,
      specialty: formData.get("especialidade"),
      unit: chosenUnit,
      date: formData.get("data"),
      time: formData.get("horario"),
      status: "agendada"
    });

    if (!writeAppointments(appointments)) return;

    summary.textContent = `${details.join(" | ")}. Salvo neste navegador; nenhum horário real foi reservado.`;
    confirmation.hidden = false;
    confirmation.focus();
    announce("Resumo demonstrativo pronto. Nenhuma consulta foi marcada.");
  });
})();
