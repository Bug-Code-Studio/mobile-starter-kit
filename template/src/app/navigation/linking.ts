import { RootStackParamList } from "@/app/navigation/types";
import { LinkingOptions } from "@react-navigation/native";

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ["template://"],
  config: {
    screens: {
      Onboarding: "onboarding",
      Auth: {
        screens: {
          Login: "login",
          Register: "register",
          ForgotPassword: "forgot-password",
          ResetPassword: "reset-password",
          AccountVerify: "account-verify",
        },
      },
      Main: {
        screens: {
          Home: "home",
        },
      },
    },
  },
};
