import { shapes } from "../constants/shapes.constant";

export class drawing{
    private canvas;
    private ctx;
    public selectedShape;
    private startOffSetX!:number;
    private startOffSetY!:number;
    private actualEndOffSetX!:number;
    private actualEndOffSetY!:number;
    private endOffSetX!:number;
    private endOffSetY!:number;
    constructor(
        canvas:HTMLCanvasElement,
        selectedShape: string
    ){
        this.canvas = canvas;
        this.selectedShape = selectedShape;
        this.ctx = canvas.getContext('2d');
        this.setUpCanvas();
        this.addListeners();
    }

    setUpCanvas(){
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    addListeners(){
        //mouseEvents
        this.canvas.addEventListener('mousedown',(event:MouseEvent)=>{
            this.startOffSetX = event.offsetX;
            this.startOffSetY = event.offsetY;
        })

        this.canvas.addEventListener('mouseup',(event:MouseEvent)=>{
            this.actualEndOffSetX = event.offsetX;
            this.actualEndOffSetY = event.offsetY;
            this.endOffSetX = event.offsetX - this.startOffSetX;
            this.endOffSetY = event.offsetY - this.startOffSetY;            
            this.drawShape()
        })
    }


    drawShape(){
        if(!this.ctx) return;        
        if(this.selectedShape === shapes.REACTANGLE){
            this.ctx.strokeStyle = "white";
            this.ctx?.strokeRect(this.startOffSetX,this.startOffSetY,this.endOffSetX,this.endOffSetY);
        }
        if(this.selectedShape === shapes.CIRCLE){            
            const radius = Math.sqrt((this.endOffSetX * this.endOffSetX) + (this.endOffSetY * this.endOffSetY))/2;
            const centerX = this.startOffSetX + this.endOffSetX/2;
            const centerY = this.startOffSetY + this.endOffSetY/2;
            this.ctx.beginPath();
            this.ctx.strokeStyle = 'white';
            this.ctx.arc(centerX, centerY, radius, 0, Math.PI*2);
            this.ctx.stroke();
        }
        if(this.selectedShape === shapes.LINE){
            this.ctx.beginPath();
            this.ctx.strokeStyle = 'white';
            this.ctx.moveTo(this.startOffSetX, this.startOffSetY);
            this.ctx.lineTo(this.actualEndOffSetX , this.actualEndOffSetY);
            this.ctx.stroke();
        }
    }
}