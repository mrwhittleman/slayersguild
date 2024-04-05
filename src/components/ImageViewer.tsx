import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ImageViewer = ({
  children,
  imageUrl,
  altName,
}: {
  children: React.ReactNode;
  imageUrl: string;
  altName: string;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex p-0 w-full min-w-fit">
        <img className="rounded-lg" src={imageUrl} alt={altName} width={1024} />
      </DialogContent>
    </Dialog>
  );
};

export default ImageViewer;
