export type LoginData = {
  email: string;
  password: string;
};

export type RegisterData = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type IsAuthenticatedResponse = {
  isAuthenticated: boolean;
  role: "user" | "admin" | "super-admin";
  isEmailVerified: boolean;
};

export type UserInformation = {
  email: string;
  firstname: string;
  lastname: string;
  role: string;
};

export type Task = {
  _id: string;
  title: string;
  description: string;
  isFavorite: boolean;
  isCompleted: boolean;
  priority: "low" | "medium" | "high";
  dueDate: Date;
  createdAt: Date;
};

export type NewTask = {
  title: string;
  description: string;
  isCompleted: boolean;
  dueDate: Date;
  dueTime?: string;
  priority: "low" | "medium" | "high";
};

export type EditTask = NewTask & {
  isFavorite: boolean;
  taskId: string;
};

export type TaskStatus = {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
};

export type Tab = {
  tabName: string;
  id?: string;
  tabPanel: JSX.Element;
};

export type UserList = {
  _id: string;
  email: string;
  totalTask: number;
  firstname: string;
  lastname: string;
  isEmailVerified: boolean;
  role: "user" | "admin" | "super-admin";
};
