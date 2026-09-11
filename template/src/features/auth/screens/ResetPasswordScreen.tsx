import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "@/app/navigation/types";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AppScreen } from "@/components/app/AppScreen";
import { AppErrorMessage } from "@/components/app/AppErrorMessage";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import {
  AuthAlertIcon,
  AuthEyeIcon,
  AuthEyeOffIcon,
  AuthLockIcon,
} from "@/features/auth/components/AuthIcons";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  ResetPasswordFormValues,
  resetPasswordSchema,
} from "@/features/auth/schemas/authSchemas";
import { useResetPassword } from "@/features/auth/hooks/useResetPassword";
import { useSignOut } from "@/features/auth/hooks/useSignOut";
import { useAuthFlowStore } from "@/stores/authFlowStore";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { ScrollView } from "@/components/ui/scroll-view";
import { KeyboardAvoidingView } from "@/components/ui/keyboard-avoiding-view";
import { Platform } from "react-native";

type Props = NativeStackScreenProps<AuthStackParamList, "ResetPassword">;

export function ResetPasswordScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { mutateAsync: resetPassword, isPending, error } = useResetPassword();

  const { mutateAsync: signOut } = useSignOut();

  const setPasswordResetPending = useAuthFlowStore(
    (state) => state.setPasswordResetPending,
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    try {
      await resetPassword(values.password);

      // End the recovery session so the user re-authenticates with the new password.
      await signOut();

      setPasswordResetPending(false);

      navigation.navigate("AuthResult", { result: "password-reset" });
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
            icon={AuthLockIcon}
            title={t("auth.resetPassword.title")}
            subtitle={t("auth.resetPassword.subtitle")}
          />

          <Box className="mt-10 gap-4">
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <FormControl isInvalid={!!errors.password}>
                  <FormControlLabel>
                    <FormControlLabelText className="text-sm">
                      {t("auth.common.newPassword")}
                    </FormControlLabelText>
                  </FormControlLabel>

                  <Input
                    className={`h-12 rounded-xl px-3.5 ${
                      errors.password ? "border-destructive" : ""
                    }`}
                  >
                    <InputIcon
                      as={AuthLockIcon}
                      className="text-muted-foreground"
                    />

                    <InputField
                      placeholder="••••••••"
                      secureTextEntry={!showPassword}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />

                    <InputSlot
                      onPress={() => setShowPassword((prev) => !prev)}
                      accessibilityRole="button"
                      accessibilityLabel={t(
                        showPassword
                          ? "auth.common.hidePassword"
                          : "auth.common.showPassword",
                      )}
                      accessibilityState={{ selected: showPassword }}
                    >
                      <InputIcon
                        as={showPassword ? AuthEyeOffIcon : AuthEyeIcon}
                        className="text-muted-foreground"
                      />
                    </InputSlot>
                  </Input>

                  <FormControlError>
                    <FormControlErrorIcon as={AuthAlertIcon} />
                    <FormControlErrorText>
                      {t(
                        `auth.common.error.${errors.password?.message ?? ""}`,
                        {
                          min: PASSWORD_MIN_LENGTH,
                          max: PASSWORD_MAX_LENGTH,
                        },
                      )}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <FormControl isInvalid={!!errors.confirmPassword}>
                  <FormControlLabel>
                    <FormControlLabelText className="text-sm">
                      {t("auth.common.confirmPassword")}
                    </FormControlLabelText>
                  </FormControlLabel>

                  <Input
                    className={`h-12 rounded-xl px-3.5 ${
                      errors.confirmPassword ? "border-destructive" : ""
                    }`}
                  >
                    <InputIcon
                      as={AuthLockIcon}
                      className="text-muted-foreground"
                    />

                    <InputField
                      placeholder="••••••••"
                      secureTextEntry={!showConfirm}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />

                    <InputSlot
                      onPress={() => setShowConfirm((prev) => !prev)}
                      accessibilityRole="button"
                      accessibilityLabel={t(
                        showConfirm
                          ? "auth.common.hidePassword"
                          : "auth.common.showPassword",
                      )}
                      accessibilityState={{ selected: showConfirm }}
                    >
                      <InputIcon
                        as={showConfirm ? AuthEyeOffIcon : AuthEyeIcon}
                        className="text-muted-foreground"
                      />
                    </InputSlot>
                  </Input>

                  <FormControlError>
                    <FormControlErrorIcon as={AuthAlertIcon} />
                    <FormControlErrorText>
                      {t(
                        `auth.common.error.${errors.confirmPassword?.message ?? ""}`,
                        {
                          min: PASSWORD_MIN_LENGTH,
                          max: PASSWORD_MAX_LENGTH,
                        },
                      )}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              )}
            />
          </Box>

          <Button
            className="mt-6 h-12 w-full rounded-xl gap-2"
            onPress={handleSubmit(onSubmit)}
            disabled={isPending}
          >
            {isPending && <ButtonSpinner className="text-primary-foreground" />}

            <ButtonText>
              {isPending
                ? t("auth.resetPassword.updating")
                : t("auth.resetPassword.updatePassword")}
            </ButtonText>
          </Button>

          <AppErrorMessage className="mt-4" error={error} />
        </ScrollView>
      </KeyboardAvoidingView>
    </AppScreen>
  );
}
