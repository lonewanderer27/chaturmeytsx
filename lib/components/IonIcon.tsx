import React from "react";
import { StyleSheet } from "react-native";
import Icon from "@react-native-vector-icons/ionicons";

export const IonIconsPack = {
  name: "ionicons",
  icons: createIconsMap()
}

function createIconsMap() {
  return new Proxy({}, {
    get(target, name) {
      if (typeof name === 'string') {
        return IconProvider(name);
      }
      return null;
    }
  });
}

const IconProvider = (name: string) => ({
  toReactElement: (props: { name: string; style: any; }) => IonIcon({ ...props, name })
});

function IonIcon({ name, style }: { name: string, style: any }) {
  const { height, tintColor, ...iconStyle } = StyleSheet.flatten(style);
  return (
    <Icon
      // @ts-ignore
      name={name}
      size={height}
      color={tintColor}
      style={iconStyle}
    />
  );
}