import { useEffect, useRef } from "react";

function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket("ws://192.168.29.97:4000");

    ws.binaryType = "blob";
    ws.onmessage = (event) => {
      const img = new Image();
      img.src = URL.createObjectURL(event.data);
      img.onload = () => {
        const ctx = canvasRef.current.getContext("2d");
        ctx.drawImage(img, 0, 0, 640, 480);
      };
    };

    return () => ws.close();
  }, []);

  return <canvas ref={canvasRef} width={640} height={480} />;
}

export default App;
