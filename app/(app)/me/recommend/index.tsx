import { StyleSheet, View } from "react-native";
import { useState } from "react";
import { router, Stack } from "expo-router";
import { Button, Text, TopNavigationAction } from "@ui-kitten/components";
import useRecommendGroups from "@/lib/hooks/recommend/groups";
import { MaterialIcons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import React from "react";
import { ThemedScrollView } from "@/lib/components/ThemedScrollView";

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});

enum SortingOptions {
  HIGH_TO_LOW = "high_to_low",
  LOW_TO_HIGH = "low_to_high",
}

enum ShowModes {
  LIST = "list",
  GRID = "grid",
}

export default function ScreenMeRecommend() {
  const [topK, setTopK] = useState({
    value: 10,
  });
  const [finalTopK, setFinalTopK] = useState(() => topK.value);
  const [showMode, setShowMode] = useState(() => ShowModes.LIST);
  const { data, isLoading } = useRecommendGroups(finalTopK);
  const [sortingOption, setSortingOption] = useState(SortingOptions.HIGH_TO_LOW);
  const [isSorting, setIsSorting] = useState(false);

  const handleRecommend = () => {
    router.push("/");
  }

  console.log("Recommend Groups:\n", data)

  return (
    <ThemedScrollView style={{ padding: 20 }}>
      <Stack.Screen
        options={{
          title: "",
          headerShadowVisible: false
        }}
      />
      <Text category="h4" style={{ textAlign: 'center' }}>
        Suggested Groups
      </Text>
      <Text style={{ textAlign: 'center', }}>
        Here are our top picks to join!
      </Text>
      <View style={{ marginTop: 20 }}>
        <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
          <Button
            size="giant"
            appearance="ghost"
            style={{ paddingHorizontal: 0 }}>
            <Text>
              {sortingOption === SortingOptions.HIGH_TO_LOW ? "Most Recommended" : "Least Recommended"}
            </Text>
          </Button>
          <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
            <Button size="giant" appearance="ghost" style={{ paddingHorizontal: 0, marginRight: -10 }}>
              <Text>
                Top {finalTopK.toString()}
              </Text>
            </Button>
            <Button
              size="giant"
              appearance="ghost"
              style={{ paddingHorizontal: 0, marginLeft: -10 }}
              accessoryRight={<MaterialIcons size={24} name="filter-alt" />}>
            </Button>
          </View>
        </View>
      </View>
    </ThemedScrollView>
  )
}