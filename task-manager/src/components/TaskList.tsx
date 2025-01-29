import Task from "./Task";
import { getTasksQuery } from "../api/queries/TaskQuery";
import { useAtom } from "jotai";
import { taskStatusAtom } from "../atoms";
import { taskPriorityAtom } from "../atoms";
import Button from "./Button";
import { isNewTaskTabOpenAtom } from "../atoms";
import { Fragment } from "react/jsx-runtime";
import { useInView } from "react-intersection-observer";
import { forwardRef, useEffect } from "react";

const CreateNewTask = forwardRef<HTMLDivElement>((_props, ref) => {
  const [_, setIsNewTaskTabOpen] = useAtom(isNewTaskTabOpenAtom);

  return (
    <div
      ref={ref}
      className="flex items-center justify-center font-bold border-2 border-dashed border-zinc-500 hover:bg-zinc-900/10"
    >
      <Button
        className="size-full text-zinc-500"
        onClick={() => {
          setIsNewTaskTabOpen(true);
        }}
      >
        Create New Task
      </Button>
    </div>
  );
});

function TaskList() {
  const [status] = useAtom(taskStatusAtom);
  const [priority] = useAtom(taskPriorityAtom);
  const getTask = getTasksQuery({ status, priority });
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      getTask.fetchNextPage();
    }
  }, [inView, getTask.isFetched]);

  return (
    <div className="overflow-auto grow">
      <div
        className="grid justify-center gap-5"
        style={{
          gridAutoRows: "13rem",
          gridTemplateColumns: "repeat(auto-fill, minmax(19rem, 1fr))",
        }}
      >
        {getTask.data?.pages.map((page) => {
          return (
            <Fragment key={page.currentPage}>
              {page.tasks.map((task) => (
                <Task
                  isFavorite={task.isFavorite}
                  priority={task.priority}
                  title={task.title}
                  description={task.description}
                  key={task._id}
                  _id={task._id}
                  isCompleted={task.isCompleted}
                  dueDate={task.dueDate}
                  createdAt={task.createdAt}
                />
              ))}
            </Fragment>
          );
        })}
        <CreateNewTask ref={ref} />
      </div>
      {getTask.isFetchingNextPage && (
        <p className="text-xl font-bold text-center ">Loading...</p>
      )}
    </div>
  );
}

export default TaskList;
