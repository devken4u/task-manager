import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  IsAuthenticatedResponse,
  UserInformation,
  UserList,
} from "../../types";

const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL;

const authenticateQuery = () => {
  return useQuery({
    queryKey: ["authenticated"],
    queryFn: () =>
      axios
        .get<IsAuthenticatedResponse>(
          `${backendBaseUrl}/api/v1/users/is-authenticated`,
          {
            withCredentials: true,
          }
        )
        .then((response) => response.data),
    gcTime: 0,
  });
};

const userInformationQuery = () => {
  return useQuery({
    queryKey: ["user-information"],
    queryFn: () =>
      axios
        .get<UserInformation>(`${backendBaseUrl}/api/v1/users/information`, {
          withCredentials: true,
        })
        .then((response) => response.data),
  });
};

const checkEmailIfExistingQuery = (email: string) => {
  return useQuery({
    queryKey: ["check-email", email],
    queryFn: () => {
      return axios.get<{
        isEmailFound: boolean;
      }>(`${backendBaseUrl}/api/v1/users/check-email?email=${email}`);
    },
    enabled: false,
    retry: 1,
  });
};

const getUserListQuery = (
  itemPerPage: number,
  currentPage: number,
  sortBy: string,
  similar: string
) => {
  return useQuery({
    queryKey: ["users", currentPage, sortBy, similar],
    queryFn: async () => {
      return axios
        .get<{ userInformationList: UserList[]; totalUser: number }>(
          `${backendBaseUrl}/api/v1/users?itemPerPage=${itemPerPage}&currentPage=${currentPage}&sortBy=${sortBy}&similar=${similar}`,
          {
            withCredentials: true,
          }
        )
        .then((response) => response.data);
    },
  });
};

const getAdminListQuery = (
  itemPerPage: number,
  currentPage: number,
  sortBy: string,
  similar: string
) => {
  return useQuery({
    queryKey: ["admins", currentPage, sortBy, similar],
    queryFn: async () => {
      return axios
        .get<{ adminInformationList: UserList[]; totalAdmin: number }>(
          `${backendBaseUrl}/api/v1/users/admin?itemPerPage=${itemPerPage}&currentPage=${currentPage}&sortBy=${sortBy}&similar=${similar}`,
          {
            withCredentials: true,
          }
        )
        .then((response) => response.data);
    },
  });
};

export {
  authenticateQuery,
  userInformationQuery,
  checkEmailIfExistingQuery,
  getUserListQuery,
  getAdminListQuery,
};
