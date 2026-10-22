import { useCallback, useEffect, useRef, useState } from "react";

export function usePopover(spaceNeeded = 260) {
  const [open, setOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const ref = useRef(null);
  const toggle = useCallback(() => {
    setOpen((wasOpen) => {
      if (!wasOpen && ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setDropUp(window.innerHeight - rect.bottom < spaceNeeded && rect.top > spaceNeeded);
      }
      return !wasOpen;
    });
  }, [spaceNeeded]);
  useEffect(() => {
    if (!open) {
      return;
    }
    const handlePointerDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [open]);
  return {
    open,
    setOpen,
    toggle,
    dropUp,
    ref,
  };
}
