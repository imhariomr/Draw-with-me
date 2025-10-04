import { Circle, Eraser, RectangleHorizontal, Slash } from "lucide-react";
import { useEffect, useState } from "react";
import { shapes } from "../constants/shapes.constant";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
interface ToolBarProps {
  selectedShape: string;
  setSelectedShape: (shape: string) => void;
}
export default function ToolBar({ selectedShape, setSelectedShape }: ToolBarProps) {
  return (
    <>
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md w-64 m-3 fixed z-50">
        <div className="grid grid-cols-4 gap-4">
          {/* Rectangle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setSelectedShape(shapes.REACTANGLE)}
                className={`cursor-pointer px-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition
            ${selectedShape === shapes.REACTANGLE ? "bg-gray-300 dark:bg-gray-600 py-2" : ""}`}>
                <RectangleHorizontal />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">Rectangle</TooltipContent>
          </Tooltip>

          {/* Circle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setSelectedShape(shapes.CIRCLE)}
                className={`cursor-pointer px-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition
            ${selectedShape === shapes.CIRCLE ? "bg-gray-300 dark:bg-gray-600 py-2" : ""}`}>
                <Circle />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">Circle</TooltipContent>
          </Tooltip>

          {/* Line */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setSelectedShape(shapes.LINE)}
                className={`cursor-pointer px-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition
            ${selectedShape === shapes.LINE ? "bg-gray-300 dark:bg-gray-600 py-2" : ""}`}>
                <Slash />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">Line</TooltipContent>
          </Tooltip>

          {/* Eraser */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setSelectedShape(shapes.ERASER)}
                className={`cursor-pointer px-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition
            ${selectedShape === shapes.ERASER ? "bg-gray-300 dark:bg-gray-600 py-2" : ""}`}>
                <Eraser />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">Eraser</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </>
  );
}
