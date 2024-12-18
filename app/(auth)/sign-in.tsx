import client from "@/lib/client";
import { useRef, useState } from "react";
import { Dimensions, KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native"
import { router } from "expo-router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Image } from "expo-image";
import BottomSheet from '@gorhom/bottom-sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { OtpInput, OtpInputRef } from "react-native-otp-entry";
import useFeatureFlags from "@/lib/hooks/useFeatureFlags";
import { Video, ResizeMode } from "expo-av";
import { Input, Text, Button, Spinner } from "@ui-kitten/components";

const backgroundVideo = require('@/assets/videos/480.mp4')
const { height } = Dimensions.get("window");
const styles = StyleSheet.create({
  video: {
    opacity: 0.8,
    height: height,
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  otpSheetIconContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  otpSheetView: {
    flex: 1,
    padding: 32,
    alignItems: "center",
  },
  otpContainer: {
    marginTop: 20
  },
  otpBtnContainer: {
    marginTop: 20,
    width: "100%",
  },
})


export default function SignIn() {
  const { flags } = useFeatureFlags();
  const allowedTestEmails = flags["allowed_test_emails"]?.value as unknown as string[];
  console.info("Allowed Test Emails", allowedTestEmails);
  const [loading, setLoading] = useState(false);

  const otpSheetRef = useRef<BottomSheet>(null)

  const { handleChange, handleBlur, handleSubmit, values, errors, setFieldError } = useFormik({
    initialValues: {
      email: ""
    },
    onSubmit: async (data) => {
      await handleInputEmail(data.email)
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email()
        .required("Email is a required field")
        .test(
          "is-adamson-or-allowed",
          `${"Email must be an Adamson email"}`,
          (value) => {
            if (!value) return false;
            const domain = value.split("@")[1];
            return domain === "adamson.edu.ph" || allowedTestEmails.includes(value);
          }
        ),
    })
  })

  const handleInputEmail = async (email: string) => {
    setLoading(() => true);
    const { error } = await client.auth.signInWithOtp({
      email: email ?? values.email,
    });

    if (error) {
      setFieldError("email", error.message);
      console.error(error);
      setLoading(() => false);
      return;
    }

    otpSheetRef.current?.expand()
    setLoading(() => false);
  }

  const otpInputRef = useRef<OtpInputRef>(null);
  const [otpCode, setOtpCode] = useState("");
  const handleInputOtp = async (input?: string) => {
    const otp = input ?? otpCode;
    const { data, error } = await client.auth.verifyOtp({
      email: values.email,
      token: otp,
      type: "email",
    });

    // clear the otp code
    setOtpCode("");

    // clear the otp input
    otpInputRef.current?.clear();

    if (error) {
      console.error(error);
      return;
    }

    // redirect user to the root page
    router.replace("/(app)/(tabs)");

    console.log(data);
  }

  return (
    <GestureHandlerRootView>
      <KeyboardAvoidingView
        style={{
          flex: 1,
          gap: 16,
          padding: 32,
          alignItems: undefined,
          justifyContent: 'center',
        }}
      >
        <Video
          source={backgroundVideo}
          style={styles.video}
          isLooping
          shouldPlay
          resizeMode={ResizeMode.COVER}
        />
        <Image
          alt="Logo"
          source={require('@/assets/images/logo_w_name.png')}
          style={{
            height: 150,
            width: 150,
            borderRadius: 16,
            marginBottom: 32,
            marginHorizontal: 'auto',
          }}
        />
        <Text category="h4" style={{ textAlign: 'center', color: "white" }}>
          Welcome!
        </Text>
        <Text style={{ textAlign: 'center', color: "white" }}>
          We're excited to have you back. Please enter your adamson email to continue.
        </Text>
        <Input
          keyboardType="email-address"
          placeholder="Email"
          value={values.email}
          onChangeText={handleChange("email")}
          onBlur={handleBlur("email")}
          status={errors.email ? "danger" : undefined}
          caption={errors.email}
        />
        <Button onPress={() => handleSubmit()}>
          Continue
        </Button>
        <BottomSheet
          ref={otpSheetRef}
          index={-1}
          snapPoints={['55%']}
          enablePanDownToClose
          enableDynamicSizing={false}
        >
          <View style={styles.otpSheetView}>
            <Text category="h5">Verification</Text>
            <Text style={{ textAlign: 'center' }}>
              Your verification code is sent via email to {values.email}
            </Text>
            <OtpInput
              numberOfDigits={6}
              type='numeric'
              focusStickBlinkingDuration={500}
              onTextChange={(text) => setOtpCode(text)}
              onFilled={(text) => setOtpCode(text)}
              textInputProps={{
                accessibilityLabel: "One-Time Password",
              }}
              theme={{
                containerStyle: {
                  marginTop: 20,
                },
              }}
            />
            <View style={styles.otpBtnContainer}>
              <Button
                disabled={loading}
                onPress={() => handleInputOtp()}>
                {loading ? <Spinner size="tiny" /> : "Continue"}
              </Button>
            </View>
          </View>
        </BottomSheet>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  )
}