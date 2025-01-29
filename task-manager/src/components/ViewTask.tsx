import { useAtom } from "jotai";
import { currentTaskToViewAtom } from "../atoms";
import Button from "./Button";

export default function ViewTask() {
  const [currentTaskToView, setCurrentTaskToView] = useAtom(
    currentTaskToViewAtom
  );

  return (
    <div className="absolute z-50 flex items-center justify-center p-4 size-full bg-zinc-900/40">
      <div className="flex flex-col max-h-full gap-2 p-4 overflow-hidden rounded-md bg-zinc-50 w-96 h-96">
        <p className="p-2 mb-2 font-bold border rounded-md border-zinc-900">
          {currentTaskToView?.title}
        </p>
        <textarea
          className="w-full p-2 border rounded-md outline-none resize-none border-zinc-600 grow"
          defaultValue={currentTaskToView?.description}
          readOnly
        />
        <Button
          className="w-full p-2 font-semibold text-center bg-blue-500 rounded-md text-zinc-50"
          onClick={() => {
            setCurrentTaskToView(null);
          }}
        >
          Close Task
        </Button>
      </div>
    </div>
  );
}
