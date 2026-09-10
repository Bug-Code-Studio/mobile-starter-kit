import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { AppScreen } from "@/components/app/AppScreen";
import { AppErrorMessage } from "@/components/app/AppErrorMessage";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { Input, InputField, InputIcon } from "@/components/ui/input";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import {
  AlertCircleIcon,
  HelpCircleIcon,
  MailIcon,
} from "@/components/ui/icon";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";

import type { AuthStackParamList } from "@/app/navigation/types";
import {
  ForgotPasswordFormValues,
  forgotPasswordSchema,
} from "@/features/auth/schemas/authSchemas";
import { useForgotPassword } from "@/features/auth/hooks/useForgotPassword";
import { Box } from "@/components/ui/box";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { KeyboardAvoidingView } from "@/components/ui/keyboard-avoiding-view";
import { ScrollView } from "@/components/ui/scroll-view";
import { Platform } from "react-native";

type Props = NativeStackScreenProps<AuthStackParamList, "ForgotPassword">;

export function ForgotPasswordScreen({ navigation }: Props) {
  const { t } = useTranslation();

  const { mutateAsync: sendResetOtp, isPending, error } = useForgotPassword();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      await sendResetOtp(values.email);

      navigation.navigate("OtpScreen", {
        email: values.email,
        purpose: "password-reset",
      });
    } catch {
      return;
    }
  };

  return (
    <AppScreen className="justify-center px-6">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingVertical: 24,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AuthHeader
            icon={HelpCircleIcon}
            title={t("auth.forgotPassword.title")}
            subtitle={t("auth.forgotPassword.subtitle")}
          />

          <Box className="mt-10">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <FormControl isInvalid={!!errors.email}>
                  <FormControlLabel>
                    <FormControlLabelText className="text-sm">
                      {t("auth.common.email")}
                    </FormControlLabelText>
                  </FormControlLabel>

                  <Input
                    className={`h-12 rounded-xl px-3.5 ${
                      errors.email ? "border-destructive" : ""
                    }`}
                  >
                    <InputIcon
                      as={MailIcon}
                      className="text-muted-foreground"
                    />

                    <InputField
                      placeholder="you@example.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  </Input>

                  <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} />
                    <FormControlErrorText>
                      {t(`auth.common.error.${errors.email?.message ?? ""}`)}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              )}
            />
          </Box>

          <Button
            className="mt-6 h-12 w-full rounded-xl"
            onPress={handleSubmit(onSubmit)}
            disabled={isPending}
          >
            {isPending && <ButtonSpinner className="text-primary-foreground" />}

            <ButtonText>
              {isPending
                ? t("auth.forgotPassword.sending")
                : t("auth.forgotPassword.sendResetOtp")}
            </ButtonText>
          </Button>

          <AppErrorMessage className="mt-4" error={error} />

          <Box className="mt-8 flex-row justify-center gap-2">
            <Text className="text-sm text-muted-foreground">
              {t("auth.forgotPassword.rememberPassword")}
            </Text>

            <Pressable onPress={() => navigation.goBack()}>
              <Text className="text-sm font-semibold text-foreground">
                {t("auth.forgotPassword.signIn")}
              </Text>
            </Pressable>
          </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppScreen>
  );
}
