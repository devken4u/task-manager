import { Request, Response } from "express";
import { Account } from "../types/types";
import TaskModel from "../models/taskModel";
import { ObjectId } from "mongodb";
import { ErrorCodes } from "../enum/errorCodes";

const getTasks = async (req: Request, res: Response) => {
  const account = req.body.account as Account;

  const { limit = 10, offset = 0 } = req.query;

  const taskFilters: {
    userId?: ObjectId;
    priority?: "low" | "medium" | "high";
    isCompleted?: Boolean;
    dueDate?: { $gt: Date } | { $lt: Date };
  } = {
    userId: account._id,
  };

  switch (req.query?.priority) {
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

  switch (req.query?.isCompleted) {
    case "true":
      taskFilters.isCompleted = true;
      break;
    case "false":
      taskFilters.isCompleted = false;
      break;
  }

  if (req.query?.isCompleted === undefined) {
    switch (req.query?.status) {
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
    const totalTasks = await TaskModel.countDocuments({ userId: account._id });
    const tasks = await TaskModel.find(taskFilters)
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
  } catch (e) {
    res.status(500).send("An unexpected occurred in the server.");
  }
};

const addTask = async (req: Request, res: Response) => {
  const account = req.body.account as Account;

  const {
    title = "",
    description = "",
    priority = "low",
    dueDate = new Date(),
    isCompleted = false,
  } = req.body;

  const checkedTitle = () => {
    if (title === "") return "No title";
    return title;
  };

  const checkedDescription = () => {
    if (description === "") return "Empty description";
    return description;
  };

  const task = new TaskModel({
    title: checkedTitle(),
    description: checkedDescription(),
    priority,
    dueDate,
    isCompleted,
    userId: account._id,
  });

  try {
    await task.save();
    res.status(201).json({ message: "A new task is created." });
  } catch (e) {
    res.status(500).json({ message: "An unexpected occurred in the server." });
  }
};

const deleteTask = async (req: Request, res: Response) => {
  const id = req.params.id || "";

  if (!id) {
    res.status(400).json({
      code: ErrorCodes.TaskIDMissing,
      message: "Task ID is required.",
    });
    return;
  }

  try {
    await TaskModel.findByIdAndDelete(id);
    res.status(200).json({
      message: "Task Deleted.",
    });
  } catch (e) {
    res.status(500).json({
      message: "An unexpected error occurred in the server.",
    });
  }
};

const updateTask = async (req: Request, res: Response) => {
  const {
    title = "",
    description = "",
    dueDate = "",
    priority = "",
    isCompleted = "",
    isFavorite = "",
  } = req.body;

  const id = req.params.id || "";

  const fieldsToUpdate: {
    title?: string;
    description?: string;
    dueDate?: string;
    priority?: string;
    isCompleted?: boolean;
    isFavorite?: boolean;
  } = {};

  if (!id) {
    res.status(400).json({
      code: ErrorCodes.TaskIDMissing,
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
    await TaskModel.findOneAndUpdate({ _id: id }, { $set: fieldsToUpdate });
    res.status(200).json({
      message: "Task successfully updated.",
    });
  } catch {
    res.status(500).json({
      message: "An unexpected error occurred in the server.",
    });
  }
};

const taskInformationStatus = async (req: Request, res: Response) => {
  const account = req.body.account as Account;

  const taskStatus: {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
  } = {
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
  };

  try {
    taskStatus.total = await TaskModel.countDocuments({ userId: account._id });
    taskStatus.completed = await TaskModel.countDocuments({
      userId: account._id,
      isCompleted: true,
    });
    taskStatus.pending = await TaskModel.countDocuments({
      userId: account._id,
      dueDate: { $gt: new Date() },
    });
    taskStatus.overdue = await TaskModel.countDocuments({
      userId: account._id,
      dueDate: { $lt: new Date() },
      isCompleted: false,
    });

    res.status(200).json({
      taskStatus,
    });
  } catch (e) {
    res.status(500).json({
      message: "An unexpected error occurred in the server.",
    });
  }
};

export { getTasks, addTask, deleteTask, updateTask, taskInformationStatus };
