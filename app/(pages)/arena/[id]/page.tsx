"use client"

import { useState, useEffect, useRef } from "react";

interface Position {
  x: number;
  y: number;
}

interface MovementState {
  ArrowUp: boolean;
  ArrowDown: boolean;
  ArrowLeft: boolean;
  ArrowRight: boolean;
}

const FullScreenMap: React.FC = () => {
  const [position, setPosition] = useState<Position>({ x: 50, y: 50 }); // Initial position
//   const ws = new WebSocket("http://localhost:3000/api");
//   ws.onopen = () => {
//     console.log("WebSocket connection established");
//   };
//   let clientId = "1" ;
//   let gameId = "123" ;
//   function handleCreateGame(){
//     const payload = {
//         "method" : "create",
//         "clientId" : clientId 
//     }
//     ws.send(JSON.stringify(payload));
//   }
//   function joinGame(){
//     const gameid = gameId ; 
//     const payload = {
//         "method": "join",
//         "gameId": gameid,
//         "clientId": clientId
//     };
//     ws.send(JSON.stringify(payload));
//   }

//   ws.onmessage = message => {
//     const response = JSON.parse(message.data);

//     if (response.method === "connect") {
//         clientId = response.clientId;
//         console.log("Connected with client " + clientId);
//     }
//     if (response.method === "create") {
//         const game = response.game;
//     }
//     if (response.method === "join") {
//         const game = response.game;
//         playerColor = response.color;
//         createButtons(game.balls);
//         game.clients.forEach(player => {
//             const playerDiv = document.createElement('div');
//             playerDiv.classList.add('player');
//             playerDiv.innerHTML = `<div style="background-color:${player.color}"></div>${player.clientid}`;
//             document.body.appendChild(playerDiv);
//         });
//         btnContainer.style.width = '200px';
//         btnContainer.style.height = '400px';
//     }
//     if (response.method === "update") {
//         const state = response.state;
//         Object.entries(state).forEach(([index, color]) => {
//             const btn = document.getElementById(index);
//             if (btn) btn.style.backgroundColor = color;
//         });
//     }
// }

  const [isMoving, setIsMoving] = useState<MovementState>({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  });

  const moveInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key in isMoving && !isMoving[event.key as keyof MovementState]) {
        setIsMoving((prev) => ({ ...prev, [event.key]: true }));
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key in isMoving && isMoving[event.key as keyof MovementState]) {
        setIsMoving((prev) => ({ ...prev, [event.key]: false }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isMoving]);

  useEffect(() => {
    const step = 0.6; // Smaller step for smoother movement
    const updatePosition = () => {
      setPosition((prev) => {
        let newX = prev.x;
        let newY = prev.y;

        if (isMoving.ArrowUp) newY = Math.max(prev.y - step, 0);
        if (isMoving.ArrowDown) newY = Math.min(prev.y + step, 100);
        if (isMoving.ArrowLeft) newX = Math.max(prev.x - step, 0);
        if (isMoving.ArrowRight) newX = Math.min(prev.x + step, 100);

        return { x: newX, y: newY };
      });
    };

    if (Object.values(isMoving).some((val) => val)) {
      moveInterval.current = setInterval(updatePosition, 10); // Update position every 10ms
    } else if (moveInterval.current) {
      clearInterval(moveInterval.current);
      moveInterval.current = null;
    }

    return () => {
      if (moveInterval.current) clearInterval(moveInterval.current);
    };
  }, [isMoving]);

  return (
    <div className="w-screen h-screen bg-gray-200 relative overflow-hidden">
      {/* Map Marker */}
      <div
        className="w-5 h-5 bg-red-500 rounded-full absolute"
        style={{
          top: `${position.y}%`,
          left: `${position.x}%`,
          transform: "translate(-50%, -50%)",
        }}
      ></div>
      {/* <button onClick={handleCreateGame}></button> */}
    </div>
  );
};

export default FullScreenMap;
