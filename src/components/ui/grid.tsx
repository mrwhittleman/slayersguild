import * as React from "react";

import { cn } from "@/lib/utils";

const Grid = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("w-full grid grid-cols-1", className)}
    {...props}
  />
));
Grid.displayName = "Grid";

const GridContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex w-full justify-center @container ", className)}
    {...props}
  />
));
GridContent.displayName = "GridContent";

const GridGallery = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "grid grid-cols-1 @360:grid-cols-2 @640:grid-cols-3 @768:grid-cols-4 @1024:grid-cols-6 @1920:grid-cols-8 gap-4",
      className
    )}
    {...props}
  />
));
GridGallery.displayName = "GridGallery";

export { Grid, GridContent, GridGallery };
