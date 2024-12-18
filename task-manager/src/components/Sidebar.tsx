import { FaCubesStacked } from "react-icons/fa6";
import { LuClipboardCheck } from "react-icons/lu";
import { TbClockCheck } from "react-icons/tb";
import { LuAlarmClockOff } from "react-icons/lu";
import Button from "./Button";

function Sidebar() {
  const className = "size-6 text-zinc-500";

  return (
    <div className="px-8 py-4">
      <div className="flex flex-row md:flex-col items-center gap-6 justify-center">
        <Button>
          <FaCubesStacked className={className} />
        </Button>
        <Button>
          <LuClipboardCheck className={className} />
        </Button>
        <Button>
          <TbClockCheck className={className} />
        </Button>
        <Button>
          <LuAlarmClockOff className={className} />
        </Button>
      </div>
    </div>
  );
}

export default Sidebar;
