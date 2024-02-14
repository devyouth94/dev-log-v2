import { UseInViewOptions, useInView } from "framer-motion";
import { useRef } from "react";

const useMotionInView = <T extends HTMLElement>(options?: UseInViewOptions) => {
  const ref = useRef<T>(null!);
  const isInView = useInView(ref, { amount: 0.1, once: true, ...options });

  return [ref, isInView] as const;
};

export default useMotionInView;
