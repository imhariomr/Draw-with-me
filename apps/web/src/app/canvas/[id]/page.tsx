'use client'
import { shapes } from "@/app/constants/shapes.constant";
import { drawing } from "@/app/shareable/drawing";
import ToolBar from "@/app/shareable/tool-bar";
import { useEffect, useRef, useState } from "react"

export default function Canvas(){

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawingRef = useRef<drawing>(null);
    const [selectedShape, setSelectedShape] = useState<string>(shapes.REACTANGLE);

    useEffect(()=>{
      if(drawingRef.current){
        drawingRef.current.selectedShape = selectedShape;
      }
    },[selectedShape])
    
    useEffect(()=>{
        if(canvasRef.current){
            const canvasInstance = canvasRef.current;
            drawingRef.current = new drawing(canvasInstance,selectedShape);
        }
    },[])
    return (
      <>
      <ToolBar selectedShape={selectedShape} setSelectedShape={setSelectedShape}/>
      <div className="relative w-screen h-screen z-0">
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full"
        ></canvas>
      </div>
      </>
    );
}