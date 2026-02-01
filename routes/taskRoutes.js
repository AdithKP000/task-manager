import express from "express";
import { createNewTaskController, getAllTasksController, updateTaskController, getTaskMetricsController } from "../controller/taskController.js";

const router = express.Router();


router.get("/getAll", getAllTasksController)

router.post('/create', createNewTaskController)

router.put('/update/:id', updateTaskController)

router.get('/metrics', getTaskMetricsController)



export default router;