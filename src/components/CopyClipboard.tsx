import React from "react";
import { useToast } from "@/components/ui/use-toast";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface CopyClipboardProps {
  copyData: string | undefined;
  children: React.ReactNode;
}

const CopyClipboard: React.FC<CopyClipboardProps> = ({
  copyData,
  children,
}) => {
  const { toast } = useToast();

  if (!copyData) {
    return null;
  }
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyData);
      toast({
        title: "Success",
        description: "Copied to clipboard.",
        variant: "success",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Something went wrong.",
        variant: "destructive",
      });
    }
  };
  return (
    <button
      onClick={handleCopy}
      className="flex w-full gap-8 items-center justify-between"
      aria-label="Copy to clipboard"
    >
      {children}
      <FontAwesomeIcon icon={faCopy} />
    </button>
  );
};

export default CopyClipboard;
