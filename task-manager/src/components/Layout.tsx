import { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

type Layout = {
  children: ReactNode;
};

function Layout({ children }: Layout) {
  return (
    <div className="flex flex-col bg-zinc-50 h-svh">
      <Header />
      <div className="flex w-full grow flex-col md:flex-row">
        <Sidebar />
        <div className="w-full p-4 bg-zinc-200 rounded-3xl grow gradient">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;
