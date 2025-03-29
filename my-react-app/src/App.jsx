import { useEffect, useRef, useState } from "react";

function App() {
  const canvasRef = useRef(null);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');

  useEffect(() => {
    const ws = new WebSocket("ws://192.168.29.97:4000");

    ws.onopen = () => {
      setConnectionStatus('Connected');
      console.log("Connected to WebSocket server");
    };

    ws.binaryType = "blob";
    ws.onmessage = (event) => {
      const img = new Image();
      img.src = URL.createObjectURL(event.data);
      img.onload = () => {
        const ctx = canvasRef.current.getContext("2d");
        ctx.drawImage(img, 0, 0, 640, 480);
        URL.revokeObjectURL(img.src); // Clean up blob URL
      };
    };

    ws.onclose = () => {
      setConnectionStatus('Disconnected');
      console.log("Disconnected from WebSocket server");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnectionStatus('Error');
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  return (
    <div className="container">
      <div className="status-bar">
        <p>Status: {connectionStatus}</p>
      </div>
      <canvas 
        ref={canvasRef} 
        width={640} 
        height={480} 
        style={{
          border: '1px solid #ccc',
          display: 'block',
          margin: '20px auto'
        }}
      />
    </div>
  );
}

export default App;
