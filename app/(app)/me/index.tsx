import { Alert, StyleSheet, TouchableOpacity, useColorScheme, View } from "react-native";
import useSelfStudent from "@/lib/hooks/me/useSelfStudent";
import { useEffect, useState } from "react";
import { router, Stack } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Avatar, Card, Divider, Text, TopNavigationAction, Button, Icon, useTheme, Modal, Input } from "@ui-kitten/components";
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
import { useFormik } from "formik";
import Chip from "@/lib/components/Chip";

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

  const handleEdit = () => {
    console.log("button edit pressed")
    router.push("/(app)/me/update");
  }

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
    <ThemedScrollView style={{ padding: 10 }}>
      <Stack.Screen
        options={{
          title: "Your Profile",
          headerShadowVisible: false
        }}
      />
      <View style={{ marginBottom: -70, zIndex: 1 }}>
        <AvatarLarge key={data?.avatar_url} avatar_url={data?.avatar_url} />
        <View style={{
          paddingLeft: 100,
          marginTop: -40,
        }}>
          <TouchableOpacity
            onPress={handleEdit}
            disabled={isLoading}
            style={{
              marginHorizontal: "auto",
              backgroundColor: "white",
              borderRadius: 100,
              padding: 5,
            }}>
            <Icon
              name="create-outline"
              style={{
                height: 25,
                width: 25,
              }}
            />
          </TouchableOpacity>
        </View>
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
        <TouchableOpacity style={{ padding: 10 }} onPress={handleEdit}>
          <Text category="h6" style={{ textAlign: 'center', fontWeight: "bold" }}>
            Bio
          </Text>
          <Text style={{ textAlign: 'center' }} appearance="hint">
            {data?.description ?? ""}
          </Text>
        </TouchableOpacity>
      </Card>}
      {subjects && subjects.length > 0 && <Card style={styles.card}>
        <View>
          <Text category="p1" style={{ fontWeight: "bold" }}>
            SUBJECTS
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10, marginLeft: -4 }}>
            {subjects.map(subject => (
              <Chip key={subject.id}>
                {string(subject.title.toLowerCase()).titleCase().s}
              </Chip>
            ))}
          </View>
          <Chip
            onPress={handleUpdateSubjects}
            accessoryLeft={(props) => <Icon {...props} name="add" />}
          >
            Add Subject
          </Chip>
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
                <Chip key={hobby.id}>
                  {string(hobby.title.toLowerCase()).titleCase().s}
                </Chip>
              ))}
            </View>
          </View>
          <Chip
            onPress={handleUpdateHobbies}
            accessoryLeft={(props) => <Icon {...props} name="add" />}
          >
            Add Hobby
          </Chip>
        </Card>}
    </ThemedScrollView>
  )
}

