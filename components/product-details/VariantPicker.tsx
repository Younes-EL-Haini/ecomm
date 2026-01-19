import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PickerProps {
  label: string;
  options: (string | null)[];
  selected: string | null;
  available: (string | null)[]; // This determines if the button is disabled
  onSelect: (val: string) => void;
  isColor?: boolean;
}

const VariantPicker = ({
  label,
  options,
  selected,
  available,
  onSelect,
  isColor,
}: PickerProps) => (
  <div className="space-y-2">
    <p className="text-sm font-medium">
      {label}: <span className="text-primary font-semibold">{selected}</span>
    </p>
    <div className="flex gap-2 flex-wrap">
      {options.map((option) => {
        if (!option) return null;
        const isSelected = selected === option;
        // Check if this specific option is in the "available" list passed from logic
        const isDisabled = !available.includes(option);

        return (
          <Button
            key={option}
            variant="outline"
            disabled={isDisabled}
            onClick={() => onSelect(option)}
            className={cn(
              "transition-all duration-200 transform",
              // COLOR STYLE: Full width line style
              isColor
                ? "flex-1 h-10 w-16 rounded-full border"
                : "flex-none h-10 w-12 rounded-lg",
              isSelected
                ? "border-primary bg-primary/10 text-primary ring-1 ring-primary scale-105"
                : "border-border hover:border-primary/50",
              isDisabled && "opacity-40 cursor-not-allowed",
            )}
            style={isColor ? { backgroundColor: option.toLowerCase() } : {}}
            title={option}
          >
            {!isColor && option}
          </Button>
        );
      })}
    </div>
  </div>
);

export default VariantPicker;
