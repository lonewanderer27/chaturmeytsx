import { Tab, TabView } from "@ui-kitten/components";
import { Tabs } from "expo-router";
import { useState } from "react";
import { TextInput, View, Image, StyleSheet } from "react-native";

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

export default function SearchScreen() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <>
      <Tabs.Screen
        options={{
          headerRight: () => (
            <TextInput />
          )
        }}
      />
      <View>
        <TabView
          selectedIndex={selectedIndex}
          onSelect={index => setSelectedIndex(index)}
        >
          <Tab title="All" />
          <Tab title="Students" />
          <Tab title="Groups" />
        </TabView>
      </View>
    </>
  )
}