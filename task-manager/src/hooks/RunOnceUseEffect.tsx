import { useEffect, useRef } from "react";

export default function RunOnceUseEffect(fn: () => {}, dependency: any[]) {
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      fn();
      isMounted.current = true;
    }
  }, dependency);
}
