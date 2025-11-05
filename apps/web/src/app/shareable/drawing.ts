import { shapes } from "../constants/shapes.constant";

export class drawing {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  public selectedShape: string;
  private startOffSetX!: number;
  private startOffSetY!: number;
  private actualEndOffSetX!: number;
  private actualEndOffSetY!: number;
  private endOffSetX!: number;
  private endOffSetY!: number;
  private websocket: WebSocket;
  private roomName: any;
  private shapesData: any[] = [];
  private isDrawing: boolean = false;

  constructor(
    canvas: HTMLCanvasElement,
    selectedShape: string,
    socketRef: any,
    roomName: any,
    shapesData: any
  ) {
    this.canvas = canvas;
    this.selectedShape = selectedShape;
    this.websocket = socketRef;
    this.roomName = roomName;
    this.shapesData = shapesData || [];
    this.ctx = canvas.getContext("2d")!;
    this.setUpCanvas();
    this.renderShapes();
    this.addListeners();

    if (this.websocket) {
      this.websocket.onmessage = (event: MessageEvent) => {
        if (!event) return;
        const data = JSON.parse(event?.data);
        if (data?.type === "eraser") {
          this.shapesData = this.shapesData.filter(
            (shape: any) => shape.id !== data?.message?.id
          );
        } else {
          this.shapesData.push(data?.message);
        }
        this.clearCanvas();
        this.renderShapes();
      };
    }
  }

  setUpCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  addListeners() {
    // Mouse Down — start drawing
    this.canvas.addEventListener("mousedown", (event: MouseEvent) => {
      this.startOffSetX = event.offsetX;
      this.startOffSetY = event.offsetY;
      this.isDrawing = true;
    });

    // Mouse Move — show live preview
    this.canvas.addEventListener("mousemove", (event: MouseEvent) => {
      if (!this.isDrawing || this.selectedShape === "eraser") return;

      this.actualEndOffSetX = event.offsetX;
      this.actualEndOffSetY = event.offsetY;
      this.endOffSetX = event.offsetX - this.startOffSetX;
      this.endOffSetY = event.offsetY - this.startOffSetY;

      // Redraw background and shapes, then draw preview
      this.clearCanvas();
      this.renderShapes();
      this.drawPreviewShape();
    });

    // Mouse Up — finalize shape
    this.canvas.addEventListener("mouseup", (event: MouseEvent) => {
      if (!this.isDrawing) return;
      this.isDrawing = false;

      if (this.selectedShape === "eraser") {
        this.eraseShape(event.offsetX, event.offsetY);
        return;
      }

      this.actualEndOffSetX = event.offsetX;
      this.actualEndOffSetY = event.offsetY;
      this.endOffSetX = event.offsetX - this.startOffSetX;
      this.endOffSetY = event.offsetY - this.startOffSetY;

      this.drawShape();
    });
  }

  // -------------------------- LIVE PREVIEW SHAPE (temporary ghost) --------------------------
  drawPreviewShape() {
    if (!this.ctx) return;

    this.ctx.save();
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"; // semi-transparent white (ghost look)
    this.ctx.setLineDash([6, 3]); // dashed preview line

    if (this.selectedShape === shapes.REACTANGLE) {
      this.ctx.strokeRect(
        this.startOffSetX,
        this.startOffSetY,
        this.endOffSetX,
        this.endOffSetY
      );
    }

    if (this.selectedShape === shapes.CIRCLE) {
      const radius =
        Math.sqrt(
          this.endOffSetX * this.endOffSetX + this.endOffSetY * this.endOffSetY
        ) / 2;
      const centerX = this.startOffSetX + this.endOffSetX / 2;
      const centerY = this.startOffSetY + this.endOffSetY / 2;
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      this.ctx.stroke();
    }

    if (this.selectedShape === shapes.LINE) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.startOffSetX, this.startOffSetY);
      this.ctx.lineTo(
        this.startOffSetX + this.endOffSetX,
        this.startOffSetY + this.endOffSetY
      );
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  // -------------------------- FINAL DRAW (permanent) --------------------------
  drawShape() {
    if (!this.ctx) return;

    this.ctx.save();
    this.ctx.setLineDash([]); // solid lines

    if (this.selectedShape === shapes.REACTANGLE) {
      this.ctx.strokeStyle = "white";
      this.ctx.strokeRect(
        this.startOffSetX,
        this.startOffSetY,
        this.endOffSetX,
        this.endOffSetY
      );
    }

    if (this.selectedShape === shapes.CIRCLE) {
      const radius =
        Math.sqrt(
          this.endOffSetX * this.endOffSetX + this.endOffSetY * this.endOffSetY
        ) / 2;
      const centerX = this.startOffSetX + this.endOffSetX / 2;
      const centerY = this.startOffSetY + this.endOffSetY / 2;
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = "white";
      this.ctx.stroke();
    }

    if (this.selectedShape === shapes.LINE) {
      this.ctx.beginPath();
      this.ctx.strokeStyle = "white";
      this.ctx.moveTo(this.startOffSetX, this.startOffSetY);
      this.ctx.lineTo(
        this.startOffSetX + this.endOffSetX,
        this.startOffSetY + this.endOffSetY
      );
      this.ctx.stroke();
    }

    this.ctx.restore();

    this.sendData();
  }

  sendData() {
    const data = {
      type: "shape",
      payload: {
        shapeType: this.selectedShape,
        start_off_set_x: this.startOffSetX,
        start_off_set_y: this.startOffSetY,
        end_off_set_x: this.endOffSetX,
        end_off_set_y: this.endOffSetY,
        room_name: this.roomName,
      },
    };
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify(data));
    }
  }

  renderShapes() {
    this.shapesData.forEach((shape: any) => {
      if (!this.ctx) return;
      this.ctx.strokeStyle = "white";
      this.ctx.setLineDash([]);
      if (shape?.shapeType === shapes.REACTANGLE) {
        this.ctx.strokeRect(
          shape?.startOffSetX,
          shape?.startOffSetY,
          shape?.endOffSetX,
          shape?.endOffSetY
        );
      } else if (shape?.shapeType === shapes.CIRCLE) {
        const radius =
          Math.sqrt(
            shape?.endOffSetX * shape?.endOffSetX +
              shape?.endOffSetY * shape?.endOffSetY
          ) / 2;
        const centerX = shape?.startOffSetX + shape?.endOffSetX / 2;
        const centerY = shape?.startOffSetY + shape?.endOffSetY / 2;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.stroke();
      } else if (shape?.shapeType === shapes?.LINE) {
        this.ctx.beginPath();
        this.ctx.moveTo(shape?.startOffSetX, shape?.startOffSetY);
        this.ctx.lineTo(
          shape?.startOffSetX + shape?.endOffSetX,
          shape?.startOffSetY + shape?.endOffSetY
        );
        this.ctx.stroke();
      }
    });
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

eraseShape(x: number, y: number) {
  const ERASER_RADIUS = 10; // tolerance area

  const isPointInsideRect = (shape: any, px: number, py: number) => {
    const x1 = shape.startOffSetX;
    const y1 = shape.startOffSetY;
    const x2 = x1 + shape.endOffSetX;
    const y2 = y1 + shape.endOffSetY;
    return (
      px >= Math.min(x1, x2) &&
      px <= Math.max(x1, x2) &&
      py >= Math.min(y1, y2) &&
      py <= Math.max(y1, y2)
    );
  };

  const isPointInsideCircle = (shape: any, px: number, py: number) => {
    const radius =
      Math.sqrt(
        shape.endOffSetX * shape.endOffSetX +
          shape.endOffSetY * shape.endOffSetY
      ) / 2;
    const centerX = shape.startOffSetX + shape.endOffSetX / 2;
    const centerY = shape.startOffSetY + shape.endOffSetY / 2;
    const dist = Math.sqrt((px - centerX) ** 2 + (py - centerY) ** 2);
    return dist <= radius + ERASER_RADIUS;
  };

  const isPointNearLine = (shape: any, px: number, py: number) => {
    const x1 = shape.startOffSetX;
    const y1 = shape.startOffSetY;
    const x2 = x1 + shape.endOffSetX;
    const y2 = y1 + shape.endOffSetY;

    const lineLength = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    if (lineLength === 0) return false;

    const distance =
      Math.abs((y2 - y1) * px - (x2 - x1) * py + x2 * y1 - y2 * x1) /
      lineLength;

    // projection check
    const dot =
      (px - x1) * (x2 - x1) +
      (py - y1) * (y2 - y1);
    if (dot < 0) return false;
    if (dot > (x2 - x1) ** 2 + (y2 - y1) ** 2) return false;

    return distance <= ERASER_RADIUS;
  };

  // 👉 Iterate shapes in reverse (top-most first)
  for (let i = this.shapesData.length - 1; i >= 0; i--) {
    const shape = this.shapesData[i];
    let hit = false;

    switch (shape.shapeType) {
      case shapes.REACTANGLE:
        hit = isPointInsideRect(shape, x, y);
        break;
      case shapes.CIRCLE:
        hit = isPointInsideCircle(shape, x, y);
        break;
      case shapes.LINE:
        hit = isPointNearLine(shape, x, y);
        break;
    }

    if (hit) {
      // Delete only top-most hit shape and break
      const data = {
        type: "eraser",
        payload: { id: shape.id, room_name: this.roomName },
      };

      if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
        this.websocket.send(JSON.stringify(data));
      }

      this.shapesData.splice(i, 1); // remove only this shape
      this.clearCanvas();
      this.renderShapes();
      break; // stop after deleting top shape
    }
  }
}


}
