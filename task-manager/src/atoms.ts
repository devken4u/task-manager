import { atom } from "jotai";
import { Task } from "./types";
import { Tab } from "./types";

export const isProfileTabOpenAtom = atom(false);
export const isNewTaskTabOpenAtom = atom(false);
export const isNewAdminTabOpenAtom = atom(false);
export const currentTaskToEditAtom = atom<Task | null>(null);
export const currentTaskToViewAtom = atom<{
  title: string;
  description: string;
} | null>(null);
export const taskPriorityAtom = atom("");
export const taskStatusAtom = atom("");
export const selectedAdminTabAtom = atom<Tab | null>(null);
