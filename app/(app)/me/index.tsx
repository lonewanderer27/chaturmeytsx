import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import useSelfStudent from "@/lib/hooks/me/useSelfStudent";
import { useEffect } from "react";
import { router, Stack } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Avatar, Card, Divider, Text, TopNavigationAction, Button, Icon, useTheme } from "@ui-kitten/components";
import React from "react";
import useSelfFollowing from "@/lib/hooks/me/useSelfFollowing";
import useSelfGroups from "@/lib/hooks/me/useSelfGroups";
import useSelfHobbies from "@/lib/hooks/me/useSelfHobbies";
import useSelfSubjects from "@/lib/hooks/me/useSelfSubjects";
import MaterialChip from "react-native-material-chip";
import string from "string";
import { ThemedScrollView } from "@/lib/components/ThemedScrollView";
import { PersonIcon } from "@/lib/icons/ionic/PersonIcon";
import { ThemedView } from "@/lib/components/ThemedView";
import AvatarLarge from "@/lib/components/AvatarLarge";

const styles = StyleSheet.create({
  card: {
    marginTop: 15,
    borderRadius: 20,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 1
  }
})

export default function ScreenMe() {
  const { data, isLoading } = useSelfStudent();
  const { data: groups } = useSelfGroups();
  const { data: followings } = useSelfFollowing();
  const { hobbies, query: hobbiesQuery } = useSelfHobbies();
  const { subjects, query: subjectsQuery } = useSelfSubjects();

  useEffect(() => {
    if (!isLoading && data !== undefined) {
      console.log("Me:\n", data)
    }
  }, [data, isLoading])

  const handleRecommend = () => {
    console.log("button recommend pressed")
    router.push("/(app)/me/recommend");
  }

  const handleUpdateHobbies = () => {
    console.log("button update hobbies pressed")
    router.push("/(app)/me/update/hobbies");
  }

  const handleUpdateSubjects = () => {
    console.log("button update subjects pressed")
    Alert.alert("Update Subjects", "Coming soon!")
  }

  const handleFollowings = () => {
    console.log("button followings pressed")
    router.push("/(app)/me/following");
  }

  const handleGroups = () => {
    console.log("button groups pressed")
    router.push("/(app)/me/groups");
  }

  return (
    <ThemedScrollView style={{ padding: 20 }}>
      <Stack.Screen
        options={{
          title: "Your Profile",
          headerShadowVisible: false,
          headerRight: () => (
            <>
              <TopNavigationAction onPress={handleRecommend} icon={() => <MaterialIcons name="redeem" size={28} />} />
              <TopNavigationAction icon={() => <MaterialIcons name="edit" size={28} />} />
            </>
          )
        }}
      />
      <View style={{ marginBottom: -70, zIndex: 1 }}>
        <AvatarLarge avatar_url={data?.avatar_url} />
      </View>
      <Card style={{ ...styles.card, paddingTop: 50 }}>
        <View>
          <Text category="h6" style={{ textAlign: 'center', fontWeight: "bold" }}>
            {data?.full_name ?? ""}
          </Text>
          <Text style={{ textAlign: 'center' }} appearance="hint">
            {data?.block ?? ""}
          </Text>
        </View>
        <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "space-around" }}>
          <TouchableOpacity onPress={handleFollowings}>
            <>
              <Text category="h6" style={{ textAlign: 'center', fontWeight: "bold" }}>
                {followings?.length ?? 0}
              </Text>
              <Text style={{ textAlign: 'center' }} appearance="hint">
                Following{(followings?.length ?? 0) <= 1 ? "" : "s"}
              </Text>
            </>
          </TouchableOpacity>
          <Divider />
          <TouchableOpacity onPress={handleGroups}>
            <Text category="h6" style={{ textAlign: 'center', fontWeight: "bold" }}>
              {groups?.length ?? 0}
            </Text>
            <Text style={{ textAlign: 'center' }} appearance="hint">
              Group{(groups?.length ?? 0) <= 1 ? "" : "s"}
            </Text>
          </TouchableOpacity>
        </View>
      </Card>
      {data?.description && <Card style={styles.card}>
        <View style={{ padding: 10 }}>
          <Text category="h6" style={{ textAlign: 'center', fontWeight: "bold" }}>
            Bio
          </Text>
          <Text style={{ textAlign: 'center' }} appearance="hint">
            {data?.description ?? ""}
          </Text>
        </View>
      </Card>}
      {subjects && subjects.length > 0 && <Card style={styles.card}>
        <View>
          <Text category="p1" style={{ fontWeight: "bold" }}>
            SUBJECTS
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10, marginLeft: -4 }}>
            {subjects.map(subject => (
              <MaterialChip
                key={subject.id}
                style={{ maxHeight: 500 }}
                text={string(subject.title.toLowerCase()).titleCase().truncate(35).s}
              />
            ))}
            <MaterialChip
              leftIcon={
                <MaterialIcons
                  style={{ margin: 2 }}
                  name="add"
                  size={20}
                />}
              text="Add Subject"
              onPress={handleUpdateSubjects}
            />
          </View>
        </View>
      </Card>}
      {hobbies && hobbies.length > 0 &&
        <Card style={{ ...styles.card, marginBottom: 100 }}>
          <View>
            <Text category="p1" style={{ fontWeight: "bold" }}>
              HOBBIES
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10, marginLeft: -4 }}>
              {hobbies.map(hobby => (
                <MaterialChip
                  key={hobby.id}
                  text={string(hobby!.title.toLowerCase()).titleCase().truncate(35).s}
                  style={{ maxHeight: 500 }}
                />
              ))}
              <MaterialChip
                leftIcon={
                  <MaterialIcons
                    style={{ margin: 2 }}
                    name="add"
                    size={20}
                  />}
                text="Add Hobby"
                onPress={handleUpdateHobbies}
              />
            </View>
          </View>
        </Card>}
    </ThemedScrollView>
  )
}

