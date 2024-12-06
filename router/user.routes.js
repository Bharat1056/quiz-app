import { Router } from "express";
import { createQuiz } from "../controller/user.controller.js";

const router = Router();

router.route("/create").post(createQuiz);

export default router;
