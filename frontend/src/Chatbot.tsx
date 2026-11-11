
import { useState } from 'react'

type Message = {
  id: number
  sender: 'user' | 'bot'
  text: string
}

const AI_API_URL = 'http://localhost:8000'

function RobotIllustration() {
  return (
    <svg
      className="chatbot-robot"
      viewBox="0 0 300 280"
      role="img"
      aria-label="Bluehouse AI friendly robot"
    >
      <defs>
        <linearGradient id="robotBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#dceaff" />
          <stop offset="100%" stopColor="#8db9f5" />
        </linearGradient>
        <linearGradient id="robotBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#36a5ff" />
          <stop offset="100%" stopColor="#174be8" />
        </linearGradient>
        <linearGradient id="robotFace" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#102b55" />
          <stop offset="100%" stopColor="#07152f" />
        </linearGradient>
        <filter id="robotShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="9" stdDeviation="8" floodColor="#3769bd" floodOpacity=".22" />
        </filter>
      </defs>

      {/* Antenna */}
      <path d="M145 44 L145 24" stroke="#398cff" strokeWidth="5" strokeLinecap="round" />
      <circle cx="145" cy="17" r="9" fill="url(#robotBlue)" />
      <circle cx="142" cy="14" r="3" fill="#ffffff" opacity=".8" />

      {/* Waving arm */}
      <path d="M83 168 Q55 155 43 126" fill="none" stroke="#75aef4" strokeWidth="22" strokeLinecap="round" />
      <path d="M83 168 Q55 155 43 126" fill="none" stroke="url(#robotBody)" strokeWidth="16" strokeLinecap="round" />
      <path d="M38 125 Q21 113 27 96 Q31 84 43 91 L55 102 Q65 112 56 126 Q49 135 38 125Z" fill="url(#robotBody)" stroke="#8bb9f2" strokeWidth="3" />
      <path d="M32 101 L25 88 M43 96 L42 82 M52 105 L62 96" stroke="#3c91f6" strokeWidth="5" strokeLinecap="round" />

      {/* Other arm */}
      <path d="M207 164 Q229 177 239 198" fill="none" stroke="url(#robotBody)" strokeWidth="19" strokeLinecap="round" />
      <circle cx="242" cy="204" r="13" fill="url(#robotBlue)" />

      {/* Body */}
      <g filter="url(#robotShadow)">
        <path d="M91 174 Q91 157 111 157 H180 Q201 157 201 179 V250 Q201 266 184 266 H108 Q91 266 91 250Z" fill="url(#robotBody)" stroke="#a5c8f5" strokeWidth="3" />
        <path d="M109 188 Q146 174 183 188" fill="none" stroke="#ffffff" strokeWidth="5" opacity=".8" />
        <circle cx="145" cy="225" r="21" fill="url(#robotBlue)" />
        <path d="M135 225 L142 232 L156 216" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Head side pieces */}
      <rect x="52" y="83" width="27" height="76" rx="13" fill="url(#robotBlue)" />
      <rect x="214" y="83" width="27" height="76" rx="13" fill="url(#robotBlue)" />
      <rect x="60" y="101" width="10" height="39" rx="5" fill="#8bd5ff" />
      <rect x="222" y="101" width="10" height="39" rx="5" fill="#8bd5ff" />

      {/* Head */}
      <g filter="url(#robotShadow)">
        <rect x="66" y="48" width="161" height="139" rx="47" fill="url(#robotBody)" stroke="#a7c9f5" strokeWidth="3" />
        <rect x="79" y="63" width="135" height="105" rx="37" fill="url(#robotFace)" />
        <path d="M94 76 Q145 53 195 76" fill="none" stroke="#ffffff" strokeWidth="5" opacity=".45" />
        <ellipse cx="117" cy="111" rx="12" ry="16" fill="#36dcff" />
        <ellipse cx="176" cy="111" rx="12" ry="16" fill="#36dcff" />
        <path d="M124 137 Q146 155 169 137" fill="none" stroke="#48dcff" strokeWidth="6" strokeLinecap="round" />
        <circle cx="113" cy="106" r="4" fill="#ffffff" opacity=".8" />
        <circle cx="172" cy="106" r="4" fill="#ffffff" opacity=".8" />
      </g>

      {/* Small decorative sparkles */}
      <path d="M22 63 L27 75 L39 80 L27 85 L22 97 L17 85 L5 80 L17 75Z" fill="#398cff" />
      <path d="M258 91 L262 101 L272 105 L262 109 L258 119 L254 109 L244 105 L254 101Z" fill="#7c8dff" />
    </svg>
  )
}

function Chatbot() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [showConversation, setShowConversation] = useState(false)

  const sendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const question = input.trim()
    if (!question || loading) return

    setMessages((previous) => [
      ...previous,
      { id: Date.now(), sender: 'user', text: question },
    ])
    setShowConversation(true)
    setInput('')
    setLoading(true)

    try {
      const response = await fetch(`${AI_API_URL}/agent/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question }),
      })

      if (!response.ok) {
        throw new Error(`AI assistant error (${response.status}).`)
      }

      const data = await response.json()
      const answer =
        data.response ??
        data.answer ??
        data.message ??
        data.output ??
        data.result

      if (typeof answer !== 'string') {
        throw new Error('Unexpected response from AI assistant.')
      }

      setMessages((previous) => [
        ...previous,
        { id: Date.now() + 1, sender: 'bot', text: answer },
      ])
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text:
            error instanceof Error
              ? error.message
              : 'Unable to connect to Bluehouse AI.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="chatbot-section" id="ai-assistant">
      <div className="chatbot-showcase">
        <div className="chatbot-robot-area">
          <RobotIllustration />
          <div className="chatbot-greeting">
            <strong>Hello! 👋</strong>
            <span>How can I help you?</span>
          </div>
        </div>

        <div className="chatbot-intro">
          <span className="chatbot-eyebrow">✦ MEET OUR AI ASSISTANT</span>
          <h2>
            Need a hand? Let's chat.
          </h2>
          <p>
            Get instant answers about Bluehouse, our products,
            services and more.
          </p>
        </div>

        <div className="chatbot-action">
          <form className="chatbot-input-area" onSubmit={sendMessage}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type your message..."
              disabled={loading}
              aria-label="Type your message"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              aria-label="Send message"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 11.5L21 3L14 21L11 13L3 11.5Z" />
                <path d="M11 13L21 3" />
              </svg>
            </button>
          </form>
          <div className="chatbot-footer">
            <span>✦</span> Powered by Bluehouse AI
          </div>
        </div>
      </div>

      {showConversation && (
        <div className="chatbot-conversation">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`chatbot-message ${message.sender}`}
            >
              {message.sender === 'bot' && <span>🤖</span>}
              <p>{message.text}</p>
            </div>
          ))}
          {loading && (
            <div className="chatbot-message bot">
              <span>🤖</span>
              <p>Thinking...</p>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default Chatbot
