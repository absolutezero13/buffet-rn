import { Host, Picker } from "@expo/ui/swift-ui";

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
      />
    </Host>
  );
}

export default GlassPicker;
