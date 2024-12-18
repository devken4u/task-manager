import { GiHamburgerMenu } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import PageIcon from "./PageIcon";
import Button from "./Button";
import { logoutMutation } from "../api/mutations/UserMutation";
import { useEffect } from "react";
import { Link } from "react-router-dom";

function Header() {
  const isLogin = false;

  const logout = logoutMutation();

  useEffect(() => {
    if (logout.data) {
      window.location.reload();
    }
  }, [logout.data]);

  return (
    <header className="px-6 py-4">
      <div className="flex items-center justify-between">
        {/*  */}
        <div className="flex items-center gap-8 shrink-0">
          <Link to="/">
            <PageIcon />
          </Link>
          <div>
            <h1 className="text-xl font-bold sm:text-2xl">
              Welcome to TaskHive
            </h1>
            <p>Please login to see your tasks.</p>
          </div>
        </div>
        {/*  */}
        <div>
          {!isLogin && (
            <>
              <div className="hidden gap-2 md:flex">
                <Button
                  onClick={() => {
                    logout.mutate();
                  }}
                  className="px-4 py-2 font-bold bg-blue-500 rounded-full text-zinc-50 min-w-28"
                >
                  Logout
                </Button>
                <Button className="px-4 py-2 font-bold bg-blue-500 rounded-full text-zinc-50 min-w-28">
                  Register
                </Button>
                <Button className="px-4 py-2 font-bold bg-blue-500 rounded-full text-zinc-50 min-w-28">
                  Login
                </Button>
              </div>
              <div className="block md:hidden">
                <Button>
                  <CgProfile className="text-blue-500 size-8" />
                </Button>
              </div>
            </>
          )}

          <div className="flex items-center gap-4">
            {isLogin && (
              <div className="flex gap-4">
                <Button>
                  <GiHamburgerMenu className="size-6" />
                </Button>
                <Button>
                  <CgProfile className="text-blue-500 size-8" />
                </Button>
              </div>
            )}
          </div>
        </div>
        {/*  */}
      </div>
    </header>
  );
}

export default Header;
