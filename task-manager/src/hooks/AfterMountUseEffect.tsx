import { useRef, useEffect } from "react";

function AfterMountUseEffect(fn: () => void, dependency: any[]) {
  // initiate ref os isMounted and set it to false in first mount
  const isMounted = useRef(false);

  useEffect(() => {
    // check if the component is already mounted
    // set mounted to true and return
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    // this function will run if the component is not mounted the first time
    fn();
  }, dependency);
}

export default AfterMountUseEffect;
