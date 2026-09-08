import { ExpoConfig } from "@expo/config";

const config: ExpoConfig = {
  name: "mobilestarterkit",
  slug: "mobilestarterkit",
  version: "1.0.0",
  scheme: "mobilestarterkit",
  orientation: "portrait",
  userInterfaceStyle: "automatic",
  ios: {
    bundleIdentifier: "com.bugcodestudio.mobilestarterkit",
  },
  android: {
    package: "com.bugcodestudio.mobilestarterkit",
  },
};

export default config;
