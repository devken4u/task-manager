"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskController_1 = require("../controllers/taskController");
const authenticate_1 = require("../middlewares/authenticate");
const taskRoutes = (0, express_1.Router)();
taskRoutes.route("/").get(authenticate_1.authenticate, taskController_1.getTasks);
taskRoutes
    .route("/information-status")
    .get(authenticate_1.authenticate, taskController_1.taskInformationStatus);
taskRoutes.route("/new").post(authenticate_1.authenticate, taskController_1.addTask);
taskRoutes.route("/delete/:id").delete(authenticate_1.authenticate, taskController_1.deleteTask);
taskRoutes.route("/update/:id").put(authenticate_1.authenticate, taskController_1.updateTask);
exports.default = taskRoutes;
