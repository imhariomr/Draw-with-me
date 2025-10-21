import { WebSocketServer } from "ws";
import 'dotenv/config'
import url from "url";
import { verifyToken } from "@clerk/nextjs/server";
import { prismaClient } from "@repo/db/client";
import { messageType } from "./const/type.const";

const port = Number(process.env.WS_PORT) || 4001;
const wss = new WebSocketServer({ port })
const users:any[] = [];
wss.on('connection',async(ws,req)=>{
    const parsedUrl = url.parse(req.url || "", true);
    const token:any = parsedUrl.query.token || '';

    if (!token) {
      ws.send(JSON.stringify({type:'Unauthorized',message:'Token not found'}));
      ws.close(4001, "No token provided");
      return;
    }

    const verifiedToken = await verifyToken(token,{
      jwtKey: process.env.CLERK_JWT_KEY,
    })

    if (!verifiedToken) {
      ws.send(JSON.stringify({type:'Unauthorized',message:'Provided Token is invalid'}));
      return;
    }

    const userId = verifiedToken?.sub;
    ws.on('message',async(data)=>{
      try{
        const obj = JSON.parse(data?.toString());
        let user = users?.find((user:any)=>user.ws === ws);
        if(!user){
          user = {userId,rooms:[],ws};
          users.push(user);
        }
        const {type, payload} = obj;
        const roomName = payload?.room_name;
        const room = await prismaClient.room.findFirst({
          where:{
            name:roomName
          }
        })
        if (!room) {
          ws.send(JSON.stringify({ type: messageType?.UNAUTHORIZED, message: "Room Not Exist"}));
          return;
        }

// <-------------------------------------------------------------SUBSCRIBE & UNSUBSCRIBE --------------------------------------------------------------------->
        if(type === messageType?.SUBSCRIBE || type === messageType?.UNSUBSCRIBE){
          // SUBSCRIBE LOGIC
          if (type === messageType?.SUBSCRIBE) {
            if (!user?.rooms?.includes(roomName)) {
              user.rooms.push(roomName);
              ws.send(JSON.stringify({ type: messageType?.SUCCESS, message: "Subscribed SuccessFully"}));
            }
          }

          // UNSUBSCRIBE LOGIC 
          if (type === messageType?.UNSUBSCRIBE) {
            if (!user?.rooms?.includes(roomName)) {
              ws.send(JSON.stringify({ type: messageType?.INVALIDREQUEST, message: "Room Not Found"}));
              return;
            }
            user.rooms = user.rooms.filter((room: any) => room !== roomName);
            ws.send(JSON.stringify({ 
              type: messageType.UNSUBSCRIBE,
              message: `Unsubscribed from room: ${roomName}`,
            }));
          }
        }

        // <------------------------------------------------SHAPES----------------------------------------------------------->
        if(type === messageType?.SHAPE){
          const shapeName = payload?.shapeType;
          const shape = await prismaClient.shapes.create({
            data:{
              shapeType: shapeName,
              startOffSetX: payload?.start_off_set_x,
              startOffSetY: payload?.start_off_set_y,
              endOffSetX: payload?.end_off_set_x,          
              endOffSetY: payload?.end_off_set_y,
              roomId: room?.id
            }
          })

          users.map((user:any)=>{
            if(user?.rooms.includes(roomName)){
              user.ws.send(JSON.stringify({type:messageType?.SHAPE, message:shape}));
            }
          })
        }


        // <----------------------------------------------- ERASER-------------------------------------->

        if(type === messageType?.ERASER){
          const shapeId = payload?.id;
          if (!shapeId) {
            ws.send(JSON.stringify({type: messageType.INVALIDREQUEST,message: "Shape ID missing",}));
            return;
          }
          console.log('shape',shapeId);
          await prismaClient.shapes.delete({
            where: { id: shapeId },
          });
          users.forEach((user: any) => {
            if (user.rooms.includes(roomName)) {
              user.ws.send(
                JSON.stringify({
                  type: messageType.ERASER,
                  message: { id: shapeId },
                })
              );
            }
          });
        }
      }catch(error:any){
        console.log("error",error);
      }
    })
})