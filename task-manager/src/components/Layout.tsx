import { ReactNode } from "react";
import Header from "./Header";
import TaskStatus from "./TaskStatus";
import UserProfile from "./UserProfile";
import EditTask from "./EditTask";
import NewTask from "./NewTask";
import ViewTask from "./ViewTask";
import NewAdmin from "./NewAdmin";
import { useAtom } from "jotai";
import {
  isProfileTabOpenAtom,
  isNewTaskTabOpenAtom,
  currentTaskToEditAtom,
  currentTaskToViewAtom,
  isNewAdminTabOpenAtom,
} from "../atoms";
import { authenticateQuery } from "../api/queries/UserQuery";
import { Toaster } from "sonner";

type Layout = {
  children: ReactNode;
};

function Layout({ children }: Layout) {
  const [isProfileTabOpen] = useAtom(isProfileTabOpenAtom);
  const [isNewTaskTabOpen] = useAtom(isNewTaskTabOpenAtom);
  const [currentTaskToEdit] = useAtom(currentTaskToEditAtom);
  const [currentTaskToView] = useAtom(currentTaskToViewAtom);
  const [isNewAdminTabOpen] = useAtom(isNewAdminTabOpenAtom);
  const authenticate = authenticateQuery();

  return (
    <div className="flex flex-col bg-zinc-50 h-svh">
      {isProfileTabOpen && <UserProfile />}
      {isNewTaskTabOpen && <NewTask />}
      {isNewAdminTabOpen && <NewAdmin />}
      {currentTaskToEdit !== null && <EditTask task={currentTaskToEdit!} />}
      {currentTaskToView !== null && <ViewTask />}
      <Toaster richColors position="bottom-right" closeButton />
      <Header />
      <div className="flex flex-col w-full overflow-hidden grow md:flex-row">
        {authenticate.data?.role === "user" && <TaskStatus />}
        <div className="w-full p-4 overflow-hidden bg-zinc-200 rounded-t-3xl md:rounded-3xl grow gradient">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;
