import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { AppScreen } from "@/components/app/AppScreen";
import { AppErrorMessage } from "@/components/app/AppErrorMessage";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import {
  AuthAlertIcon,
  AuthEmailIcon,
} from "@/features/auth/components/AuthIcons";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from "@/components/ui/form-control";
import type { AuthStackParamList } from "@/app/navigation/types";
import { OtpFormValues, otpSchema } from "@/features/auth/schemas/authSchemas";
import { useVerifyOtp } from "@/features/auth/hooks/useVerifyOtp";
import { useResendSignupOtp } from "@/features/auth/hooks/useResendSignupOtp";
import { useResendPasswordResetOtp } from "@/features/auth/hooks/useResendPasswordResetOtp";
import { useSignOut } from "@/features/auth/hooks/useSignOut";
import { useAuthFlowStore } from "@/stores/authFlowStore";
import { Box } from "@/components/ui/box";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { KeyboardAvoidingView } from "@/components/ui/keyboard-avoiding-view";
import { ScrollView } from "@/components/ui/scroll-view";
import { Platform } from "react-native";

type Props = NativeStackScreenProps<AuthStackParamList, "OtpScreen">;
type FocusableInput = { focus: () => void };

export function OtpScreen({ route, navigation }: Props) {
  const { email, purpose } = route.params;

  const { t } = useTranslation();

  const [resent, setResent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [resendError, setResendError] = useState<unknown>(null);
  const inputRefs = useRef<Array<FocusableInput | null>>([]);

  useEffect(() => {
    if (resendCooldown === 0) {
      return;
    }

    const timer = setInterval(() => {
      setResendCooldown((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  const {
    mutateAsync: verifyOtp,
    isPending,
    error,
    reset: resetVerifyOtpError,
  } = useVerifyOtp();

  const { mutateAsync: resendSignupOtp } = useResendSignupOtp();
  const { mutateAsync: resendPasswordResetOtp } = useResendPasswordResetOtp();
  const { mutateAsync: signOut } = useSignOut();

  const setPasswordResetPending = useAuthFlowStore(
    (state) => state.setPasswordResetPending,
  );
  const setAuthResultPending = useAuthFlowStore(
    (state) => state.setAuthResultPending,
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      token: "",
    },
  });

  const onSubmit = async (values: OtpFormValues) => {
    try {
      if (purpose === "password-reset") {
        setPasswordResetPending(true);
      } else {
        setAuthResultPending(true);
      }

      await verifyOtp({
        email,
        token: values.token,
        purpose,
      });

      if (purpose === "password-reset") {
        navigation.navigate("ResetPassword");
      } else {
        await signOut();
        navigation.navigate("AuthResult", { result: "email-verified" });
      }
    } catch {
      setPasswordResetPending(false);
      setAuthResultPending(false);
    }
  };

  const handleResend = async () => {
    if (isResending || resendCooldown > 0) {
      return;
    }

    try {
      setIsResending(true);
      setResent(false);
      setResendError(null);
      resetVerifyOtpError();

      if (purpose === "email") {
        await resendSignupOtp(email);
      } else {
        await resendPasswordResetOtp(email);
      }

      setResent(true);
      setResendCooldown(60);
    } catch (err) {
      setResendError(err);
    } finally {
      setIsResending(false);
    }
  };

  const handleTokenChange = (
    text: string,
    index: number,
    currentValue: string,
    onChange: (value: string) => void,
  ) => {
    const digits = text.replace(/\D/g, "");
    const nextValue = currentValue.split("");

    if (digits.length > 0) {
      nextValue.splice(index, digits.length, ...digits.split(""));
    } else {
      nextValue[index] = "";
    }
    onChange(nextValue.slice(0, 6).join(""));

    if (digits.length > 0) {
      inputRefs.current[Math.min(index + digits.length, 5)]?.focus();
    }
  };

  const handleTokenKeyPress = (index: number, key: string, value: string) => {
    if (key === "Backspace" && !value && index > 0) {
      inputRefs.current[index - 1]?.focus();
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
            icon={AuthEmailIcon}
            title={
              purpose === "email"
                ? t("auth.verifyAccount.accountVerifyTitle")
                : t("auth.verifyAccount.passwordResetTitle")
            }
            subtitle={
              purpose === "email"
                ? t("auth.verifyAccount.accountVerifySubtitle", { email })
                : t("auth.verifyAccount.passwordResetSubtitle", { email })
            }
          />

          <Box className="mt-8">
            <Controller
              control={control}
              name="token"
              render={({ field: { onChange, onBlur, value } }) => (
                <FormControl isInvalid={!!errors.token}>
                  <Box className="flex-row gap-2">
                    {Array.from({ length: 6 }, (_, index) => (
                      <Input
                        key={index}
                        className={`h-12 flex-1 rounded-xl px-0 ${
                          errors.token ? "border-destructive" : ""
                        }`}
                      >
                        <InputField
                          ref={(input) => {
                            inputRefs.current[index] =
                              input as FocusableInput | null;
                          }}
                          accessibilityLabel={t(
                            "auth.verifyAccount.codeInputLabel",
                            { index: index + 1, total: 6 },
                          )}
                          keyboardType="number-pad"
                          maxLength={6 - index}
                          value={value[index] ?? ""}
                          style={{
                            textAlign: "center",
                            textAlignVertical: "center",
                          }}
                          onChangeText={(text) =>
                            handleTokenChange(text, index, value, onChange)
                          }
                          onKeyPress={({ nativeEvent }) =>
                            handleTokenKeyPress(
                              index,
                              nativeEvent.key,
                              value[index] ?? "",
                            )
                          }
                          onBlur={onBlur}
                        />
                      </Input>
                    ))}
                  </Box>

                  <FormControlError>
                    <FormControlErrorIcon as={AuthAlertIcon} />
                    <FormControlErrorText>
                      {t(`auth.common.error.${errors.token?.message}`)}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              )}
            />
          </Box>

          {resent && (
            <Box
              accessibilityLiveRegion="polite"
              accessibilityRole="alert"
              className="mt-4 flex-row items-center gap-2 rounded-xl bg-muted px-4 py-3"
            >
              <Text className="text-sm text-muted-foreground">
                {t("auth.verifyAccount.newCodeSent")}
              </Text>
            </Box>
          )}

          <Button
            className="mt-6 h-12 w-full rounded-xl"
            onPress={handleSubmit(onSubmit)}
            disabled={isPending}
          >
            {isPending && <ButtonSpinner className="text-primary-foreground" />}

            <ButtonText>
              {isPending
                ? t("auth.verifyAccount.verifying")
                : t("auth.verifyAccount.verify")}
            </ButtonText>
          </Button>

          <AppErrorMessage className="mt-4" error={error ?? resendError} />

          <Box className="mt-8 flex-row justify-center gap-2">
            <Text className="text-sm text-muted-foreground">
              {t("auth.verifyAccount.didNotReceiveCode")}
            </Text>

            <Pressable
              onPress={handleResend}
              disabled={isResending || resendCooldown > 0}
              accessibilityRole="button"
              accessibilityLabel={t("auth.verifyAccount.resend")}
              accessibilityHint={t("auth.verifyAccount.resendHint")}
              accessibilityState={{
                disabled: isResending || resendCooldown > 0,
              }}
              hitSlop={8}
            >
              <Text className="text-sm font-semibold text-foreground">
                {resendCooldown > 0
                  ? `${t("auth.verifyAccount.resend")} (${resendCooldown}s)`
                  : t("auth.verifyAccount.resend")}
              </Text>
            </Pressable>
          </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppScreen>
  );
}
