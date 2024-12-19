import { ThemedScrollView } from '@/lib/components/ThemedScrollView'
import useSelfStudent from '@/lib/hooks/me/useSelfStudent';
import { Button, Card, Icon, Input } from '@ui-kitten/components';
import { router, Stack } from 'expo-router'
import { useFormik } from 'formik';
import React, { useState } from 'react'
import { KeyboardAvoidingView, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AvatarLarge from '@/lib/components/AvatarLarge';
import * as Yup from 'yup';
import client from '@/lib/client';
import useSession from '@/lib/hooks/auth/useSession';
import { decode } from 'base64-arraybuffer'
import { Flow } from 'react-native-animated-spinkit';

const index = () => {
  const { session } = useSession();
  const { data: student, refetch } = useSelfStudent();

  // if it's set to undefined then it means the user hasn't picked an image
  // if it's set to null then it means the user has cleared the image
  const [pickedImage, setPickedImage] = useState<ImagePicker.ImagePickerAsset | undefined | null>();
  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    isSubmitting,
    setSubmitting
  } = useFormik({
    initialValues: {
      description: student?.description ?? "",
      full_name: student?.full_name ?? "",
    },
    validationSchema: Yup.object().shape({
      description: Yup
        .string()
        .optional()
        .min(10, "Bio must be at least 10 characters"),
      full_name: Yup
        .string()
        .required("Full name is required")
        .min(2, "Full name must be at least 3 characters")
    }),
    validateOnChange: true,
    onSubmit: async (data) => {
      setSubmitting(true);
      console.log("Updating profile:\n", data, pickedImage?.uri)


      try {
        // If pickedImage is not undefined, upload the image to the server
        // then update the user profile with the new avatar_url
        let avatarPublicUrl = null;
        if (pickedImage) {
          const fileName = `${session?.user.id}.png`
          console.log("Updating image:\n", fileName)

          const res = await client
            .storage
            .from("avatars")
            .upload(
              `users/${session?.user.id}/${fileName}`,
              decode(pickedImage?.base64!),
              { contentType: "image/png", upsert: true }
            )

          if (res.error) {
            console.error("Error uploading image:\n", res.error)
            setSubmitting(false);
            return;
          }

          console.log("Image uploaded:\n", res.data)
          const { data } = await client
            .storage
            .from("avatars")
            .getPublicUrl(res.data.path)
          avatarPublicUrl = data.publicUrl;
        }

        let final_avatar_url = undefined;
        if (pickedImage === null) {
          // If the user has cleared the image, set the avatar_url to null
          final_avatar_url = null;
        } else if (pickedImage === undefined) {
          // If the user hasn't picked an image, set the avatar_url to the current avatar_url
          final_avatar_url = student?.avatar_url;
        } else {
          // If the user has picked an image, set the avatar_url to the new avatar_url
          final_avatar_url = avatarPublicUrl;
        }

        // Update the user profile
        const res = await client
          .from("students")
          .update({
            full_name: data.full_name,
            description: data.description,
            avatar_url: final_avatar_url,
            updated_at: new Date().toISOString()
          })
          .eq("id", student?.id!)

        if (res.error) {
          console.error("Error updating profile:\n", res.error)
          setSubmitting(false);
          return;
        }

        console.log("Profile updated:\n", res.data)
        setSubmitting(false);

        refetch();
        if (router.canGoBack()) return router.back();
        router.replace("/(app)/me");

      } catch (error) {
        console.error("Error uploading image:\n", error)
        setSubmitting(false);
        return;
      }
    }
  })

  const handleGallery = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.2,
      base64: true
    })

    if (res.canceled) return;
    setPickedImage(res.assets[0]);
  }

  const handleCam = async () => {
    const res = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      cameraType: ImagePicker.CameraType.front,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.2,
      base64: true,
    })

    if (res.canceled) return;
    setPickedImage(res.assets[0]);
  }

  const handleClearPickedImage = () => {
    setPickedImage(undefined);
  }

  const handleClearExistingImage = () => {
    setPickedImage(null);
  }

  const handleCancel = () => {
    if (router.canGoBack()) return router.back();
    router.replace("/(app)/me");
  }

  return (
    <ThemedScrollView style={{ padding: 10 }}>
      <KeyboardAvoidingView behavior="padding">
        <Stack.Screen
          options={{
            title: "Update Profile",
            headerShadowVisible: false
          }}
        />
        {pickedImage && <View style={{ marginBottom: 20 }}>
          <AvatarLarge avatar_url={pickedImage.uri} />
          <View style={{
            paddingLeft: 100,
            marginTop: -40,
          }}>
            <TouchableOpacity
              onPress={handleClearPickedImage}
              style={{
                marginHorizontal: "auto",
                backgroundColor: "white",
                borderRadius: 100,
                padding: 5,
              }}>
              <Icon
                name="close-outline"
                style={{
                  height: 25,
                  width: 25,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>}
        {!pickedImage && <View style={{ marginBottom: 20 }}>
          <AvatarLarge avatar_url={pickedImage === null ? undefined : student?.avatar_url} />
          <View style={{
            paddingLeft: 100,
            marginTop: -40,
            display: (pickedImage === null || student?.avatar_url) ? "flex" : "none"
          }}>
            <TouchableOpacity
              onPress={handleClearExistingImage}
              style={{
                marginHorizontal: "auto",
                backgroundColor: "white",
                borderRadius: 100,
                padding: 5,

              }}>
              <Icon
                name="close-outline"
                style={{
                  height: 25,
                  width: 25,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Button
            onPress={handleCam}
            accessoryLeft={(props) => <Icon {...props} name="camera-outline" />}
            appearance='ghost'
            status="basic"
            disabled={isSubmitting}
            style={{ flex: 1, marginRight: 4, borderRadius: 50 }}>
            Camera
          </Button>
          <Button
            onPress={handleGallery}
            accessoryLeft={(props) => <Icon {...props} name="image-outline" />}
            appearance='ghost'
            status="basic"
            disabled={isSubmitting}
            style={{ flex: 1, marginLeft: 4, borderRadius: 50 }}>
            Gallery
          </Button>
        </View>
        <Card style={{ marginTop: 10, borderRadius: 15 }}>
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={values.full_name}
            onChangeText={handleChange("full_name")}
            onBlur={handleBlur("full_name")}
            style={{ marginTop: 10 }}
            caption={errors.full_name}
            status={errors.full_name ? "danger" : "basic"}
            disabled={isSubmitting}
          />
          <Input
            multiline
            label="Bio"
            placeholder="Introduce yourself to klasmeyts"
            value={values.description}
            onChangeText={handleChange("description")}
            onBlur={handleBlur("description")}
            style={{ marginTop: 10, minHeight: 64 }}
            caption={errors.description}
            status={errors.description ? "danger" : "basic"}
            disabled={isSubmitting}
          />
        </Card>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
          <Button
            appearance="ghost"
            status="basic"
            onPress={handleCancel}
            disabled={isSubmitting}
            style={{ flex: 1, marginRight: 4, borderRadius: 50 }}>
            Cancel
          </Button>
          <Button
            appearance="ghost"
            status="primary"
            onPress={() => handleSubmit()}
            disabled={(errors.description || errors.full_name || isSubmitting) ? true : false}
            style={{ flex: 1, marginLeft: 4, borderRadius: 50 }}>
            {isSubmitting ? <Flow size={24} /> : "Save"}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </ThemedScrollView>
  )
}

export default index