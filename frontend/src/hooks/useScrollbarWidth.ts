import { useEffect, useRef, useState } from "react";
import { debounce } from "../utils/debounce";

// Taken from
// https://github.com/shawnmcknight/react-scrollbar-size/blob/16d39fca0347e2a24ad4f347b0633c9ec4ce05fd/src/useScrollbarSize.ts#L11
// and simplified to only return the width
export const useScrollbarWidth = () => {
  const [dimensions, setDimensions] = useState(0);
  const element = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const getElement = () => {
      if (element.current == null) {
        element.current = document.createElement("div");
        element.current.style.width = "99px";
        element.current.style.height = "99px";
        element.current.style.overflow = "scroll";
        element.current.style.position = "absolute";
        element.current.style.top = "-9999px";
        element.current.setAttribute("aria-hidden", "true");
        element.current.setAttribute("role", "presentation");
      }
      return element.current;
    };

    const updateState = () => {
      const { offsetWidth, clientWidth } = getElement();
      const scrollbarWidth = offsetWidth - clientWidth;

      setDimensions((currentWidth) => {
        return currentWidth !== scrollbarWidth ? scrollbarWidth : currentWidth;
      });
    };

    const handleResize = debounce(updateState, 100);

    window.addEventListener("resize", handleResize);
    document.body.appendChild(getElement());
    updateState();

    const elementToRemove = getElement();

    return () => {
      handleResize.cancel();
      window.removeEventListener("resize", handleResize);
      document.body.removeChild(elementToRemove);
    };
  }, []);

  return dimensions;
};
