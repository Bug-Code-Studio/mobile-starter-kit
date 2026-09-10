import { useTranslation } from "react-i18next";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { AuthStackParamList } from "@/app/navigation/types";
import { AppScreen } from "@/components/app/AppScreen";
import { Button, ButtonText } from "@/components/ui/button";
import { CheckCircleIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { useAuthFlowStore } from "@/stores/authFlowStore";

type Props = NativeStackScreenProps<AuthStackParamList, "AuthResult">;

export function AuthResultScreen({ route, navigation }: Props) {
  const { t } = useTranslation();
  const isEmailVerified = route.params.result === "email-verified";
  const setAuthResultPending = useAuthFlowStore(
    (state) => state.setAuthResultPending,
  );

  const handleContinue = () => {
    setAuthResultPending(false);
  };

  return (
    <AppScreen className="justify-center px-6">
      <Box className="items-center">
        <CheckCircleIcon
          width={80}
          height={80}
          fill="none"
          className="text-success"
        />

        <Text className="mt-6 text-center text-2xl font-semibold text-foreground">
          {t(
            isEmailVerified
              ? "auth.result.emailVerifiedTitle"
              : "auth.result.passwordResetTitle",
          )}
        </Text>

        <Text className="mt-3 text-center text-base text-muted-foreground">
          {t(
            isEmailVerified
              ? "auth.result.emailVerifiedMessage"
              : "auth.result.passwordResetMessage",
          )}
        </Text>

        <Button
          className="mt-8 h-12 w-full rounded-xl"
          onPress={handleContinue}
        >
          <ButtonText>{t("auth.result.signIn")}</ButtonText>
        </Button>
      </Box>
    </AppScreen>
  );
}
