import { Request, Response } from "express";
import { roomValidator } from "../validation/room.validation";
import {prismaClient} from "@repo/db/client";

export const CreateRoom = async(req:Request,res:Response)=>{
    const roomData = roomValidator.safeParse(req.body);
    if(!roomData.success){
        return res.status(400).json({ message: roomData.error.issues[0]?.message });
    }
    const {name,description} = roomData?.data;

    const findRoom = await prismaClient.room.findFirst({
        where:{name:name}
    })
    if(findRoom){
        res.status(400).json({message: "Canvas Already Exist"});
        return;
    }

    const room = await prismaClient.room.create({
        data:{
            name,description
        }
    })
    return res.status(200).json({ message: "Canvas created", data: room });
}


export const getShape = async(req:Request,res:Response)=>{
    const roomName = req.query.room_name as string;
    if(!roomName){
        res.status(400).json({message: "Invalid Canvas"});
        return;
    }
    const room = await prismaClient.room.findUnique({
        where:{
            name: roomName
        }
    })
    const shapes = await prismaClient.shapes.findMany({
        where:{
            roomId: room?.id
        }
    })
    return res.status(200).json({data:shapes});
}

export const listCanvas = async(req:Request,res:Response)=>{
    const roomList = await prismaClient.room.findMany();
    return res.status(200).json({ message: "Canvas list", data: roomList });
}