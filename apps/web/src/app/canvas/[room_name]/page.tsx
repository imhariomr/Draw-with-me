"use client";
import { shapes } from "../../constants/shapes.constant";
import { drawing } from "../../shareable/drawing";
import ToolBar from "../../shareable/tool-bar";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
// import { environment } from "environment";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Canvas() {
  const params = useParams();
  const roomName = params?.room_name;
  const [shapesData, setShapesData] = useState<any[]>([]);
  const { getToken } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef<drawing | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const [selectedShape, setSelectedShape] = useState<string>(shapes.REACTANGLE);

  // Initialize WebSocket
  const setUpWebSocketConnection = async () => {
    const token: any = await getToken();
    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_URL}?token=${encodeURIComponent(token)}`
    );
    socketRef.current = ws;
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "subscribe", payload: { room_name: roomName } }));
    };
  };

  // Fetch shapes
  const getShape = async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/get-shapes`, {
      params: { room_name: roomName },
    });
    const data = Array.isArray(response?.data?.data) ? response.data?.data : [];
    setShapesData(data);
  };

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.style.cursor = selectedShape === shapes.ERASER ? `url("/icons/eraser.png") 4 4, auto`: "crosshair";
    }
    if (drawingRef.current) {
      drawingRef.current.selectedShape = selectedShape;
    }
  }, [selectedShape]);

  useEffect(() => {
    setUpWebSocketConnection();
    getShape();
  }, []);

  useEffect(() => {
    if (canvasRef.current && socketRef.current) {
      drawingRef.current = new drawing(canvasRef.current,selectedShape,socketRef.current,roomName,shapesData);
    }
  }, [shapesData]);

  useEffect(() => {
    return () => {
      socketRef.current?.close();
    };
  }, []);

  return (
    <>
    {selectedShape === shapes.ERASER && (<p className="absolute top-2 left-1/2 -translate-x-1/2 z-50 px-3 py-1 text-sm text-gray-200 bg-[#1f1f1f]/80 backdrop-blur-md border border-white/10 rounded-md shadow-md">
    Just Tap once on the shape and watch it disappear like it never exist 🎩✨
    </p>
  )}
      <ToolBar selectedShape={selectedShape} setSelectedShape={setSelectedShape} />
      <div className="relative w-screen h-screen z-0">
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle,_#4a4a4a_1px,_transparent_1px)] [background-size:24px_24px]"></canvas>
      </div>
    </>
  );
}
