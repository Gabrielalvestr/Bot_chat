import React, { useState, useRef, useEffect } from "react";
import "./ChatWidget.css";

const API_URL = "http://127.0.0.1:5000/api/chat";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [msgs, setMsgs] = useState([
    { from: "bot", text: "Olá! Sou a Ajuda Jurídica. Como posso te orientar?" }
  ]);
  const listRef = useRef(null);

  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [msgs, open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    setMsgs(m => [...m, { from: "you", text }]);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ message: text })
      });

      const txt = await res.text();
      let json;
      try { json = JSON.parse(txt); } catch { throw new Error("Resposta inválida da API"); }
      if (!res.ok || !json.ok) throw new Error(json?.error || `HTTP ${res.status}`);

      setMsgs(m => [...m, { from: "bot", text: json.message }]);
    } catch (err) {
      console.error(err);
      setMsgs(m => [...m, { from: "bot", text: "Falha ao chamar a API. Tente novamente." }]);
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      send();
    }
  }

  return (
    <>
      {/* Botão flutuante */}
      {!open && (
        <button className="aj-fab" onClick={() => setOpen(true)} aria-label="Abrir chat">
          ⚖️
        </button>
      )}

      {open && (
        <div className="aj-backdrop" onClick={() => setOpen(false)}>
          <div className="aj-modal" onClick={(e) => e.stopPropagation()}>
            <header className="aj-header">
              <div>
                <div className="aj-title">Ajuda Jurídica</div>
                <div className="aj-sub">Triagem inicial • Não substitui advogado</div>
              </div>
              <button className="aj-close" onClick={() => setOpen(false)} aria-label="Fechar">×</button>
            </header>

            <div ref={listRef} className="aj-messages">
              {msgs.map((m, i) => (
                <div key={i} className={`aj-msg ${m.from}`}>{m.text}</div>
              ))}
              {loading && <div className="aj-typing">Analisando…</div>}
            </div>

            <div className="aj-input-row">
              <input
                className="aj-input"
                placeholder="Descreva o que aconteceu..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
              />
              <button className="aj-send" onClick={send} disabled={loading} aria-label="Enviar">
                ➤
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
