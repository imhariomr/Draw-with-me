"use client";
import { shapes } from "../../constants/shapes.constant";
import { drawing } from "../../shareable/drawing";
import ToolBar from "../../shareable/tool-bar";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { environment } from "environment";
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
      `${environment?.NEXT_PUBLIC_WS_URL}?token=${encodeURIComponent(token)}`
    );
    socketRef.current = ws;
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "subscribe", payload: { room_name: roomName } }));
    };
  };

  // Fetch shapes
  const getShape = async () => {
    const response = await axios.get(`${environment?.NEXT_PUBLIC_API_URL}/get-shapes`, {
      params: { room_name: roomName },
    });
    const data = Array.isArray(response?.data?.data) ? response.data?.data : [];
    setShapesData(data);
  };

  useEffect(() => {
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
      <ToolBar selectedShape={selectedShape} setSelectedShape={setSelectedShape} />
      <div className="relative w-screen h-screen z-0">
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full"></canvas>
      </div>
    </>
  );
}
