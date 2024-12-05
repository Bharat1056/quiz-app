import { Router } from "express";
import { controller_name } from "../controller/user.controller.js";

const router = Router();

router.route("/router_name").post(controller_name);

export default router;
