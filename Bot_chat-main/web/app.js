const API = "http://127.0.0.1:5000/api/chat";

/* util */
const pad = (n) => (n < 10 ? "0"+n : ""+n);
const nowTime = () => {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

/* pega sempre elementos do popup */
function getEls() {
  const overlay = document.getElementById("overlay");
  return {
    overlay,
    chat:  overlay.querySelector("#chat"),
    form:  overlay.querySelector("#form"),
    msg:   overlay.querySelector("#msg"),
    open:  document.getElementById("openPopup"),
    close: document.getElementById("closePopup"),
    typing: overlay.querySelector("#typing"),
  };
}

/* montar mensagem */
function addMsg(role, text) {
  const { chat } = getEls();
  const item = document.createElement("div");
  item.className = `msg ${role}`;
  const avatar = role === "user" ? "🙂" : "⚖️";
  item.innerHTML = `
    <div class="avatar">${avatar}</div>
    <div class="bubble-wrap">
      <div class="bubble">${String(text).replace(/\n/g, "<br>")}</div>
      <div class="meta">${role === "user" ? "Você" : "Ajuda Jurídica"} • ${nowTime()}</div>
    </div>
  `;
  chat.appendChild(item);
  chat.scrollTop = chat.scrollHeight;
}

/* indicador “digitando” */
function setTyping(on=true) {
  const { typing } = getEls();
  if (!typing) return;
  typing.hidden = !on;
}

/* enviar mensagem */
function wireForm() {
  const { form, msg } = getEls();
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = msg.value.trim();
    if (!text) return;

    addMsg("user", text);
    msg.value = "";
    setTyping(true);

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ message: text })
      });
      const json = await res.json();
      setTyping(false);

      if (!json.ok) throw new Error(json.error || "Falha na API");
      addMsg("bot", json.message);
    } catch (err) {
      setTyping(false);
      addMsg("bot", "Não foi possível processar agora. Tente novamente.");
      console.error(err);
    }
  });
}

/* abrir/fechar popup */
function wirePopup() {
  const { overlay, open, close } = getEls();
  if (!overlay || !open || !close) return;

  const openOverlay  = () => {
    overlay.classList.add("is-open");
    document.body.classList.add("no-scroll");
  };
  const closeOverlay = () => {
    overlay.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
  };

  open.addEventListener("click", openOverlay);
  close.addEventListener("click", closeOverlay);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeOverlay();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("is-open")) closeOverlay();
  });

  // opcional: abrir já de primeira
  // openOverlay();
}

/* iniciar */
wirePopup();
wireForm();
