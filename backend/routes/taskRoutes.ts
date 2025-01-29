import { Router } from "express";
import {
  getTasks,
  addTask,
  deleteTask,
  updateTask,
  taskInformationStatus,
} from "../controllers/taskController";
import { authenticate } from "../middlewares/authenticate";

const taskRoutes = Router();

taskRoutes.route("/").get(authenticate, getTasks);
taskRoutes
  .route("/information-status")
  .get(authenticate, taskInformationStatus);
taskRoutes.route("/new").post(authenticate, addTask);
taskRoutes.route("/delete/:id").delete(authenticate, deleteTask);
taskRoutes.route("/update/:id").put(authenticate, updateTask);

export default taskRoutes;
