import { Router } from "express";
import {CreateRoom, getShape, listCanvas} from "../controller/room.controller";

const router: Router = Router();

router.post('/create-room',CreateRoom);
router.get('/list/canvas',listCanvas);
router.get('/get-shapes',getShape);
export default router;