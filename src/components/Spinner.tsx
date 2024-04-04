import React from "react";
import { cn } from "@/lib/utils";

const Spinner = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "animate-spin rounded-full h-8 w-8 border-b-2 border",
        className
      )}
    ></div>
  );
};

export default Spinner;
