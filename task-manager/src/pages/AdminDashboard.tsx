import Layout from "../components/Layout";
import Authenticate from "../components/Authenticate";
import { useAtom } from "jotai";
import { selectedAdminTabAtom } from "../atoms";
import clsx from "clsx";
import { twMerge } from "tw-merge";
import { useEffect } from "react";
import { Tab as TabType } from "../types";
import UserListPanel from "../components/admin-components/UserListPanel";
import AdminListPanel from "../components/admin-components/AdminListPanel";
import { authenticateQuery } from "../api/queries/UserQuery";

function AdminTab({ tabs }: { tabs: TabType[] }) {
  const [_, setSelectedAdminTab] = useAtom(selectedAdminTabAtom);
  const authenticate = authenticateQuery();

  useEffect(() => {
    setSelectedAdminTab(tabs[0]);
  }, []);

  return (
    <>
      {authenticate.data && (
        <div className="flex flex-row w-full gap-2 p-4 rounded-md shadow-md md:flex-col md:w-44 bg-zinc-50 shrink-0">
          {tabs.map((tab) => {
            if (
              tab.id === "admin-tab" &&
              authenticate.data?.role !== "super-admin"
            ) {
              return null;
            }
            return (
              <Tab tabName={tab.tabName} tabPanel={tab.tabPanel} key={tab.id} />
            );
          })}
        </div>
      )}
    </>
  );
}

function Tab(tab: TabType) {
  const [selectedAdminTab, setSelectedAdminTab] = useAtom(selectedAdminTabAtom);

  return (
    <div
      onClick={() => {
        setSelectedAdminTab(tab);
      }}
      className={twMerge(
        clsx(
          "p-2 font-bold text-center border-b-4 rounded-md shadow-inner bg-zinc-200 border-transparent cursor-pointer",
          selectedAdminTab?.tabName === tab.tabName && "border-zinc-900"
        )
      )}
    >
      {tab.tabName}
    </div>
  );
}

function AdminPanel() {
  const [selectedAdminTab, _] = useAtom(selectedAdminTabAtom);

  return (
    <div className="h-full overflow-auto rounded-md shadow-md bg-zinc-50 grow">
      {selectedAdminTab?.tabPanel}
    </div>
  );
}

export default function AdminDashboard() {
  const tabs: TabType[] = [
    {
      tabName: "User List",
      id: "user-tab",
      tabPanel: <UserListPanel />,
    },
    {
      tabName: "Admin List",
      id: "admin-tab",
      tabPanel: <AdminListPanel />,
    },
  ];

  return (
    <Authenticate redirectIfAuthenticated={false} unauthenticatedPath="/">
      <Layout>
        <div className="flex flex-col gap-2 size-full md:flex-row">
          <AdminTab tabs={tabs} />
          <AdminPanel />
        </div>
      </Layout>
    </Authenticate>
  );
}
