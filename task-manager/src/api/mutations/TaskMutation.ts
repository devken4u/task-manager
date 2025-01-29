import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { NewTask } from "../../types";

const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL;

const createNewTaskMutation = () => {
  return useMutation({
    mutationFn: async ({
      description = "",
      dueDate = new Date(),
      isCompleted = false,
      priority = "low",
      title = "",
    }: NewTask) => {
      return axios
        .post(
          `${backendBaseUrl}/api/v1/tasks/new`,
          {
            description,
            dueDate,
            isCompleted,
            priority,
            title,
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => response.data);
    },
  });
};

const deleteTaskMutation = () => {
  return useMutation({
    mutationFn: async (taskId: string) => {
      return axios
        .delete(`${backendBaseUrl}/api/v1/tasks/delete/${taskId}`, {
          withCredentials: true,
        })
        .then((response) => response.data);
    },
  });
};

const updateTaskMutation = () => {
  return useMutation({
    mutationFn: async ({
      taskId,
      title,
      description,
      dueDate,
      priority,
      isCompleted,
      isFavorite,
    }: {
      taskId: string;
      title?: string;
      description?: string;
      dueDate?: Date;
      priority?: string;
      isCompleted?: boolean;
      isFavorite?: boolean;
    }) => {
      return axios
        .put(
          `${backendBaseUrl}/api/v1/tasks/update/${taskId}`,
          { title, description, dueDate, priority, isCompleted, isFavorite },
          { withCredentials: true }
        )
        .then((response) => response);
    },
  });
};

export { createNewTaskMutation, deleteTaskMutation, updateTaskMutation };
