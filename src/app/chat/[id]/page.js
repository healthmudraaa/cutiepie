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
    // Generate personalized message with specific locations
    const getPersonalizedMessage = () => {
      const messages = [
        `I can see you from here - just ${user.distance} away on your right! 😊 Shall I come and say hi?`,
        `Hey! I'm at the 1st floor, can see you from here - ${user.distance} away! 😊 Shall I come say hi?`,
        `I can see you there! Just ${user.distance} away, near the entrance 😊 Shall I come over?`,
        `Spotted you! I'm ${user.distance} away, by the coffee counter 😊 Shall I come say hi?`,
        `I can see you from here - ${user.distance} away, on your left side! 😊 Can I come say hi?`,
        `Hey! Just ${user.distance} away, I'm near the window 😊 Shall I come over and say hi?`,
        `I can see you! ${user.distance} away, sitting on the right 😊 Shall I come say hi?`,
        `I'm on the 2nd floor - ${user.distance} away, can see you from here! 😊 Shall I come down?`
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    };

    const sayHiMessage = {
      id: messages.length + 1,
      sender: 'me',
      text: getPersonalizedMessage(),
      timestamp: new Date(),
      isSayHi: true
    };

    setMessages([...messages, sayHiMessage]);
    setSayHiSent(true);
    setShowSayHiPrompt(false);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        sender: 'them',
        text: "Yes! That would be amazing! 🥰",
        timestamp: new Date()
      }]);

      setTimeout(() => {
        // Generate varied location responses with specific details
        const getLocationResponse = () => {
          if (user.currentEvent) {
            const responses = [
              `Perfect! I'm at ${user.currentEvent}, sitting near the window! 😊`,
              `Yes! I'm at ${user.currentEvent}, you'll find me at the corner table! 😊`,
              `Great! I'm at ${user.currentEvent}, near the entrance on the left! 😊`,
              `Come over! I'm at ${user.currentEvent}, by the counter! 😊`,
              `I'm at ${user.currentEvent}, sitting on the right side! See you! 😊`
            ];
            return responses[Math.floor(Math.random() * responses.length)];
          } else {
            const responses = [
              `I'm near ${user.location.split(',')[0]}, by the main road! See you in a minute! 😊`,
              `I'm at ${user.location.split(',')[0]}, near the coffee shop! Coming? 😊`,
              `I'm near ${user.location.split(',')[0]}, you'll spot me easily! 😊`,
              `I'm at ${user.location.split(',')[0]}, standing near the entrance! 😊`,
              `I'm near ${user.location.split(',')[0]}, on the ground floor! See you! 😊`
            ];
            return responses[Math.floor(Math.random() * responses.length)];
          }
        };

        setMessages(prev => [...prev, {
          id: prev.length + 1,
          sender: 'them',
          text: getLocationResponse(),
          timestamp: new Date()
        }]);
      }, 2000);
    }, 2000);
  };

  return (
    <main className="chat-page">
      <header className="chat-header">
        <Link href="/" className="back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="user-info">
          <div className="avatar-wrapper">
            <Image src={user.image} alt={user.name} width={44} height={44} className="avatar" />
            {user.status === 'APPROACHABLE' && <span className="online-dot"></span>}
          </div>
          <div className="user-details">
            <h3 className="user-name">{user.name}</h3>
            <p className="distance-text">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" />
              </svg>
              {user.distance} away
            </p>
          </div>
        </div>
        <div className="spacer"></div>
      </header>

      <div className="messages-container">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            <div className={`bubble ${msg.isSayHi ? 'say-hi-bubble' : ''}`}>
              {msg.text}
            </div>
            {msg.isSayHi && (
              <div className="magic-label">✨ The Magic Moment</div>
            )}
          </div>
        ))}

        {showSayHiPrompt && (
          <div className="say-hi-card">
            <div className="card-header">
              <span className="card-icon">🎯</span>
              <h4 className="card-title">You're vibing! Time for the magic moment...</h4>
            </div>
            <p className="card-text">
              {user.name} is just <strong>{user.distance}</strong> away and available!
            </p>
            <button className="say-hi-btn" onClick={handleSayHi}>
              <span className="btn-icon">👋</span>
              <span>Say "Shall I come say hi?"</span>
            </button>
            <button className="continue-btn" onClick={() => setShowSayHiPrompt(false)}>
              Continue chatting
            </button>
          </div>
        )}

        {sayHiSent && (
          <div className="success-card">
            <span className="success-icon">🎉</span>
            <p>Amazing! You took the leap. This is how real connections happen!</p>
          </div>
        )}
      </div>

      <div className="input-container">
        <input
          type="text"
          placeholder="Type a message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className="message-input"
        />
        <button onClick={handleSend} className="send-btn">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>

      <style jsx>{`
        .chat-page {
          min-height: 100vh;
          background: var(--bg-primary);
          display: flex;
          flex-direction: column;
        }

        .chat-header {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-lg) var(--spacing-xl);
          background: var(--white);
          border-bottom: 2px solid var(--light-gray);
          box-shadow: var(--shadow-sm);
        }

        .back-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--light-gray);
          color: var(--dark-gray);
          transition: all var(--transition-base);
        }

        .back-btn:hover {
          background: var(--primary);
          color: var(--white);
          transform: translateX(-2px);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          flex: 1;
        }

        .avatar-wrapper {
          position: relative;
        }

        .avatar {
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid var(--light-gray);
        }

        .online-dot {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 14px;
          height: 14px;
          background: var(--success);
          border: 3px solid var(--white);
          border-radius: 50%;
          animation: pulse-bright 2s infinite;
        }

        .user-details {
          flex: 1;
        }

        .user-name {
          font-size: 1.1rem;
          font-weight: var(--font-weight-bold);
          color: var(--black);
          margin: 0;
        }

        .distance-text {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.9rem;
          color: var(--gray);
          font-weight: var(--font-weight-medium);
          margin: 0;
        }

        .messages-container {
          flex: 1;
          padding: var(--spacing-xl) var(--spacing-lg);
          overflow-y: auto;
          max-width: 800px;
          width: 100%;
          margin: 0 auto;
        }

        .message {
          margin-bottom: var(--spacing-lg);
          display: flex;
          flex-direction: column;
          animation: slideUp 0.3s ease-out;
        }

        .message.them {
          align-items: flex-start;
        }

        .message.me {
          align-items: flex-end;
        }

        .bubble {
          max-width: 70%;
          padding: var(--spacing-md) var(--spacing-lg);
          border-radius: var(--radius-lg);
          font-size: 1rem;
          line-height: 1.5;
        }

        .message.them .bubble {
          background: var(--light-gray);
          color: var(--black);
          border-bottom-left-radius: 4px;
        }

        .message.me .bubble {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: var(--white);
          border-bottom-right-radius: 4px;
          box-shadow: var(--shadow-primary);
        }

        .say-hi-bubble {
          background: linear-gradient(135deg, var(--secondary) 0%, var(--success) 100%) !important;
          color: var(--white) !important;
          font-weight: var(--font-weight-semibold);
          box-shadow: var(--shadow-secondary) !important;
        }

        .magic-label {
          font-size: 0.8rem;
          color: var(--secondary);
          margin-top: 4px;
          font-weight: var(--font-weight-semibold);
        }

        .say-hi-card {
          margin: var(--spacing-xl) 0;
          padding: var(--spacing-xl);
          background: linear-gradient(135deg, rgba(0, 217, 255, 0.08) 0%, rgba(0, 230, 118, 0.08) 100%);
          border: 2px solid var(--secondary);
          border-radius: var(--radius-lg);
          animation: scaleIn 0.4s ease-out;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-md);
        }

        .card-icon {
          font-size: 1.75rem;
        }

        .card-title {
          font-size: 1.1rem;
          font-weight: var(--font-weight-bold);
          color: var(--black);
          margin: 0;
        }

        .card-text {
          margin-bottom: var(--spacing-lg);
          color: var(--dark-gray);
          font-size: 1rem;
        }

        .card-text strong {
          color: var(--secondary);
          font-weight: var(--font-weight-bold);
        }

        .say-hi-btn {
          width: 100%;
          padding: var(--spacing-lg);
          background: linear-gradient(135deg, var(--secondary) 0%, var(--success) 100%);
          border-radius: var(--radius-md);
          color: var(--white);
          font-weight: var(--font-weight-bold);
          font-size: 1.05rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-sm);
          box-shadow: var(--shadow-secondary);
          transition: all var(--transition-base);
        }

        .say-hi-btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .btn-icon {
          font-size: 1.3rem;
        }

        .continue-btn {
          width: 100%;
          padding: var(--spacing-md);
          background: transparent;
          border: 2px solid var(--light-gray);
          border-radius: var(--radius-md);
          color: var(--dark-gray);
          font-weight: var(--font-weight-semibold);
          transition: all var(--transition-base);
        }

        .continue-btn:hover {
          background: var(--light-gray);
        }

        .success-card {
          margin: var(--spacing-xl) 0;
          padding: var(--spacing-lg);
          background: linear-gradient(135deg, rgba(255, 59, 92, 0.08) 0%, rgba(255, 184, 0, 0.08) 100%);
          border: 2px solid var(--primary);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          animation: scaleIn 0.4s ease-out;
        }

        .success-icon {
          font-size: 1.75rem;
        }

        .success-card p {
          margin: 0;
          font-weight: var(--font-weight-semibold);
          color: var(--black);
        }

        .input-container {
          position: sticky;
          bottom: 0;
          display: flex;
          gap: var(--spacing-md);
          padding: var(--spacing-lg) var(--spacing-xl);
          background: var(--white);
          border-top: 2px solid var(--light-gray);
          box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.05);
          max-width: 800px;
          width: 100%;
          margin: 0 auto;
        }

        .message-input {
          flex: 1;
          padding: var(--spacing-md) var(--spacing-lg);
          background: var(--light-gray);
          border: 2px solid transparent;
          border-radius: var(--radius-full);
          font-size: 1rem;
          transition: all var(--transition-fast);
        }

        .message-input:focus {
          background: var(--white);
          border-color: var(--primary);
          box-shadow: 0 0 0 4px var(--primary-glow);
        }

        .send-btn {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: var(--white);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-primary);
          transition: all var(--transition-base);
        }

        .send-btn:hover {
          transform: scale(1.1);
          box-shadow: var(--shadow-lg);
        }

        .send-btn:active {
          transform: scale(0.95);
        }

        /* Mobile */
        @media (max-width: 768px) {
          .chat-header {
            padding: var(--spacing-md) var(--spacing-lg);
          }

          .messages-container {
            padding: var(--spacing-lg) var(--spacing-md);
          }

          .input-container {
            padding: var(--spacing-md);
          }

          .bubble {
            max-width: 85%;
          }
        }
      `}</style>
    </main>
  );
}
