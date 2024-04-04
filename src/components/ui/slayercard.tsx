import * as React from "react";
import { cn } from "@/lib/utils";

const SlayerCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "overflow-hidden rounded-lg border bg-slayercard text-card-foreground shadow",
      className
    )}
    {...props}
  />
));
SlayerCard.displayName = "SlayerCard";

const SlayerCardImage = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(className)} {...props} />
));
SlayerCardImage.displayName = "SlayerCardImage";

const SlayerCardHud = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-2", className)} {...props} />
));
SlayerCardHud.displayName = "SlayerCardHud";

const SlayerCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-2", className)} {...props} />
));
SlayerCardContent.displayName = "SlayerCardContent";

export { SlayerCard, SlayerCardImage, SlayerCardHud, SlayerCardContent };
