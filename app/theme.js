import { Platform } from "react-native";

export let font = Platform.OS === "ios" ? "Arial" : "Roboto";
export let titleColor = "#ff0000";

//Nav Shared Styles
export let headerStyle = {
  backgroundColor: "#fff",
  borderBottomWidth: 0,
  shadowColor: "transparent",
};
export let headerTitleStyle = {
  fontWeight: "bold",
  fontSize: 17,
  fontFamily: font,
  color: titleColor,
};

export const imageOptions = { allowsEditing: true, aspect: [4, 3] };
