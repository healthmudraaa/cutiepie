'use client';

import { use, useState, useEffect } from 'react';
import { MOCK_USERS } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';

export default function ChatPage({ params }) {
  const { id } = use(params);
  const user = MOCK_USERS.find(u => u.id === id);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [messageCount, setMessageCount] = useState(0);
  const [showSayHiPrompt, setShowSayHiPrompt] = useState(false);
  const [sayHiSent, setSayHiSent] = useState(false);

  useEffect(() => {
    // Initial greeting
    if (user) {
      setMessages([
        {
          id: 1,
          sender: 'them',
          text: `Hey! I saw your profile 😊`,
          timestamp: new Date(Date.now() - 120000)
        }
      ]);
    }
  }, [user]);

  // Show "Say Hi" prompt after 3-5 messages
  useEffect(() => {
    if (messageCount >= 3 && !showSayHiPrompt && !sayHiSent) {
      setShowSayHiPrompt(true);
    }
  }, [messageCount, showSayHiPrompt, sayHiSent]);

  if (!user) return null;

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      sender: 'me',
      text: inputText,
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setMessageCount(prev => prev + 1);
    setInputText('');

    // Simulate response after user message
    setTimeout(() => {
      const responses = [
        "That's cool! Tell me more 😊",
        "Haha, I love that!",
        "Really? That's interesting!",
        "Same here! 🙌",
        "Oh wow, I didn't know that!"
      ];

      setMessages(prev => [...prev, {
        id: prev.length + 1,
        sender: 'them',
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      }]);
    }, 1500);
  };

  const handleSayHi = () => {
    const sayHiMessage = {
      id: messages.length + 1,
      sender: 'me',
      text: `I'm just ${user.distance} away! 😊 Shall I come say hi?`,
      timestamp: new Date(),
      isSayHi: true
    };

    setMessages([...messages, sayHiMessage]);
    setSayHiSent(true);
    setShowSayHiPrompt(false);

    // Simulate positive response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        sender: 'them',
        text: "Yes! That would be amazing! 🥰",
        timestamp: new Date()
      }]);

      // Show location suggestion
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          sender: 'them',
          text: "I'm at the coffee shop near the park. See you in a bit! ☕",
          timestamp: new Date()
        }]);
      }, 2000);
    }, 2000);
  };

  return (
    <main className="chat-container">
      <header className="chat-header glass">
        <Link href="/" className="back-btn">←</Link>
        <div className="user-info">
          <Image src={user.image} alt={user.name} width={40} height={40} className="avatar" />
          <div>
            <h3>{user.name}</h3>
            <p className="distance-indicator">
              <span className="distance-dot"></span>
              {user.distance} away
            </p>
          </div>
        </div>
        <div className="spacer"></div>
      </header>

      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            <div className={`bubble ${msg.isSayHi ? 'say-hi-bubble' : ''}`}>
              {msg.text}
            </div>
            {msg.isSayHi && (
              <div className="magic-indicator">✨ The Magic Moment</div>
            )}
          </div>
        ))}

        {showSayHiPrompt && (
          <div className="say-hi-prompt">
            <div className="prompt-header">
              <span className="prompt-icon">🎯</span>
              <h4>You're vibing! Time for the magic moment...</h4>
            </div>
            <p className="prompt-text">
              {user.name} is just <strong>{user.distance}</strong> away and approachable!
            </p>
            <button className="say-hi-btn" onClick={handleSayHi}>
              <span className="btn-icon">👋</span>
              <span className="btn-text">Say "Shall I come say hi?"</span>
            </button>
            <button className="continue-chat-btn" onClick={() => setShowSayHiPrompt(false)}>
              Continue chatting
            </button>
          </div>
        )}

        {sayHiSent && (
          <div className="success-banner">
            <span className="success-icon">🎉</span>
            <p>Amazing! You took the leap. This is how real connections happen!</p>
          </div>
        )}
      </div>

      <div className="input-bar glass">
        <input
          type="text"
          placeholder="Type a message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend} className="send-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>

      <style jsx>{`
        .chat-container {
          min-height: 100vh;
          background: var(--bg-dark);
          display: flex;
          flex-direction: column;
        }

        .chat-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          padding: 12px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          z-index: 100;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .back-btn {
          color: white;
          text-decoration: none;
          font-size: 1.5rem;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .avatar {
          border-radius: 50%;
          object-fit: cover;
        }

        .user-info h3 {
          font-size: 1rem;
          margin: 0;
        }

        .distance-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          color: var(--accent);
          margin: 0;
          font-weight: 600;
        }

        .distance-dot {
          width: 8px;
          height: 8px;
          background: var(--accent);
          border-radius: 50%;
          animation: pulse-dot 2s infinite;
        }

        .spacer {
          flex: 1;
        }

        .messages {
          flex: 1;
          padding: 80px 20px 100px;
          overflow-y: auto;
        }

        .message {
          margin-bottom: 16px;
          display: flex;
          flex-direction: column;
        }

        .message.them {
          align-items: flex-start;
        }

        .message.me {
          align-items: flex-end;
        }

        .bubble {
          max-width: 70%;
          padding: 12px 16px;
          border-radius: 20px;
          font-size: 0.95rem;
        }

        .message.them .bubble {
          background: rgba(255,255,255,0.1);
        }

        .message.me .bubble {
          background: var(--primary);
        }

        .say-hi-bubble {
          background: linear-gradient(135deg, var(--accent) 0%, #00CC99 100%) !important;
          color: #000 !important;
          font-weight: 600;
          box-shadow: 0 4px 20px rgba(0, 255, 204, 0.4);
        }

        .magic-indicator {
          font-size: 0.75rem;
          color: var(--accent);
          margin-top: 4px;
          font-weight: 600;
        }

        .say-hi-prompt {
          margin: 20px 0;
          padding: 24px;
          background: linear-gradient(135deg, rgba(0, 255, 204, 0.15) 0%, rgba(0, 255, 204, 0.05) 100%);
          border: 2px solid var(--accent);
          border-radius: 20px;
          text-align: center;
          animation: slideIn 0.5s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .prompt-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .prompt-icon {
          font-size: 1.5rem;
        }

        .prompt-header h4 {
          font-size: 1.1rem;
          margin: 0;
        }

        .prompt-text {
          margin-bottom: 20px;
          opacity: 0.9;
          font-size: 0.95rem;
        }

        .prompt-text strong {
          color: var(--accent);
          font-weight: 700;
        }

        .say-hi-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, var(--accent) 0%, #00CC99 100%);
          border: none;
          border-radius: 16px;
          color: #000;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 10px;
          transition: all 0.3s;
          box-shadow: 0 4px 20px rgba(0, 255, 204, 0.3);
        }

        .say-hi-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 30px rgba(0, 255, 204, 0.5);
        }

        .btn-icon {
          font-size: 1.3rem;
        }

        .continue-chat-btn {
          width: 100%;
          padding: 12px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 12px;
          color: rgba(255,255,255,0.6);
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .continue-chat-btn:hover {
          background: rgba(255,255,255,0.05);
          color: white;
        }

        .success-banner {
          margin: 20px 0;
          padding: 20px;
          background: linear-gradient(135deg, rgba(255, 51, 102, 0.2) 0%, rgba(255, 51, 102, 0.1) 100%);
          border: 2px solid var(--primary);
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          animation: slideIn 0.5s ease-out;
        }

        .success-icon {
          font-size: 1.5rem;
        }

        .success-banner p {
          margin: 0;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .input-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 16px 20px;
          display: flex;
          gap: 12px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        input {
          flex: 1;
          padding: 12px 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px;
          color: white;
          font-size: 0.95rem;
        }

        input:focus {
          outline: none;
          border-color: var(--primary);
        }

        .send-btn {
          width: 48px;
          height: 48px;
          padding: 0;
          background: var(--primary);
          border: none;
          border-radius: 50%;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }

        .send-btn:hover {
          transform: scale(1.1);
        }

        /* Mobile */
        @media (max-width: 768px) {
          .prompt-header h4 {
            font-size: 1rem;
          }

          .say-hi-btn {
            font-size: 0.95rem;
            padding: 14px;
          }
        }
      `}</style>
    </main>
  );
}
