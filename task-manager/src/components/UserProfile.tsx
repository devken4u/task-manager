import { useAtom } from "jotai";
import { isProfileTabOpenAtom } from "../atoms";
import Button from "./Button";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { logoutMutation } from "../api/mutations/UserMutation";
import Input from "./Input";
import { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import { IoCheckmarkSharp } from "react-icons/io5";
import { IoCloseSharp } from "react-icons/io5";
import {
  authenticateQuery,
  userInformationQuery,
} from "../api/queries/UserQuery";
import { updateUserNameMutation } from "../api/mutations/UserMutation";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getTasksInformationStatusQuery } from "../api/queries/TaskQuery";

type InformationFieldTypes = {
  isEditable: boolean;
  onEditFn?: (newValue: string) => void;
  data: string;
  id: string;
  fieldName: string;
};

function InformationField({
  isEditable,
  onEditFn,
  data,
  id,
  fieldName,
}: InformationFieldTypes) {
  const [isEditing, setIsEditing] = useState(false);
  const [isInputDisabled, setIsInputDisabled] = useState(true);
  const [value, setValue] = useState(data);

  useEffect(() => {
    setValue(data);
  }, [data]);

  function handleEditRequest() {
    if (onEditFn) {
      onEditFn(value);
    }
  }

  function ActionButton() {
    return (
      <>
        {isEditing ? (
          <div className="flex gap-1">
            <Button className="p-2 rounded-md bg-zinc-200">
              <IoCheckmarkSharp
                className="text-green-500 size-5"
                onClick={() => {
                  if (data !== value && value !== "") {
                    setIsEditing(false);
                    setIsInputDisabled(true);
                    handleEditRequest();
                  } else {
                    setIsEditing(false);
                    setIsInputDisabled(true);
                    setValue(data);
                  }
                }}
              />
            </Button>
            <Button
              className="p-2 rounded-md bg-zinc-200"
              onClick={() => {
                setIsEditing(false);
                setIsInputDisabled(true);
                setValue(data);
              }}
            >
              <IoCloseSharp className="text-red-500 size-5" />
            </Button>
          </div>
        ) : (
          <Button
            className="p-2 rounded-md bg-zinc-200"
            onClick={() => {
              setIsEditing(true);
              setIsInputDisabled(false);
            }}
          >
            <MdEdit className="size-5" />
          </Button>
        )}
      </>
    );
  }

  return (
    <div>
      <p className="text-zinc-500">{fieldName}</p>
      <div className="flex items-center gap-2">
        <div className="grow">
          <Input
            id={id}
            value={value}
            disabled={isInputDisabled}
            className="font-semibold"
            autoComplete="off"
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        {isEditable && <ActionButton />}
      </div>
    </div>
  );
}

function TaskStatus() {
  const status = getTasksInformationStatusQuery();

  return (
    <div className="p-2 mt-4 border-2 rounded border-zinc-400">
      <h1 className="mb-2 text-xl font-bold">Summary</h1>
      <div className="grid grid-cols-2">
        <div>
          <p className="font-semibold text-zinc-600">Total tasks</p>
          <p className="pl-2 text-2xl font-bold border-l-4 border-blue-300">
            {status.data?.taskStatus.total || 0}
          </p>
        </div>
        <div>
          <p className="font-semibold text-zinc-600">Completed tasks</p>
          <p className="pl-2 text-2xl font-bold border-l-4 border-green-300">
            {status.data?.taskStatus.completed || 0}
          </p>
        </div>
        <div>
          <p className="font-semibold text-zinc-600">Pending tasks</p>
          <p className="pl-2 text-2xl font-bold border-l-4 border-yellow-300">
            {status.data?.taskStatus.pending || 0}
          </p>
        </div>
        <div>
          <p className="font-semibold text-zinc-600">Overdue tasks</p>
          <p className="pl-2 text-2xl font-bold border-l-4 border-red-300">
            {status.data?.taskStatus.overdue || 0}
          </p>
        </div>
      </div>
    </div>
  );
}

function UserProfile() {
  const [_isProfileTabOpen, setIsProfileTabOpen] =
    useAtom(isProfileTabOpenAtom);
  const userInformation = userInformationQuery();
  const logout = logoutMutation();
  const updateUserName = updateUserNameMutation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const authenticate = authenticateQuery();

  useEffect(() => {
    if (logout.data) {
      window.location.reload();
    }
  }, [logout.data]);

  useEffect(() => {
    if (updateUserName.data) {
      queryClient.invalidateQueries({
        queryKey: ["user-information"],
      });
    }
  }, [updateUserName.data]);

  return (
    <div className="absolute top-0 left-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 size-full">
      <div className="relative p-4 rounded-md bg-zinc-50 w-96">
        <Button
          className="absolute right-2 top-2"
          onClick={() => setIsProfileTabOpen(false)}
        >
          <IoMdCloseCircleOutline className="size-7" />
        </Button>
        <h1 className="mb-2 text-2xl font-bold text-center">User Profile</h1>
        <div className="flex flex-col gap-1">
          <InformationField
            id="user-firstname"
            data={userInformation.data?.firstname || ""}
            isEditable={true}
            fieldName="First name"
            onEditFn={(newValue) => {
              updateUserName.mutate({ firstname: newValue });
            }}
          />
          <InformationField
            id="user-lastname"
            data={userInformation.data?.lastname || ""}
            isEditable={true}
            fieldName="Last name"
            onEditFn={(newValue) => {
              updateUserName.mutate({ lastname: newValue });
            }}
          />
          <InformationField
            id="user-email"
            data={userInformation.data?.email || ""}
            isEditable={false}
            fieldName="Email"
          />
        </div>
        {authenticate.data?.role === "user" && <TaskStatus />}

        <Button
          className="w-full py-1 mt-4 font-semibold bg-blue-500 rounded-md text-zinc-50"
          onClick={() => {
            setIsProfileTabOpen(false);
            navigate("/change-password");
          }}
        >
          Change password
        </Button>
        <Button
          isLoading={logout.isPending}
          className="w-full py-1 mt-2 font-semibold bg-blue-500 rounded-md text-zinc-50"
          onClick={() => {
            logout.mutate();
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}

export default UserProfile;
