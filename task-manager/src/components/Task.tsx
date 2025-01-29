import { Task as TaskParameters } from "../types";
import clsx from "clsx";
import Button from "./Button";
import { FaStar } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { deleteTaskMutation } from "../api/mutations/TaskMutation";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateTaskMutation } from "../api/mutations/TaskMutation";
import { currentTaskToEditAtom, currentTaskToViewAtom } from "../atoms";
import { useAtom } from "jotai";
import { calculateElapsedDate } from "../utils";

function TaskElapsedTime({ time }: { time: Date }) {
  const [elapsedTime, setElapsedTime] = useState("...");

  useEffect(() => {
    const intervalId = setInterval(() => {
      setElapsedTime(calculateElapsedDate(time));
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return <p className="font-semibold text-zinc-600">{elapsedTime}</p>;
}

function TaskActions({
  priority,
  isFavorite,
  taskId,
  editFn,
}: {
  taskId: string;
  priority: "low" | "medium" | "high";
  isFavorite: boolean;
  editFn: () => void;
}) {
  const deleteTask = deleteTaskMutation();
  const queryClient = useQueryClient();
  const updateTask = updateTaskMutation();

  useEffect(() => {
    if (deleteTask.data) {
      (async () => {
        await queryClient.invalidateQueries({
          queryKey: ["tasks"],
        });
        toast.success("TASK DELETED");
      })();
    }
  }, [deleteTask.data]);

  useEffect(() => {
    if (updateTask.data) {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    }
  }, [updateTask.data]);

  return (
    <>
      <p
        className={clsx(
          {
            "text-green-500": priority === "low",
            "text-yellow-500": priority === "medium",
            "text-red-500": priority === "high",
          },
          "font-semibold"
        )}
      >
        {priority?.toUpperCase()[0] + priority?.substring(1).toLowerCase()}
      </p>
      <div className="flex gap-2">
        {isFavorite ? (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              if (!updateTask.isPending) {
                updateTask.mutate({ taskId, isFavorite: false });
              }
            }}
          >
            <FaStar className="text-yellow-500 size-5" />
          </Button>
        ) : (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              if (!updateTask.isPending) {
                updateTask.mutate({ taskId, isFavorite: true });
              }
            }}
          >
            <FaRegStar className="text-yellow-500 size-5" />
          </Button>
        )}
        <Button
          onClick={(e) => {
            e.stopPropagation();
            editFn();
          }}
        >
          <FaEdit className="text-blue-500 size-5" />
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            if (!deleteTask.isPending) deleteTask.mutate(taskId);
          }}
        >
          <FaTrash className="text-red-500 size-5" />
        </Button>
      </div>
    </>
  );
}

function Task({
  title = "",
  description = "",
  priority,
  isFavorite,
  _id,
  dueDate,
  isCompleted,
  createdAt,
}: TaskParameters) {
  const [_, setCurrentTaskToEdit] = useAtom(currentTaskToEditAtom);
  const [_1, setCurrentTaskToView] = useAtom(currentTaskToViewAtom);

  return (
    <div
      className="flex flex-col h-full p-4 border-2 border-transparent rounded-md cursor-pointer bg-zinc-50 hover:border-yellow-400"
      onClick={() => {
        setCurrentTaskToView({ description, title });
      }}
    >
      <div>
        <h1
          className={clsx(
            "text-xl font-bold line-clamp-2",
            isCompleted && "text-green-600"
          )}
        >
          {title}
        </h1>
      </div>
      <textarea
        className="overflow-hidden bg-transparent outline-none pointer-events-none ret-2 grow"
        readOnly
        value={description}
      />
      <div className="flex items-center justify-between">
        <TaskElapsedTime time={new Date(createdAt)} />
        <TaskActions
          priority={priority}
          isFavorite={isFavorite}
          taskId={_id!}
          editFn={() => {
            const task: TaskParameters = {
              title,
              description,
              priority,
              dueDate,
              isCompleted,
              isFavorite,
              _id,
              createdAt,
            };
            setCurrentTaskToEdit(task);
          }}
        />
      </div>
    </div>
  );
}

export default Task;
