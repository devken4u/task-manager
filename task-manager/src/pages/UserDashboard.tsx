import Layout from "../components/Layout";
import Authenticate from "../components/Authenticate";
import Button from "../components/Button";
import { useAtom } from "jotai";
import { taskPriorityAtom } from "../atoms";
import { taskStatusAtom } from "../atoms";
import clsx from "clsx";
import { useEffect, useState } from "react";
import TaskList from "../components/TaskList";
import { FaPlus } from "react-icons/fa6";
import { isNewTaskTabOpenAtom } from "../atoms";

function PrioritySort() {
  const [taskPriority, setTaskPriority] = useAtom(taskPriorityAtom);

  return (
    <div className="flex gap-2 p-2 rounded-md bg-zinc-50">
      <Button
        onClick={() => {
          setTaskPriority("");
        }}
        className={clsx(
          "text-sm font-bold w-16 bg-zinc-100 text-zinc-500 rounded-md py-1 ",
          taskPriority === "" && "bg-zinc-700 text-yellow-300"
        )}
      >
        All
      </Button>
      <Button
        onClick={() => {
          setTaskPriority("low");
        }}
        className={clsx(
          "text-sm font-bold w-16 bg-zinc-100 text-zinc-500 rounded-md py-1 ",
          taskPriority === "low" && "bg-zinc-700 text-yellow-300"
        )}
      >
        Low
      </Button>
      <Button
        onClick={() => {
          setTaskPriority("medium");
        }}
        className={clsx(
          "text-sm font-bold w-16 bg-zinc-100 text-zinc-500 rounded-md py-1 ",
          taskPriority === "medium" && "bg-zinc-700 text-yellow-300"
        )}
      >
        Medium
      </Button>
      <Button
        onClick={() => {
          setTaskPriority("high");
        }}
        className={clsx(
          "text-sm font-bold w-16 bg-zinc-100 text-zinc-500 rounded-md py-1 ",
          taskPriority === "high" && "bg-zinc-700 text-yellow-300"
        )}
      >
        High
      </Button>
    </div>
  );
}

function TasksTitle() {
  const [taskStatus] = useAtom(taskStatusAtom);
  const [title, setTitle] = useState("");

  useEffect(() => {
    switch (taskStatus) {
      case "completed":
        setTitle("Completed Tasks");
        break;
      case "pending":
        setTitle("Pending Tasks");
        break;
      case "overdue":
        setTitle("Overdue Tasks");
        break;
      default:
        setTitle("All Tasks");
        break;
    }
  }, [taskStatus]);

  return <h1 className="text-2xl font-bold">{title}</h1>;
}

function TasksHeader() {
  const [_, setIsNewTaskTabOpenAtom] = useAtom(isNewTaskTabOpenAtom);

  return (
    <div className="flex flex-col items-center justify-between gap-3 mb-5 md:flex-row">
      <TasksTitle />
      <div className="hidden gap-4 md:flex">
        <Button
          className="px-2 font-semibold bg-blue-500 rounded-md text-zinc text-zinc-50"
          onClick={() => {
            setIsNewTaskTabOpenAtom(true);
          }}
        >
          <div className="flex items-center gap-2">
            Add Task
            <FaPlus />
          </div>
        </Button>
        <PrioritySort />
      </div>
    </div>
  );
}

function UserDashboard() {
  const [_, setIsNewTaskTabOpenAtom] = useAtom(isNewTaskTabOpenAtom);

  return (
    <Authenticate unauthenticatedPath="/" redirectIfAuthenticated={false}>
      <Layout>
        <div className="relative flex flex-col size-full">
          <TasksHeader />
          <TaskList />
          <div className="absolute bg-blue-500 rounded-full right-12 bottom-6 md:hidden">
            <Button
              className="flex items-center justify-center size-14"
              onClick={() => {
                setIsNewTaskTabOpenAtom(true);
              }}
            >
              <FaPlus className="text-zinc-50 size-6" />
            </Button>
          </div>
        </div>
      </Layout>
    </Authenticate>
  );
}

export default UserDashboard;
