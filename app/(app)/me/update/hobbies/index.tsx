import { router, Stack } from "expo-router";
import { Input, Text } from "@ui-kitten/components";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { HobbyType } from "@/lib/types/client";
import useHobbyCategories from "@/lib/hooks/hobbies/useHobbyCategories";
import useHobbies from "@/lib/hooks/hobbies/useHobbies";
import useSelfHobbies from "@/lib/hooks/me/useSelfHobbies";
import { useFormik } from "formik";
import * as Yup from "yup";
import useSelfStudentLite from "@/lib/hooks/me/useSelfStudentLite";
import { View } from "react-native";
import MaterialChip from "react-native-material-chip";
import React from "react";
import { ThemedScrollView } from "@/lib/components/ThemedScrollView";
import client from "@/lib/client";
import { Flow } from "react-native-animated-spinkit";
import string from "string";
import Chip from "@/lib/components/Chip";

export const hobbiesValidationSchema = Yup.object().shape({
  hobbies: Yup.array().of(Yup.number().required()).required().min(5, "Select at least 5 interests"),
});

export default function ScreenMeHobbiesUpdate() {
  const [uploading, setUploading] = useState(false);
  const { student } = useSelfStudentLite();
  const { hobbies: selfHbbys, query: selfHbbysQry } = useSelfHobbies();
  const hcqR = useHobbyCategories();
  const hqR = useHobbies();

  const [hobsSearch, setHobsSearch] = useState("");
  const [debouncedHobsSearch] = useDebounce(hobsSearch, 300);
  const [filteredHobbies, setFilteredHobbies] = useState<HobbyType[]>(
    hqR.data ?? []
  );
  useEffect(() => {
    if (hqR.data) {
      setFilteredHobbies(
        hqR.data.filter((h) =>
          h.title.toLowerCase().includes(hobsSearch.toLowerCase())
        )
      );
      console.log("filtered hobbies", filteredHobbies);
    }
  }, [debouncedHobsSearch, hqR.data]);

  const [selectedHobbyIds, setSelectedHobbyIds] = useState<number[]>(() => selfHbbys.map(h => h.id));
  const { setValues, handleSubmit } = useFormik({
    initialValues: {
      hobbies: selectedHobbyIds
    },
    onSubmit: async (data) => {
      console.log("selected hobbies", selectedHobbyIds);

      // let's upload the hobbies
      setUploading(() => true);

      // Remove the existing student hobbies
      const { error: deleteError } = await client
        .from("student_hobbies")
        .delete()
        .eq("student_id", student?.id!);

      if (deleteError) {
        console.error("Error deleting student hobbies", deleteError);
        return setUploading(() => false);
      }

      // Create the custom hobbies object that will be uploaded
      const customHbbys = newHobbies.filter(h => h.selected).map(h => ({
        title: h.title,
        created_by_student_id: student?.id,
        is_custom: true
      }));

      // Upload the new custom hobbies
      // And get the new hobbies id
      const { data: nhobbies, error: customError } = await client
        .from("hobbies")
        .insert(customHbbys)
        .select("id");

      if (customError) {
        console.error("Error uploading custom hobbies", customError);
        return setUploading(() => false);
      }

      // Create the hobbies object that will be uploaded
      const hbbys = hqR.data!.filter(h => selectedHobbyIds.includes(h.id)).map(h => ({
        student_id: student?.id!,
        hobby_id: h.id
      }));

      // Create the hobbies object for the new custom hobbies
      hbbys.push(...nhobbies.map((h: { id: number }) => ({
        student_id: student?.id!,
        hobby_id: h.id
      })));

      // Upload the final list of hobbies
      const { error } = await client
        .from("student_hobbies")
        .insert(hbbys);

      if (error) {
        console.error("Error uploading student hobbies", error);
        return setUploading(() => false);
      }

      // Reset the new hobbies
      setNewHobbies(() => []);

      setUploading(() => false);

      // Refresh my hobbies
      selfHbbysQry.refetch();

      // go back to me page
      // lets try to go back to the me page
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/(app)/me");
      }
    },
    validationSchema: hobbiesValidationSchema
  })
  const toggleHobbySelection = (hobbyId: number) => {
    if (uploading) return;
    setSelectedHobbyIds(prevIds => {
      const newIds = prevIds.includes(hobbyId)
        ? prevIds.filter(id => id !== hobbyId)
        : [...prevIds, hobbyId];
      setValues({ hobbies: newIds });

      return newIds;
    });
    console.log(selectedHobbyIds);
  }
  useEffect(() => {
    setSelectedHobbyIds(selfHbbys.map(h => h.id));
  }, [selfHbbysQry.data]);
  const isHobbySelected = (hobbyId: number) => selectedHobbyIds.includes(hobbyId);
  const getInterestMessage = () => {
    const count = selectedHobbyIds.length + newHobbies.filter(h => h.selected).length;
    switch (count) {
      case 0:
        return "Add five hobbies to find even more klasmeyts";
      case 1:
        return "Great start! You can add up to 4 more interests";
      case 2:
      case 3:
        return `Nice choices! You can add up to ${5 - count} more`;
      case 4:
        return "Excellent! You can add one more interest if you'd like";
      default:
        return `Perfect! You've selected ${count} interests. Feel free to add more`;
    }
  }

  const [newHobbies, setNewHobbies] = useState<{
    id: number;
    title: string;
    selected: boolean;
  }[]>([]);
  const handleAddCustomHobby = () => {
    setNewHobbies((prevHobbies) => [...prevHobbies, { id: prevHobbies.length, title: hobsSearch, selected: true }]);
    setHobsSearch("");
  }
  const toggleCustomHobbySelection = (id: number) => {
    if (uploading) return;
    setNewHobbies((prevHobbies) => prevHobbies.map((h) => h.id === id ? { ...h, selected: !h.selected } : h));
  }
  const isCustomHobbySelected = (index: number) => newHobbies[index].selected;

  return (
    <ThemedScrollView style={{ padding: 20 }}>
      <Stack.Screen
        options={{
          title: "",
          headerShadowVisible: false,
          headerRight: () => {
            if (uploading) return <Flow size={24} />
            return <Text
              onPress={() => handleSubmit()}
              disabled={uploading}
            >
              Save
            </Text>
          }
        }}
      />
      <Text category="h4" style={{ textAlign: 'center', marginBottom: 20 }}>
        Update Interests
      </Text>
      <Text category="h6" style={{ textAlign: 'center', }}>
        {getInterestMessage()}
      </Text>
      <View style={{ marginTop: 20 }}>
        <Input
          value={hobsSearch}
          onChangeText={setHobsSearch}
          placeholder="Search for topics"
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === "Enter") handleAddCustomHobby();
          }}
        />
      </View>

      <View style={{ marginTop: 20, flexDirection: "row", flexWrap: "wrap", marginLeft: -5 }}>
        {/* If the search bar is not empty and no hobbies are found,
          the user can add a custom hobby by clicking on this chip */}
        {(filteredHobbies.length === 0 &&
          !hcqR.isLoading &&
          !hqR.isLoading &&
          !selfHbbysQry.isFetching &&
          hobsSearch.length !== 0) && (
            <Chip onPress={handleAddCustomHobby}>
              {hobsSearch}
            </Chip>
          )}

        {/* A custom hobby is a hobby that is not in the list of hobbies. 
            You can add a custom hobby by typing the hobby in the search bar 
            and clicking on the hobby that appears in the search results.   */}
        {(!hcqR.isLoading &&
          !hqR.isLoading &&
          !selfHbbysQry.isFetching &&
          hobsSearch.length == 0) &&
          newHobbies.map((h, i) => (
            <Chip
              key={"userhobby" + i}
              onPress={() => toggleCustomHobbySelection(i)}
              status={isCustomHobbySelected(i) ? "info" : "basic"}
            >
              {h.title}
            </Chip>
          ))}

        {/* Displays the custom hobbies of other users */}
        {(!hcqR.isLoading &&
          !hqR.isLoading &&
          !selfHbbysQry.isFetching) &&
          filteredHobbies
            .filter((h) => h.category_id === null)
            .map((h, i) => (
              <Chip
                key={"customhobby" + h.id}
                onPress={() => toggleHobbySelection(h.id)}
                status={isHobbySelected(h.id) ? "info" : "basic"}
              >
                {h.title}
              </Chip>
            ))}
      </View>

      <View style={{ marginBottom: 100 }}>
        {/* Hobbies from our database */}
        {(!hcqR.isLoading &&
          !hqR.isLoading &&
          !selfHbbysQry.isFetching) && hcqR.data?.map((hc) => {
            const hobbiesInCategory = filteredHobbies.filter((h) => h.category_id === hc.id);
            if (hobbiesInCategory.length === 0) {
              return null; // Skip rendering this category if no hobbies match
            }
            return (
              <View key={hc.id} style={{ marginTop: 20 }}>
                <Text category="h6" style={{ fontWeight: "bold" }}>
                  {hc.title}
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10, marginLeft: -5 }}>
                  {filteredHobbies &&
                    filteredHobbies
                      .filter(h => h.category_id === hc.id)
                      .filter(h => h.title.length > 0)
                      .map((h) => (
                        // <MaterialChip
                        //   key={"hobby" + h.id}
                        //   text={string(h.title).truncate(35).s}
                        //   onPress={() => toggleHobbySelection(h.id)}
                        //   textStyle={{ color: isHobbySelected(h.id) ? "#004acd" : "initial" }}
                        // />
                        <Chip
                          key={"hobby" + h.id}
                          onPress={() => toggleHobbySelection(h.id)}
                          status={isHobbySelected(h.id) ? "info" : "basic"}
                        >
                          {h.title}
                        </Chip>
                      ))}
                </View>
              </View>
            );
          })}
      </View>
    </ThemedScrollView>
  )
}