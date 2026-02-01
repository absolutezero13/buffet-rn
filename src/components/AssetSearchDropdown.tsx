import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput as RNTextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { theme } from "../theme";
import { api } from "../services/api";

export interface SearchResult {
  symbol: string;
  name: string;
  id?: string;
}

interface AssetSearchDropdownProps {
  assetType: string;
  onSelect: (result: SearchResult) => void;
  selectedValue?: SearchResult | null;
  placeholder?: string;
}

const GOLD_OPTIONS: SearchResult[] = [
  { symbol: "XAU", name: "Gold (Troy Ounce)" },
  { symbol: "GLD", name: "SPDR Gold Shares ETF" },
  { symbol: "IAU", name: "iShares Gold Trust" },
  { symbol: "GOLD", name: "Barrick Gold Corporation" },
];

export function AssetSearchDropdown({
  assetType,
  onSelect,
  selectedValue,
  placeholder = "Search for an asset...",
}: AssetSearchDropdownProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchAssets = useCallback(
    async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        if (assetType === "crypto") {
          const cryptoResults = await api.searchCrypto(searchQuery);
          console.log("Crypto search results:", cryptoResults);
          setResults(
            cryptoResults.map((c) => ({
              symbol: c.symbol.toUpperCase(),
              name: c.name,
              id: c.id,
            })),
          );
        } else if (assetType === "gold") {
          const filtered = GOLD_OPTIONS.filter(
            (g) =>
              g.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
              g.name.toLowerCase().includes(searchQuery.toLowerCase()),
          );
          setResults(filtered);
        } else {
          const stockResults = await api.searchSymbol(searchQuery);
          setResults(
            stockResults.map((s) => ({
              symbol: s.symbol,
              name: s.description,
            })),
          );
        }
        setShowResults(true);
      } catch (error) {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [assetType],
  );

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query && !selectedValue) {
        searchAssets(query);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, searchAssets, selectedValue]);

  useEffect(() => {
    setQuery("");
    setResults([]);
    setShowResults(false);
  }, [assetType]);

  const handleSelect = (result: SearchResult) => {
    setQuery(`${result.symbol} - ${result.name}`);
    setShowResults(false);
    setResults([]);
    onSelect(result);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    onSelect({ symbol: "", name: "" });
  };

  const handleFocus = () => {
    setShowResults(true);
    if (assetType === "gold" && query.length < 2) {
      setResults(GOLD_OPTIONS);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Asset</Text>
      <View style={styles.inputContainer}>
        <RNTextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textMuted}
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            if (selectedValue) {
              onSelect({ symbol: "", name: "" });
            }
          }}
          onFocus={handleFocus}
          onBlur={() => {
            setTimeout(() => setShowResults(false), 50);
          }}
        />
        {isLoading && (
          <ActivityIndicator
            size="small"
            color={theme.colors.primary}
            style={styles.loader}
          />
        )}
        {query.length > 0 && !isLoading && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {showResults && results.length > 0 && (
        <View style={styles.dropdown}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
            style={styles.list}
          >
            {results.map((item, index) => (
              <TouchableOpacity
                key={`${item.symbol}-${index}`}
                style={styles.resultItem}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.resultSymbol}>{item.symbol}</Text>
                <Text style={styles.resultName} numberOfLines={1}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {showResults &&
        query.length >= 2 &&
        results.length === 0 &&
        !isLoading && (
          <View style={styles.dropdown}>
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>No results found</Text>
            </View>
          </View>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
    zIndex: 1000,
    elevation: 1000,
  },
  label: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    marginBottom: theme.spacing.xs,
    fontWeight: theme.fontWeight.medium,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
  },
  input: {
    flex: 1,
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    padding: theme.spacing.md,
  },
  loader: {
    marginRight: theme.spacing.md,
  },
  clearButton: {
    padding: theme.spacing.md,
  },
  clearText: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.md,
  },
  dropdown: {
    position: "absolute",
    top: 72,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
    maxHeight: 200,
    overflow: "hidden",
    zIndex: 9999,
    elevation: 9999,
  },
  list: {
    maxHeight: 200,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.glassBorder,
  },
  resultSymbol: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    width: 70,
  },
  resultName: {
    flex: 1,
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
  },
  noResults: {
    padding: theme.spacing.lg,
    alignItems: "center",
  },
  noResultsText: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
  },
});
