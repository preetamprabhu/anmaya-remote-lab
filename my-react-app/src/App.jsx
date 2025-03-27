import { useEffect, useRef, useState } from "react";

function App() {
  const videoRef = useRef(null);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:3000`);

    ws.onopen = () => {
      setConnectionStatus('Connected');
    };

    ws.onmessage = (event) => {
      const url = URL.createObjectURL(new Blob([event.data], { type: "image/jpeg" }));
      if (videoRef.current) {
        videoRef.current.src = url;
        URL.revokeObjectURL(videoRef.current.src);
      }
    };

    ws.onerror = () => {
      setConnectionStatus('Connection failed');
    };

    ws.onclose = () => {
      setConnectionStatus('Disconnected');
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Live Stream</h2>
      <p>Status: {connectionStatus}</p>
      <img 
        ref={videoRef} 
        alt="Live Stream" 
        style={{ 
          maxWidth: '100%',
          border: '1px solid #ccc',
          borderRadius: '8px'
        }}
      />
    </div>
  );
}

export default App;
