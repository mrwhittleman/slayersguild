import { useMemo } from "react";
import useWindowSize from "./useWindowSize";

export function usePerPage() {
  const { width } = useWindowSize();

  return useMemo(() => {
    if (width < 400) {
      return 8;
    } else if (width < 640) {
      return 12;
    } else if (width <= 768) {
      return 15;
    } else if (width <= 1920) {
      return 24;
    } else {
      return 40;
    }
  }, [width]);
}
