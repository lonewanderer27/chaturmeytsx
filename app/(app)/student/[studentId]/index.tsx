import AvatarLarge from "@/lib/components/AvatarLarge"
import Chip from "@/lib/components/Chip"
import { ThemedScrollView } from "@/lib/components/ThemedScrollView"
import { ThemedView } from "@/lib/components/ThemedView"
import useStudent from "@/lib/hooks/student/useStudent"
import useStudentFollowing from "@/lib/hooks/student/useStudentFollowing"
import useStudentGroups from "@/lib/hooks/student/useStudentGroups"
import useStudentHobbies from "@/lib/hooks/student/useStudentHobbies"
import useStudentSubjects from "@/lib/hooks/student/useStudentSubjects"
import { Avatar, Card, Divider, Icon, Text } from "@ui-kitten/components"
import { router, Stack, useLocalSearchParams } from "expo-router"
import React from "react"
import { useEffect } from "react"
import { TouchableOpacity, View, StyleSheet } from "react-native"
import MaterialChip from "react-native-material-chip"
import string from "string"

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

const index = () => {
  const { studentId } = useLocalSearchParams();
  const { data, isLoading } = useStudent(studentId + "");
  const { data: followings } = useStudentFollowing(studentId + "");
  const { data: groups } = useStudentGroups(studentId + "");
  const { data: hobbies } = useStudentHobbies(studentId + "");
  const { data: subjects } = useStudentSubjects(studentId + "");

  useEffect(() => {
    if (!isLoading && data !== undefined) {
      console.log("Student:\n", data)
    }
  }, [data, isLoading])

  const handleFollowings = () => {
    console.log("button followings pressed")
    router.push(`/(app)/student/${studentId}/following`);
  }

  const handleGroups = () => {
    console.log("button groups pressed")
    router.push(`/(app)/student/${studentId}/groups`);
  }


  return (
    <ThemedScrollView style={{ padding: 10 }}>
      <Stack.Screen
        options={{
          title: "Student Profile",
          headerShadowVisible: false
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
              <Chip key={subject?.id}>
                {string(subject?.title.toLowerCase()).titleCase().s}
              </Chip>
            ))}
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
              {hobbies.filter(h => h !== null).map(hobby => (
                <Chip key={hobby.id}>
                  {string(hobby.title.toLowerCase()).titleCase().s}
                </Chip>
              ))}
            </View>
          </View>
        </Card>}
    </ThemedScrollView>
  )
}

export default index