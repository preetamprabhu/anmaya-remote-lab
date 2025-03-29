import { useEffect, useRef, useState } from "react";

function LiveStream() {
  const canvasRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket("ws://192.168.29.97:4000");

    ws.binaryType = "blob";
    
    ws.onopen = () => {
      setIsConnected(true);
      console.log("Connected to server");
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log("Disconnected from server");
    };

    ws.onmessage = (event) => {
      const img = new Image();
      img.src = URL.createObjectURL(event.data);
      img.onload = () => {
        const ctx = canvasRef.current.getContext("2d");
        ctx.drawImage(img, 0, 0, 640, 480);
        URL.revokeObjectURL(img.src); // Clean up the blob URL
      };
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  return (
    <div>
      <div style={{ textAlign: 'center', margin: '20px' }}>
        <h2>Raspberry Pi Camera Stream</h2>
        <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      </div>
      <canvas 
        ref={canvasRef} 
        width={640} 
        height={480} 
        style={{
          display: 'block',
          margin: '0 auto',
          border: '1px solid #ccc'
        }}
      />
    </div>
  );
}

export default LiveStream;