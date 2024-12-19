import { searchAtom } from "@/lib/atoms";
import { ThemedScrollView } from "@/lib/components/ThemedScrollView";
import { ThemedView } from "@/lib/components/ThemedView";
import useSelfSearchHistory from "@/lib/hooks/me/useSelfSearchHistory";
import useSearchGroups from "@/lib/hooks/search/useSearchGroups";
import useSearchStudent from "@/lib/hooks/search/useSearchStudent";
import { GroupType, StudentType } from "@/lib/types/client";
import { Tab, TabView, Input, Text, ListItem, List, Divider } from "@ui-kitten/components";
import { router, Stack } from "expo-router";
import { useAtom } from "jotai";
import React from "react";
import { useState } from "react";
import MaterialChip from "react-native-material-chip";
import { useDebounce } from "use-debounce";

const groupItem = ({ item }: { item: GroupType, index: number }) => (
  <ListItem
    title={`${item?.name ?? ""}`}
    description={`${item?.approx_members_count ?? ""} Members`}
    // accessoryLeft={() => {
    //   if (item?.avatar_url) {
    //     return <Avatar source={{ uri: item.avatar_url }} size="48" />
    //   }
    //   return <Icon name="people-circle-outline" size={48} />
    // }}
  />
)

const studentItem = ({ item }: { item: StudentType, index: number }) => {
  const handlePress = () => {
    // check if it's us
    console.log("student pressed: ", item)
    router.push(`/(app)/student/${item.id}`)
  }

  return (
    <ListItem
      title={`${item?.full_name ?? ""}`}
      description={`${item?.block ?? ""}`}
      onPress={handlePress}
    // accessoryLeft={() => {
    //   if (item?.avatar_url) {
    //     return <Avatar source={{ uri: item.avatar_url }} size="giant" />
    //   }
    //   return <Icon name="person-circle-outline" size={48} />
    // }}
    />
  )
}

export default function SearchScreen() {
  const [search, setSearch] = useAtom(searchAtom);
  const [debouncedSearch] = useDebounce(search, 1000);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const shouldLoadComponent = (index: number): boolean => index === selectedIndex;

  const { data: searchHistory } = useSelfSearchHistory();
  const { data: students } = useSearchStudent(debouncedSearch);
  const { data: groups } = useSearchGroups(debouncedSearch);

  console.log("Students:\n", students)

  return (
    <ThemedView style={{ height: "100%" }}>
      <Stack.Screen
        options={{
          title: "",
          headerShown: true,
          headerShadowVisible: false,
        }}
      />
      <Input
        placeholder="Search for students, groups, or posts"
        value={search}
        onChangeText={setSearch}
        style={{ marginHorizontal: 10 }}
      />
      {debouncedSearch.length === 0 &&
        <ThemedView style={{ marginTop: 10, marginHorizontal: 10 }}>
          <Text category="p1">Recent searches</Text>
          <ThemedView style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10, marginLeft: -5 }}>
            {searchHistory?.map((history, index) => (
              <MaterialChip
                text={history.query}
                key={index}
              />)
            )}
          </ThemedView>
        </ThemedView>}
      <TabView
        style={{ marginTop: 10, display: debouncedSearch.length === 0 ? "none" : "flex", flex: 1 }}
        shouldLoadComponent={shouldLoadComponent}
        selectedIndex={selectedIndex}
        onSelect={index => setSelectedIndex(index)}
      >
        <Tab title="All">
          <ThemedScrollView>
            <Text>Search all</Text>
          </ThemedScrollView>
        </Tab>
        <Tab title="Posts">
          <ThemedScrollView>
            <Text>Search posts</Text>
          </ThemedScrollView>
        </Tab>
        <Tab title="Students">
          <List
            data={students}
            renderItem={studentItem}
            ItemSeparatorComponent={Divider}
          />
        </Tab>
        <Tab title="Groups">
          <List
            // @ts-ignore
            data={groups}
            renderItem={groupItem}
            ItemSeparatorComponent={Divider}
          />
        </Tab>
      </TabView>
    </ThemedView>
  )
}