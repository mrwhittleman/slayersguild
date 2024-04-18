import * as React from "react";
import { cn } from "@/lib/utils";

const SlayerCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "overflow-hidden rounded-lg border bg-slayercard text-card-foreground shadow w-full max-w-xl",
      className
    )}
    {...props}
  />
));
SlayerCard.displayName = "SlayerCard";

const SlayerCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-2", className)}
    {...props}
  />
));
SlayerCardHeader.displayName = "SlayerCardHeader";

const SlayerCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none", className)}
    {...props}
  />
));
SlayerCardTitle.displayName = "SlayerCardTitle";

const SlayerCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
SlayerCardDescription.displayName = "SlayerCardDescription";

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

const SlayerCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-2", className)} {...props} />
));
SlayerCardFooter.displayName = "SlayerCardFooter";

export {
  SlayerCard,
  SlayerCardHeader,
  SlayerCardTitle,
  SlayerCardDescription,
  SlayerCardImage,
  SlayerCardHud,
  SlayerCardContent,
  SlayerCardFooter,
};
