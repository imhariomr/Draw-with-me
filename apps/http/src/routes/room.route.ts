import { Router } from "express";
import {CreateRoom} from "../controller/room.controller";

const router: Router = Router();

router.post('/create-room',CreateRoom);
export default router;