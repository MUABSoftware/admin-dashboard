import { Flag } from "lucide-react";
import { Button } from "@src/components/ui/button";
import { cn } from "@src/lib/utils";

interface PayoutFlagButtonProps {
  isFlagged: boolean;
  onToggle: () => void;
}

export function PayoutFlagButton({ isFlagged, onToggle }: PayoutFlagButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className={cn(
        "hover:bg-transparent",
        isFlagged && "text-destructive"
      )}
    >
      <Flag className={cn("h-4 w-4", isFlagged && "fill-current")} />
    </Button>
  );
}