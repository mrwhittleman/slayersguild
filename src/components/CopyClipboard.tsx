import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useToast } from "@/components/ui/use-toast";

const CopyClipboard = ({ copyData }: { copyData: string }) => {
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyData);
      toast({
        title: "Copied to clipboard.",
        className: "bg-tertiary-foreground border",
      });
    } catch (err) {
      toast({
        title: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };
  return (
    <button onClick={handleCopy} aria-label="Copy to clipboard">
      <FontAwesomeIcon icon={faCopy} />
    </button>
  );
};

export default CopyClipboard;
