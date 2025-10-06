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