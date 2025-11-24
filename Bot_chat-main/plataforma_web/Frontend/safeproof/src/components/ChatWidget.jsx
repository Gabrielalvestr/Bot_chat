import React, { useState, useRef, useEffect } from "react";
import "./ChatWidget.css";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Olá! Sou a Ajuda Jurídica. Descreva sua situação e eu digo os primeiros passos." },
  ]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef(null);

  const CHAT_API = process.env.REACT_APP_CHAT_API;

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setIsLoading(true)
    const newUserMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, newUserMsg]);
    setInput("");
    setError("");

    try {
      const res = await fetch(CHAT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      if (data.ok) {
        setMessages((prev) => [...prev, { sender: "bot", text: data.message }]);
      } else {
        throw new Error(data.error || "Erro na resposta da API");
      }
    } catch (err) {
      console.error(err);
      setError("Falha ao chamar a API. Veja o console (F12) para detalhes.");
      setMessages((prev) => [...prev, { sender: "bot", text: "Falha ao chamar a API." }]);
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <>
      {/* 🔘 BOTÃO FLUTUANTE */}
      {!open && (
        <button className="chat-floating-btn" onClick={() => setOpen(true)}>
          ⚖️
        </button>
      )}

      {/* 💬 JANELA DO CHAT */}
      {open && (
        <div className="chat-widget chat-enter">
          <div className="chat-header">
            <div>
              <div className="chat-title">Ajuda Jurídica</div>
              <div className="chat-subtitle">Triagem inicial • Não substitui advogado</div>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`msg ${msg.sender}`}>
                {isLoading && <AiOutlineLoading3Quarters className='girar' color='black' size={15} />}
                {msg.text}
              </div>
            ))}

            <div ref={bottomRef} />
          </div>

          <div className="chat-footer">
            <div className="chat-input-row">
              <input
                type="text"
                className="chat-input"
                placeholder="Digite sua dúvida..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button className="chat-send" onClick={handleSend}>Enviar</button>
            </div>
            {error && <div className="chat-error">{error}</div>}
          </div>
        </div>
      )}
    </>
  );
}

export default ChatWidget;
