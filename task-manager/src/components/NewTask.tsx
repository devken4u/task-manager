import Button from "./Button";
import Input from "./Input";
import { useAtom } from "jotai";
import {
  isNewTaskTabOpenAtom,
  taskPriorityAtom,
  taskStatusAtom,
} from "../atoms";
import { useForm } from "react-hook-form";
import { createNewTaskMutation } from "../api/mutations/TaskMutation";
import { NewTask as NewTaskType } from "../types";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getTasksQuery } from "../api/queries/TaskQuery";

function NewTask() {
  const [_, setIsNewTabOpen] = useAtom(isNewTaskTabOpenAtom);
  const dateToday = new Date().toLocaleDateString("en-CA").split(",")[0];
  const { register, handleSubmit } = useForm<NewTaskType>();
  const createNewTask = createNewTaskMutation();
  const queryClient = useQueryClient();
  const [status] = useAtom(taskStatusAtom);
  const [priority] = useAtom(taskPriorityAtom);
  const getTask = getTasksQuery({ status, priority });

  useEffect(() => {
    if (createNewTask.data) {
      setIsNewTabOpen(false);
      (async () => {
        await queryClient.invalidateQueries({
          queryKey: ["tasks"],
          exact: false,
        });
        getTask.fetchNextPage();
      })();
    }
  }, [createNewTask.data]);

  function handleNewTaskSubmit(data: NewTaskType) {
    const due = new Date(data.dueDate + "T00:00:00");
    createNewTask.mutate({
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
    });
  }

  return (
    <div className="absolute top-0 left-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 size-full">
      <form
        className="relative flex flex-col gap-4 p-4 rounded-md bg-zinc-50 w-96"
        onSubmit={handleSubmit(handleNewTaskSubmit)}
      >
        <div>
          <h1 className="text-xl font-bold text-center">CREATE NEW TASK</h1>
          <Input
            id="title"
            label="Title"
            placeholder="Enter title"
            labelStyle="font-bold"
            defaultValue="New Task"
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
            className="p-2 border rounded-md resize-none border-zinc-600 outline-blue-500"
          ></textarea>
        </div>
        <div>
          <label htmlFor="priority" className="block font-bold text-zinc-600">
            Priority
          </label>
          <select
            {...register("priority")}
            defaultValue="low"
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
              defaultValue={dateToday}
            />
            <Input registerForm={register("dueTime")} type="time" id="time" />
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
            defaultValue="no"
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
              setIsNewTabOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            isLoading={createNewTask.isPending}
            className="p-2 font-semibold bg-blue-500 rounded-md text-zinc-50"
            type="submit"
          >
            Create Task
          </Button>
        </div>
      </form>
    </div>
  );
}

export default NewTask;
