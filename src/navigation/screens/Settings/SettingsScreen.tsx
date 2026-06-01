import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  Pressable,
  Modal,
  TextInput,
} from "react-native";
import { Button, GlassCard, TabHeader } from "../../../components";
import { styles } from "./styles";
import CurrencyBottomSheet, {
  globalCurrencyBottomSheetRef,
} from "./components/CurrencyBottomSheet";
import WeightUnitBottomSheet, {
  globalWeightUnitBottomSheetRef,
} from "./components/WeightUnitBottomSheet";
import useCurrencyStore from "../../../store/useCurrencyStore";
import useWeightUnitStore from "../../../store/useWeightUnitStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../../constants";
import useUserAssets from "../../../store/useUserAssets";
import useSubscriptionStore from "../../../store/useSubscriptionStore";
import useRecurringSubscriptionsStore from "../../../store/useRecurringSubscriptionsStore";
import { revenueCatService } from "../../../services/revenueCatService";
import { theme } from "../../../theme";

export function Settings() {
  const { userCurrency } = useCurrencyStore();
  const { weightUnit } = useWeightUnitStore();
  const { isSubscribed } = useSubscriptionStore();
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const closeDeleteModal = () => {
    setDeleteModalVisible(false);
    setDeleteConfirmation("");
  };

  const deleteLocalData = async () => {
    if (deleteConfirmation !== "delete") {
      return;
    }

    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ASSETS,
      STORAGE_KEYS.SUBSCRIPTIONS,
    ]);
    useUserAssets.setState({ userAssets: [] });
    useRecurringSubscriptionsStore.setState({ subscriptions: [] });
    closeDeleteModal();
    Alert.alert("Data Deleted", "Your portfolio and subscriptions were deleted.");
  };

  const handleRestorePurchases = async () => {
    try {
      await revenueCatService.restorePurchases();
      Alert.alert("Success", "Purchases restored successfully.");
    } catch (error) {
      Alert.alert("Error", "Could not restore purchases. Please try again.");
    }
  };

  return (
    <>
      <TabHeader title="Settings" />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          <Pressable
            onPress={() => globalCurrencyBottomSheetRef.current?.present()}
          >
            <GlassCard
              interactive
              effect="clear"
              style={{
                ...styles.card,
                ...{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                },
              }}
            >
              <Text style={styles.sectionTitle}>Default currency</Text>
              <Text style={styles.currency}>{userCurrency?.id}</Text>
            </GlassCard>
          </Pressable>

          <Pressable
            onPress={() => globalWeightUnitBottomSheetRef.current?.present()}
          >
            <GlassCard
              interactive
              effect="clear"
              style={{
                ...styles.card,
                ...{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                },
              }}
            >
              <Text style={styles.sectionTitle}>Commodity weight unit</Text>
              <Text style={styles.currency}>{weightUnit?.fullName}</Text>
            </GlassCard>
          </Pressable>

          <GlassCard effect="clear" style={styles.card}>
            <Text style={styles.sectionTitle}>Subscription</Text>
            <Text style={styles.sectionDescription}>
              {isSubscribed
                ? "You have an active Pro subscription."
                : "Subscribe to unlock AI Chat and historical charts."}
            </Text>
            <Button
              title="Restore Purchases"
              onPress={handleRestorePurchases}
              fullWidth
            />
          </GlassCard>

          <GlassCard effect="clear" style={styles.card}>
            <Text style={styles.sectionTitle}>Delete Data</Text>
            <Text style={styles.sectionDescription}>
              Delete saved portfolio assets and tracked subscriptions from this
              device.
            </Text>
            <Text
              onPress={() => setDeleteModalVisible(true)}
              style={styles.deleteDataAction}
            >
              Delete data
            </Text>
          </GlassCard>
        </ScrollView>
      </View>

      <Modal
        visible={isDeleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeDeleteModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Delete Data</Text>
            <Text style={styles.modalText}>
              Type delete to permanently remove portfolio assets and
              subscriptions from this device.
            </Text>
            <TextInput
              value={deleteConfirmation}
              onChangeText={setDeleteConfirmation}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="delete"
              placeholderTextColor={theme.colors.textMuted}
              style={styles.modalInput}
            />
            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                variant="ghost"
                onPress={closeDeleteModal}
                style={styles.modalButton}
              />
              <Button
                title="Delete"
                variant="danger"
                disabled={deleteConfirmation !== "delete"}
                onPress={deleteLocalData}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      <CurrencyBottomSheet />
      <WeightUnitBottomSheet />
    </>
  );
}
