import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { AuthHeader } from "@/features/auth/components/AuthHeader";
import {
  AuthAlertIcon,
  AuthEmailIcon,
  AuthEyeIcon,
  AuthEyeOffIcon,
  AuthLockIcon,
} from "@/features/auth/components/AuthIcons";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
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
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  LoginFormValues,
  loginSchema,
} from "@/features/auth/schemas/authSchemas";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { useAuthFlowStore } from "@/stores/authFlowStore";

import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { Pressable } from "@/components/ui/pressable";
import { AppScreen } from "@/components/app/AppScreen";
import { AppErrorMessage } from "@/components/app/AppErrorMessage";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView } from "@/components/ui/keyboard-avoiding-view";
import { ScrollView } from "@/components/ui/scroll-view";
import { Platform } from "react-native";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();

  const { mutateAsync: login, isPending, error } = useLogin();

  const setPasswordResetPending = useAuthFlowStore(
    (state) => state.setPasswordResetPending,
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login({
        email: values.email,
        password: values.password,
      });

      // Clear any stale password-reset flag so a fresh login lands on Main.
      setPasswordResetPending(false);
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
            title={t("auth.login.title")}
            subtitle={t("auth.login.subtitle")}
          />

          <Box className="mt-10 gap-4">
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
                      as={AuthEmailIcon}
                      className="text-muted-foreground"
                    />

                    <InputField
                      placeholder="you@example.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  </Input>

                  <FormControlError>
                    <FormControlErrorIcon as={AuthAlertIcon} />
                    <FormControlErrorText>
                      {t(`auth.common.error.${errors.email?.message ?? ""}`)}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <FormControl isInvalid={!!errors.password}>
                  <FormControlLabel>
                    <FormControlLabelText className="text-sm">
                      {t("auth.common.password")}
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

                    <InputSlot onPress={() => setShowPassword((prev) => !prev)}>
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

            <Pressable
              className="self-end"
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text className="text-sm font-medium text-foreground">
                {t("auth.login.forgotPassword")}
              </Text>
            </Pressable>
          </Box>

          <Button
            className="mt-6 h-12 w-full rounded-xl"
            onPress={handleSubmit(onSubmit)}
            disabled={isPending}
          >
            {isPending && <ButtonSpinner className="text-primary-foreground" />}

            <ButtonText>
              {isPending ? t("auth.login.signingIn") : t("auth.login.signIn")}
            </ButtonText>
          </Button>

          <AppErrorMessage className="mt-4" error={error} />

          <Box className="mt-8 flex-row justify-center gap-2">
            <Text className="text-sm text-muted-foreground">
              {t("auth.login.noAccount")}
            </Text>

            <Pressable onPress={() => navigation.navigate("Register")}>
              <Text className="text-sm font-semibold text-foreground">
                {t("auth.login.signUp")}
              </Text>
            </Pressable>
          </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppScreen>
  );
}
