"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskInformationStatus = exports.updateTask = exports.deleteTask = exports.addTask = exports.getTasks = void 0;
const taskModel_1 = __importDefault(require("../models/taskModel"));
const errorCodes_1 = require("../enum/errorCodes");
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const account = req.body.account;
    const { limit = 10, offset = 0 } = req.query;
    const taskFilters = {
        userId: account._id,
    };
    switch ((_a = req.query) === null || _a === void 0 ? void 0 : _a.priority) {
        case "low":
            taskFilters.priority = "low";
            break;
        case "medium":
            taskFilters.priority = "medium";
            break;
        case "high":
            taskFilters.priority = "high";
            break;
    }
    switch ((_b = req.query) === null || _b === void 0 ? void 0 : _b.isCompleted) {
        case "true":
            taskFilters.isCompleted = true;
            break;
        case "false":
            taskFilters.isCompleted = false;
            break;
    }
    if (((_c = req.query) === null || _c === void 0 ? void 0 : _c.isCompleted) === undefined) {
        switch ((_d = req.query) === null || _d === void 0 ? void 0 : _d.status) {
            case "pending":
                taskFilters.dueDate = { $gt: new Date() };
                taskFilters.isCompleted = false;
                break;
            case "overdue":
                taskFilters.dueDate = { $lt: new Date() };
                taskFilters.isCompleted = false;
                break;
        }
    }
    try {
        const totalTasks = yield taskModel_1.default.countDocuments({ userId: account._id });
        const tasks = yield taskModel_1.default.find(taskFilters)
            .sort({ isFavorite: -1, createdAt: 1 })
            .limit(Number(limit))
            .skip(Number(offset));
        res.status(200).json({
            currentPage: Number(offset),
            tasks,
            nextPage: (() => {
                if (Number(limit) + Number(offset) > totalTasks) {
                    return null;
                }
                return Number(limit) + Number(offset);
            })(),
            totalTasks: totalTasks,
        });
    }
    catch (e) {
        res.status(500).send("An unexpected occurred in the server.");
    }
});
exports.getTasks = getTasks;
const addTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const account = req.body.account;
    const { title = "", description = "", priority = "low", dueDate = new Date(), isCompleted = false, } = req.body;
    const checkedTitle = () => {
        if (title === "")
            return "No title";
        return title;
    };
    const checkedDescription = () => {
        if (description === "")
            return "Empty description";
        return description;
    };
    const task = new taskModel_1.default({
        title: checkedTitle(),
        description: checkedDescription(),
        priority,
        dueDate,
        isCompleted,
        userId: account._id,
    });
    try {
        yield task.save();
        res.status(201).json({ message: "A new task is created." });
    }
    catch (e) {
        res.status(500).json({ message: "An unexpected occurred in the server." });
    }
});
exports.addTask = addTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id || "";
    if (!id) {
        res.status(400).json({
            code: errorCodes_1.ErrorCodes.TaskIDMissing,
            message: "Task ID is required.",
        });
        return;
    }
    try {
        yield taskModel_1.default.findByIdAndDelete(id);
        res.status(200).json({
            message: "Task Deleted.",
        });
    }
    catch (e) {
        res.status(500).json({
            message: "An unexpected error occurred in the server.",
        });
    }
});
exports.deleteTask = deleteTask;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title = "", description = "", dueDate = "", priority = "", isCompleted = "", isFavorite = "", } = req.body;
    const id = req.params.id || "";
    const fieldsToUpdate = {};
    if (!id) {
        res.status(400).json({
            code: errorCodes_1.ErrorCodes.TaskIDMissing,
            message: "Task ID is required.",
        });
        return;
    }
    if (title !== "") {
        fieldsToUpdate.title = title;
    }
    if (description !== "") {
        fieldsToUpdate.description = description;
    }
    if (dueDate) {
        fieldsToUpdate.dueDate = dueDate;
    }
    if (priority) {
        fieldsToUpdate.priority = priority;
    }
    if (isCompleted !== "") {
        fieldsToUpdate.isCompleted = isCompleted;
    }
    if (isFavorite !== "") {
        fieldsToUpdate.isFavorite = isFavorite;
    }
    if (Object.keys(fieldsToUpdate).length === 0) {
        res.status(400).json({});
        return;
    }
    try {
        yield taskModel_1.default.findOneAndUpdate({ _id: id }, { $set: fieldsToUpdate });
        res.status(200).json({
            message: "Task successfully updated.",
        });
    }
    catch (_a) {
        res.status(500).json({
            message: "An unexpected error occurred in the server.",
        });
    }
});
exports.updateTask = updateTask;
const taskInformationStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const account = req.body.account;
    const taskStatus = {
        total: 0,
        completed: 0,
        pending: 0,
        overdue: 0,
    };
    try {
        taskStatus.total = yield taskModel_1.default.countDocuments({ userId: account._id });
        taskStatus.completed = yield taskModel_1.default.countDocuments({
            userId: account._id,
            isCompleted: true,
        });
        taskStatus.pending = yield taskModel_1.default.countDocuments({
            userId: account._id,
            dueDate: { $gt: new Date() },
        });
        taskStatus.overdue = yield taskModel_1.default.countDocuments({
            userId: account._id,
            dueDate: { $lt: new Date() },
            isCompleted: false,
        });
        res.status(200).json({
            taskStatus,
        });
    }
    catch (e) {
        res.status(500).json({
            message: "An unexpected error occurred in the server.",
        });
    }
});
exports.taskInformationStatus = taskInformationStatus;
