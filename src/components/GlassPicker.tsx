import { Host, Picker } from "@expo/ui/swift-ui";
import {
  background,
  backgroundOverlay,
  cornerRadius,
  frame,
  glassEffect,
  padding,
} from "@expo/ui/swift-ui/modifiers";
import { theme } from "../theme";
interface GlassPickerProps {
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  options: string[];
}

export function GlassPicker({
  selectedIndex,
  setSelectedIndex,
  options,
}: GlassPickerProps) {
  return (
    <Host matchContents>
      <Picker
        options={options}
        selectedIndex={selectedIndex}
        onOptionSelected={({ nativeEvent: { index } }) => {
          setSelectedIndex(index);
        }}
        variant="segmented"
        modifiers={[
          backgroundOverlay({ color: theme.colors.surface }),
          frame({ width: 320 }),
          cornerRadius(99),

          glassEffect({ glass: { variant: "regular" } }),
        ]}
      />
    </Host>
  );
}

export default GlassPicker;
