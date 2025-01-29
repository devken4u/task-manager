import { CgProfile } from "react-icons/cg";
import PageIcon from "./PageIcon";
import { Link } from "react-router-dom";
import {
  authenticateQuery,
  userInformationQuery,
} from "../api/queries/UserQuery";
import { isProfileTabOpenAtom } from "../atoms";
import { useAtom } from "jotai";
import { getTasksInformationStatusQuery } from "../api/queries/TaskQuery";

function Greeting() {
  const userInformation = userInformationQuery();
  const [_isProfileTabOpen, setIsProfileTabOpen] =
    useAtom(isProfileTabOpenAtom);
  const status = getTasksInformationStatusQuery();
  const authenticate = authenticateQuery();

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-4 sm:gap-8 shrink-0">
        <Link to="/">
          <PageIcon />
        </Link>
        <div>
          <h1 className="text-base font-bold sm:text-2xl">
            {userInformation.data?.firstname
              ? `Welcome, ${userInformation.data.firstname}`
              : "Welcome to TaskHive"}
          </h1>
          {authenticate.data?.role === "user" && (
            <>
              {status.data?.taskStatus && (
                <p className="text-base sm:text-xl">
                  You have {status.data.taskStatus.pending} active task(s).
                </p>
              )}
            </>
          )}
          {authenticate.data?.isAuthenticated === false && (
            <p className="text-base sm:text-xl">
              Please login to see your tasks.
            </p>
          )}
        </div>
      </div>
      <div>
        {userInformation.data?.email && (
          <CgProfile
            className="cursor-pointer text-zinc-900 size-8"
            onClick={() => setIsProfileTabOpen(true)}
          />
        )}
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="px-6 py-4">
      <Greeting />
    </header>
  );
}

export default Header;
