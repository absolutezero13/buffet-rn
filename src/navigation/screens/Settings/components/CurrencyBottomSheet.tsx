import { createRef, useState } from "react";
import { BottomSheet } from "../../../../components/BottomSheet";
import { currencyOptions } from "../../../constants";
import { Text, TouchableOpacity } from "react-native";
import { styles } from "../styles";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { Button } from "../../../../components";
import useCurrencyStore from "../../../../store/useCurrencyStore";

export const globalCurrencyBottomSheetRef = createRef<TrueSheet>();

const CurrencyBottomSheet = () => {
  const { userCurrency, setUserCurrency } = useCurrencyStore();
  const [selectedCurrency, setSelectedCurrency] = useState(userCurrency?.id);

  return (
    <BottomSheet
      ref={globalCurrencyBottomSheetRef}
      title="Select Default Currency"
    >
      {currencyOptions.map((option) => {
        const isActive = option.id === selectedCurrency;
        return (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.currencyOption,
              isActive && styles.currencyOptionActive,
            ]}
            onPress={() => setSelectedCurrency(option.id)}
          >
            <Text
              style={[
                styles.currencyOptionText,
                isActive && styles.currencyOptionTextActive,
              ]}
            >
              {option.id}
            </Text>
          </TouchableOpacity>
        );
      })}

      <Button
        onPress={async () => {
          const currency = currencyOptions.find(
            (option) => option.id === selectedCurrency,
          );
          if (currency) {
            await setUserCurrency(currency);
          }
          globalCurrencyBottomSheetRef.current?.dismiss();
        }}
        title="Confirm"
      />
    </BottomSheet>
  );
};

export default CurrencyBottomSheet;
