import { Task } from "../types";
import Button from "./Button";
import Input from "./Input";
import { useAtom } from "jotai";
import { useForm } from "react-hook-form";
import { EditTask as EditTaskType } from "../types";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { currentTaskToEditAtom } from "../atoms";
import { updateTaskMutation } from "../api/mutations/TaskMutation";
import { deleteTaskMutation } from "../api/mutations/TaskMutation";
import { toast } from "sonner";

function EditTask({ task }: { task: Task }) {
  const [_, setCurrentTaskToEdit] = useAtom(currentTaskToEditAtom);
  const { register, handleSubmit } = useForm<EditTaskType>();
  const updateTask = updateTaskMutation();
  const queryClient = useQueryClient();
  const deleteTask = deleteTaskMutation();

  useEffect(() => {
    if (deleteTask.data) {
      toast.success("TASK DELETED");
      setCurrentTaskToEdit(null);
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    }
  }, [deleteTask.data]);

  useEffect(() => {
    if (updateTask.data) {
      toast.success("TASK UPDATED");
      setCurrentTaskToEdit(null);
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    }
  }, [updateTask.data]);

  function handleNewTaskSubmit(data: EditTaskType) {
    const due = new Date(data.dueDate + "T00:00:00");
    updateTask.mutate({
      description: data.description,
      dueDate: new Date(
        due.getFullYear(),
        due.getMonth(),
        due.getDate(),
        Number(data.dueTime?.split(":")[0]) || new Date().getHours(),
        Number(data.dueTime?.split(":")[1] || new Date().getMinutes())
      ),
      isCompleted: data.isCompleted,
      priority: data.priority,
      title: data.title,
      taskId: task._id,
      isFavorite: data.isFavorite,
    });
  }

  return (
    <div className="absolute top-0 left-0 z-50 flex items-start justify-center p-4 overflow-y-auto bg-zinc-900/40 size-full">
      <form
        className="relative flex flex-col max-w-full gap-4 p-4 rounded-md bg-zinc-50 w-96 shrink-0"
        onSubmit={handleSubmit(handleNewTaskSubmit)}
      >
        <div>
          <h1 className="text-xl font-bold text-center">EDIT TASK</h1>
          <Input
            id="title"
            label="Title"
            placeholder="Enter title"
            labelStyle="font-bold"
            defaultValue={task.title}
            registerForm={register("title")}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="description" className="font-bold text-zinc-600">
            Description
          </label>
          <textarea
            {...register("description")}
            id="description"
            placeholder="Enter description"
            rows={4}
            defaultValue={task.description}
            className="p-2 border rounded-md resize-none border-zinc-600 outline-blue-500"
          ></textarea>
        </div>
        <div>
          <label htmlFor="priority" className="block font-bold text-zinc-600">
            Priority
          </label>
          <select
            {...register("priority")}
            defaultValue={task.priority}
            id="priority"
            className="w-full p-2 border rounded-md border-zinc-600"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label htmlFor="priority" className="block font-bold text-zinc-600">
            Due date
          </label>
          <div className="flex gap-2">
            <Input
              registerForm={register("dueDate")}
              type="date"
              id="due-date"
              defaultValue={`${new Date(task.dueDate).getFullYear()}-${String(
                new Date(task.dueDate).getMonth() + 1
              ).padStart(2, "0")}-${String(
                new Date(task.dueDate).getDate()
              ).padStart(2, "0")}`}
            />
            <Input
              registerForm={register("dueTime")}
              type="time"
              id="time"
              defaultValue={`${String(
                new Date(task.dueDate).getHours()
              ).padStart(2, "0")}:${String(
                new Date(task.dueDate).getMinutes()
              ).padStart(2, "0")}`}
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="task-completed"
            className="block font-bold text-zinc-600"
          >
            Task Completed
          </label>
          <select
            {...register("isCompleted")}
            defaultValue={task.isCompleted ? "yes" : "no"}
            id="task-completed"
            className="w-full p-2 border rounded-md border-zinc-600"
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="task-completed"
            className="block font-bold text-zinc-600"
          >
            Favorite
          </label>
          <select
            {...register("isFavorite")}
            defaultValue={task.isFavorite ? "yes" : "no"}
            id="task-completed"
            className="w-full p-2 border rounded-md border-zinc-600"
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            className="p-2 font-semibold bg-red-500 rounded-md text-zinc-50"
            type="button"
            onClick={() => {
              setCurrentTaskToEdit(null);
            }}
          >
            Cancel Edit Task
          </Button>
          <Button
            isLoading={deleteTask.isPending}
            className="p-2 font-semibold bg-red-500 rounded-md text-zinc-50"
            type="button"
            onClick={() => {
              deleteTask.mutate(task._id);
            }}
          >
            Delete Task
          </Button>
          <Button
            isLoading={updateTask.isPending}
            className="p-2 font-semibold bg-blue-500 rounded-md text-zinc-50"
            type="submit"
          >
            Update Task
          </Button>
        </div>
      </form>
    </div>
  );
}

export default EditTask;
