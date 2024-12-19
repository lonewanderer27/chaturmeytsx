import { ThemedScrollView } from "@/lib/components/ThemedScrollView"
import useStudent from "@/lib/hooks/student/useStudent"
import useStudentFollowing from "@/lib/hooks/student/useStudentFollowing"
import useStudentGroups from "@/lib/hooks/student/useStudentGroups"
import useStudentHobbies from "@/lib/hooks/student/useStudentHobbies"
import useStudentSubjects from "@/lib/hooks/student/useStudentSubjects"
import { Avatar, Card, Divider, Text } from "@ui-kitten/components"
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
    <ThemedScrollView style={{ padding: 20 }}>
      <Stack.Screen
        options={{
          title: "",
          headerShadowVisible: false
        }}
      />
      <View style={{ marginBottom: -70, zIndex: 1 }}>
        <Avatar
          source={{ uri: data?.avatar_url ?? "https://i.pravatar.cc/300" }}
          style={{
            height: 120, width: 120, borderRadius: 100,
            alignSelf: "center", marginTop: 20,
            shadowColor: "black", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84,
          }}
        />
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
                Following
              </Text>
            </>
          </TouchableOpacity>
          <Divider />
          <TouchableOpacity onPress={handleGroups}>
            <Text category="h6" style={{ textAlign: 'center', fontWeight: "bold" }}>
              {groups?.length ?? 0}
            </Text>
            <Text style={{ textAlign: 'center' }} appearance="hint">
              Groups
            </Text>
          </TouchableOpacity>
        </View>
      </Card>
      {data?.description && <Card style={styles.card}>
        <View>
          <Text category="p1" style={{ fontWeight: "bold" }}>
            Bio
          </Text>
          <Text appearance="hint">
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
              <MaterialChip key={subject!.id} text={string(subject!.title.toLowerCase()).titleCase().s} />
            ))}
          </View>
        </View>
      </Card>}
      {hobbies && hobbies.length > 0 && <Card style={styles.card}>
        <View>
          <Text category="p1" style={{ fontWeight: "bold" }}>
            HOBBIES
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10, marginLeft: -4 }}>
            {hobbies.filter(h => h !== null).map(hobby => (
              <MaterialChip key={hobby!.id} text={hobby!.title} />
            ))}
          </View>
        </View>
      </Card>}
    </ThemedScrollView>
  )
}

export default index