import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, CornerDownLeft } from 'lucide-react';

const Terminal = () => {
  const [history, setHistory] = useState([
    { type: 'system', content: 'Initializing OBITO Terminal Core v1.4.2...' },
    { type: 'system', content: 'Connected to Vetlo-System Mainframe successfully.' },
    { type: 'system', content: 'Type "help" to see available terminal commands.' },
  ]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const historyContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom of terminal container without shifting the main page
  useEffect(() => {
    if (historyContainerRef.current) {
      historyContainerRef.current.scrollTop = historyContainerRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input on console click
  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleCommand = (cmd) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    let response = [];

    if (trimmedCmd) {
      setCommandHistory(prev => [...prev, cmd]);
      setHistoryIndex(-1);
    }

    switch (trimmedCmd) {
      case 'help':
        response = [
          { type: 'output', content: 'Available Commands:' },
          { type: 'output', content: '  whoami / about - Learn about OBITO and his mission.' },
          { type: 'output', content: '  info           - Show personal developer profiles.' },
          { type: 'output', content: '  skills / arsenal- Display current programming stacks.' },
          { type: 'output', content: '  projects       - Show featured automation & bot projects.' },
          { type: 'output', content: '  contact        - Get secure transmission routes.' },
          { type: 'output', content: '  clear / cls    - Clean the terminal interface.' },
        ];
        break;
      case 'about':
      case 'whoami':
        response = [
          { type: 'output', content: 'User Profile: OBITO' },
          { type: 'output', content: 'Role: Senior Automation Engineer & Backend Architect' },
          { type: 'output', content: 'Location: Vetlo Support HQ' },
          { type: 'output', content: 'Bio: Specializing in high-performance Discord bots, advanced automation pipelines, and robust server microservices. Building clean, fast and scalable web apps.' },
        ];
        break;
      case 'info':
        response = [
          { type: 'output', content: 'Name: Obito' },
          { type: 'output', content: 'Discord Username: tanush_44' },
        ];
        break;
      case 'skills':
      case 'arsenal':
        response = [
          { type: 'output', content: 'OBITO\'s Stack & Systems Proficiency:' },
          { type: 'output', content: '  Discord API   [███████████████████-] 95%' },
          { type: 'output', content: '  Java          [██████████████████--] 90%' },
          { type: 'output', content: '  Node.js       [█████████████████---] 85%' },
          { type: 'output', content: '  Python        [████████████████----] 80%' },
          { type: 'output', content: '  MongoDB       [███████████████-----] 75%' },
          { type: 'output', content: '  React         [██████████████------] 70%' },
        ];
        break;
      case 'projects':
        response = [
          { type: 'output', content: 'Syncing Portfolio Database...' },
          { type: 'output', content: '📂 Python AI Bot' },
          { type: 'output', content: '   - Desc: ML-powered Discord bot with NLP and image recognition.' },
          { type: 'output', content: '   - Tech: Python, TensorFlow, Discord.py' },
          { type: 'output', content: '📂 Java Spring API' },
          { type: 'output', content: '   - Desc: High throughput secure JWT REST API backend.' },
          { type: 'output', content: '   - Tech: Java, Spring Boot, PostgreSQL' },
          { type: 'output', content: 'Type "contact" to get links or request new developments.' },
        ];
        break;
      case 'contact':
        response = [
          { type: 'output', content: 'Initiating Secure Transmission Link...' },
          { type: 'output', content: '📧 Primary Email  : nexa.8000@gmail.com' },
          { type: 'output', content: '💬 Discord Portal : @9p7t' },
          { type: 'output', content: '⚡ Guild Server   : Mellow Cafe (Join via CTA below)' },
        ];
        break;
      case 'clear':
      case 'cls':
        setHistory([]);
        setInput('');
        return;
      case '':
        break;
      default:
        response = [
          { type: 'error', content: `Command not found: "${cmd}". Type "help" for a list of commands.` }
        ];
    }

    setHistory(prev => [
      ...prev,
      { type: 'input', content: cmd },
      ...response
    ]);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(commandHistory[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (commandHistory.length === 0 || historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      }
    }
  };

  return (
    <div 
      onClick={focusInput}
      style={{
        width: '100%',
        height: '350px',
        background: 'rgba(5, 5, 10, 0.85)',
        border: '1px solid rgba(178, 0, 255, 0.35)',
        borderRadius: '16px',
        padding: '1.5rem',
        fontFamily: '"Courier New", Courier, monospace',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 0 40px rgba(178,0,255,0.15), inset 0 0 20px rgba(0,0,0,0.8)',
        overflow: 'hidden',
        cursor: 'text',
        position: 'relative'
      }}
    >
      {/* Terminal Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(138,43,226,0.2)',
        paddingBottom: '0.5rem',
        marginBottom: '1rem',
        color: '#b200ff',
        fontSize: '0.85rem',
        letterSpacing: '1px',
        fontWeight: 'bold',
        userSelect: 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TerminalIcon size={16} />
          <span>obito@vetlo:~$ console</span>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#faa61a', opacity: 0.8 }}></span>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#43b581', opacity: 0.8 }}></span>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f04747', opacity: 0.8 }}></span>
        </div>
      </div>

      {/* Terminal History */}
      <div 
        ref={historyContainerRef}
        data-lenis-prevent
        style={{
          flexGrow: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          fontSize: '0.9rem',
          lineHeight: '1.4',
          paddingRight: '0.5rem',
          scrollbarWidth: 'thin'
        }}
      >
        {history.map((line, index) => (
          <div key={index} style={{ wordBreak: 'break-all' }}>
            {line.type === 'input' && (
              <span style={{ color: '#fff' }}>
                <span style={{ color: '#b200ff' }}>obito@vetlo:~$ </span>
                {line.content}
              </span>
            )}
            {line.type === 'system' && (
              <span style={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
                [sys] {line.content}
              </span>
            )}
            {line.type === 'output' && (
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#a0a0a0', fontFamily: 'inherit' }}>
                {line.content}
              </pre>
            )}
            {line.type === 'special' && (
              <span style={{ color: '#ff00ff', fontWeight: 'bold', textShadow: '0 0 8px rgba(255,0,255,0.6)' }}>
                {line.content}
              </span>
            )}
            {line.type === 'error' && (
              <span style={{ color: '#f04747' }}>
                [error] {line.content}
              </span>
            )}
          </div>
        ))}
        <div />
      </div>

      {/* Input Line */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginTop: '0.75rem',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        paddingTop: '0.75rem',
        gap: '0.5rem'
      }}>
        <span style={{ color: '#b200ff', fontWeight: 'bold', fontSize: '0.9rem', userSelect: 'none' }}>obito@vetlo:~$</span>
        <input 
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          spellCheck="false"
          style={{
            flexGrow: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#fff',
            fontFamily: 'inherit',
            fontSize: '0.9rem',
            padding: 0
          }}
        />
        <CornerDownLeft size={14} color="rgba(255,255,255,0.3)" />
      </div>
    </div>
  );
};

export default Terminal;
