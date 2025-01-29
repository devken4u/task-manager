import { FaCubesStacked } from "react-icons/fa6";
import { LuClipboardCheck } from "react-icons/lu";
import { TbClockCheck } from "react-icons/tb";
import { LuAlarmClockOff } from "react-icons/lu";
import Button from "./Button";
import { useAtom } from "jotai";
import { taskStatusAtom } from "../atoms";
import clsx from "clsx";
import { ReactNode } from "react";
import { twMerge } from "tw-merge";

function Tooltip({
  children,
  tooltip,
}: {
  children: ReactNode;
  tooltip: string;
}) {
  return (
    <div className="relative flex justify-center group">
      <p className="absolute px-2 py-1 mt-4 font-semibold text-yellow-300 transition-opacity rounded-md opacity-0 pointer-events-none top-full bg-zinc-800 w-max group-active:opacity-100 md:mt-0 md:ml-4 md:left-full md:top-0 md:group-hover:opacity-100">
        {tooltip}
      </p>
      {children}
    </div>
  );
}

function TaskStatus() {
  const [taskStatus, setTaskStatus] = useAtom(taskStatusAtom);

  const statusButtons = [
    {
      id: "all-task",
      status: "",
      tooltip: "all task",
      icon: FaCubesStacked,
    },
    {
      id: "completed",
      status: "completed",
      tooltip: "completed",
      icon: LuClipboardCheck,
    },
    {
      id: "pending",
      status: "pending",
      tooltip: "pending",
      icon: TbClockCheck,
    },
    {
      id: "overdue",
      status: "overdue",
      tooltip: "overdue",
      icon: LuAlarmClockOff,
    },
  ];

  return (
    <div className="px-8 py-4">
      <div className="flex flex-row items-center justify-center gap-6 md:flex-col">
        {statusButtons.map((element) => {
          return (
            <Tooltip tooltip={element.tooltip} key={element.id}>
              <Button
                onClick={() => {
                  setTaskStatus(element.status);
                }}
              >
                <element.icon
                  className={twMerge(
                    clsx(
                      "text-zinc-500 size-7",
                      taskStatus === element.status && "text-yellow-500"
                    )
                  )}
                />
              </Button>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}

export default TaskStatus;
