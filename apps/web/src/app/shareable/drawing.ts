import { shapes } from "../constants/shapes.constant";

export class drawing {
  private canvas;
  private ctx;
  public selectedShape;
  private startOffSetX!: number;
  private startOffSetY!: number;
  private actualEndOffSetX!: number;
  private actualEndOffSetY!: number;
  private endOffSetX!: number;
  private endOffSetY!: number;
  private websocket: WebSocket;
  private roomName: any;
  private shapesData: any[] = [];

  // <----------------------------------------------constructor----------------------------------->
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
    this.ctx = canvas.getContext("2d");
    this.setUpCanvas();
    this.renderShapes();
    this.addListeners();

    if (this.websocket) {
      this.websocket.onmessage = (event: MessageEvent) => {
        if (!event) return;
        const data = JSON.parse(event?.data);
        if(data?.type === 'eraser'){
            this.shapesData = this.shapesData.filter((shape: any) => shape.id !== data?.message?.id);
        }else{
            this.shapesData.push(data?.message);
        }
        this.clearCanvas();
        this.renderShapes();
      };
    }
  }

  //<------------------------------------------------------------------------CANVAS SETUP-------------------------------------------->
  setUpCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  // <------------------------------------------------------------------------EVENT LISTENERS---------------------------->
  addListeners() {
    //mouseEvents
    this.canvas.addEventListener("mousedown", (event: MouseEvent) => {
      this.startOffSetX = event.offsetX;
      this.startOffSetY = event.offsetY;
    });

    this.canvas.addEventListener("mouseup", (event: MouseEvent) => {
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

  // <------------------------------------------------------------DRAWING SHAPE-------------------------------------------------------->
  drawShape() {
    if (!this.ctx) return;

    // <--------------------------------------------RECTANGLE---------------------------------------------->
    if (this.selectedShape === shapes.REACTANGLE) {
      this.ctx.strokeStyle = "white";
      this.ctx?.strokeRect(
        this.startOffSetX,
        this.startOffSetY,
        this.endOffSetX,
        this.endOffSetY
      );
    }

    // <------------------------------------------------CIRCLE-------------------------------->
    if (this.selectedShape === shapes.CIRCLE) {
      const radius =
        Math.sqrt(
          this.endOffSetX * this.endOffSetX + this.endOffSetY * this.endOffSetY
        ) / 2;
      const centerX = this.startOffSetX + this.endOffSetX / 2;
      const centerY = this.startOffSetY + this.endOffSetY / 2;
      this.ctx.beginPath();
      this.ctx.strokeStyle = "white";
      this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      this.ctx.stroke();
    }

    // <-----------------------------------------------LINE ----------------------------------------------------->
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
    this.sendData();
  }

  // <------------------------------------------SENDING MESSAGE TO WEBSOCKET-------------------------------------------->
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

  // <---------------------------------------RENDER SHAPES FROM THE DATABASE--------------------------------------------------->

  renderShapes() {
    this.shapesData.forEach((shape: any) => {
      if (shape?.shapeType === shapes.REACTANGLE) {
        if (!this.ctx) return;
        this.ctx.strokeStyle = "white";
        this.ctx?.strokeRect(
          shape?.startOffSetX,
          shape?.startOffSetY,
          shape?.endOffSetX,
          shape?.endOffSetY
        );
      } else if (shape?.shapeType === shapes.CIRCLE) {
        if (!this.ctx) return;
        const radius =
          Math.sqrt(
            shape?.endOffSetX * shape?.endOffSetX +
              shape?.endOffSetY * shape?.endOffSetY
          ) / 2;
        const centerX = shape?.startOffSetX + shape?.endOffSetX / 2;
        const centerY = shape?.startOffSetY + shape?.endOffSetY / 2;
        this.ctx.beginPath();
        this.ctx.strokeStyle = "white";
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.stroke();
      } else if (shape?.shapeType === shapes?.LINE) {
        if (!this.ctx) return;
        this.ctx.beginPath();
        this.ctx.strokeStyle = "white";
        this.ctx.moveTo(shape?.startOffSetX, shape?.startOffSetY);
        this.ctx.lineTo(
          shape?.startOffSetX + shape?.endOffSetX,
          shape?.startOffSetY + shape?.endOffSetY
        );
        this.ctx.stroke();
      }
    });
  }

  // <----------------------------------------------------CLEAR CANVAS ------------------------------------------------------->
  clearCanvas() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // <-------------------------------------------------------ERASER------------------------------------------------------------>
  // <----------------------------------------------------ERASE LOGIC------------------------------------------------------->
  eraseShape(x: number, y: number) {
    const shapeToDelete = this.shapesData.find((shape: any) => {
      // <-----------RECTANGLE----------------------->
      if (shape.shapeType === shapes.REACTANGLE) {
        return (
          x >= shape.startOffSetX &&
          x <= shape.startOffSetX + shape.endOffSetX &&
          y >= shape.startOffSetY &&
          y <= shape.startOffSetY + shape.endOffSetY
        );
      }

      // <-----------CIRCLE---------------------->
      if (shape.shapeType === shapes.CIRCLE) {
        const radius =
          Math.sqrt(
            shape.endOffSetX * shape.endOffSetX +
              shape.endOffSetY * shape.endOffSetY
          ) / 2;
        const centerX = shape.startOffSetX + shape.endOffSetX / 2;
        const centerY = shape.startOffSetY + shape.endOffSetY / 2;
        const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        return dist <= radius;
      }

      // <-----------LINE------------------->
      if (shape.shapeType === shapes.LINE) {
        const distance =
          Math.abs(
            (shape.endOffSetY / shape.endOffSetX) * (x - shape.startOffSetX) -
              (y - shape.startOffSetY)
          ) / Math.sqrt((shape.endOffSetY / shape.endOffSetX) ** 2 + 1);
        return distance < 5; // within 5px
      }
    });

    if (shapeToDelete) {
      // Send delete event to server
      const data = {
        type: "eraser",
        payload: {
          id: shapeToDelete.id,
          room_name: this.roomName,
        },
      };
      if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
        this.websocket.send(JSON.stringify(data));
      }

      // Remove locally
      this.shapesData = this.shapesData.filter(
        (s) => s.id !== shapeToDelete.id
      );
      this.clearCanvas();
      this.renderShapes();
    }
  }
}
