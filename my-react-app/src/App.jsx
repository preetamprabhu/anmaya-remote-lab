import { useEffect, useRef, useState } from "react";

function App() {
  const videoRef = useRef(null);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://192.168.29.97:4000`);

    ws.onopen = () => {
      setConnectionStatus('Connected');
    };

    ws.onmessage = (event) => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl); // Revoke previous URL before setting a new one
      }
      const newUrl = URL.createObjectURL(new Blob([event.data], { type: "image/jpeg" }));
      setImageUrl(newUrl);
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
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Live Stream</h2>
      <p>Status: {connectionStatus}</p>
      <img 
        src={imageUrl || ''} 
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
