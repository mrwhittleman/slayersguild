import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

interface ImageViewerProps {
  imageUrl: string;
  altName: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ imageUrl, altName }) => {
  return (
    <Dialog>
      <DialogTrigger>
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          size="xl"
          className="absolute bottom-4 right-4 bg-tertiary/45 rounded-lg p-2 hover:bg-tertiary/65 hover:scale-110 transition-all"
        />
      </DialogTrigger>
      <DialogContent className="flex p-0 w-full min-w-fit">
        <img className="rounded-lg" src={imageUrl} alt={altName} width={1024} />
      </DialogContent>
    </Dialog>
  );
};

export default ImageViewer;
