import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { Task, TaskStatus } from "../../types";

const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL;

type TaskQueryResponse = {
  tasks: Task[];
  nextPage: number | null;
  currentPage: number;
  totalTasks: number;
};

const getTasksQuery = ({
  status = "",
  priority = "low",
}: {
  status?: string;
  priority?: string;
}) => {
  return useInfiniteQuery<TaskQueryResponse>({
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    queryKey: ["tasks", status, priority],
    queryFn: async ({ queryKey, pageParam }) => {
      let [_, statusQuery, priorityQuery] = queryKey;

      switch (statusQuery) {
        case "completed":
          statusQuery = "isCompleted=true&";
          break;
        case "pending":
          statusQuery = "status=pending&";
          break;
        case "overdue":
          statusQuery = "status=overdue&";
          break;
      }

      return axios
        .get(
          `${backendBaseUrl}/api/v1/tasks?${statusQuery}priority=${priorityQuery}&limit=10&offset=${pageParam}`,
          {
            withCredentials: true,
          }
        )
        .then((response) => response.data);
    },
  });
};

const getTasksInformationStatusQuery = () => {
  return useQuery({
    queryKey: ["tasks", "status"],
    queryFn: async () => {
      return axios
        .get<{ taskStatus: TaskStatus }>(
          `${backendBaseUrl}/api/v1/tasks/information-status`,
          {
            withCredentials: true,
          }
        )
        .then((response) => response.data);
    },
  });
};

export { getTasksQuery, getTasksInformationStatusQuery };
