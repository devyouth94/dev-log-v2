import { MotionProps, motion } from "framer-motion";
import { HTMLAttributes } from "react";

import useMotionInView from "~/hooks/use-motion-in-view";
import { cn } from "~/utils/class-name";
import { fadeParentVariants } from "~/utils/constants";

type IProps = HTMLAttributes<HTMLElement> & MotionProps;

const MotionContainer = ({ className, ...props }: IProps) => {
  const [ref, inView] = useMotionInView<HTMLElement>();

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeParentVariants}
      className={cn("", className)}
      {...props}
    />
  );
};

export default MotionContainer;
