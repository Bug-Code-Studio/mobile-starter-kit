import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { AppScreen } from "@/components/app/AppScreen";
import { AppErrorMessage } from "@/components/app/AppErrorMessage";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import {
  AuthAlertIcon,
  AuthEmailIcon,
  AuthEyeIcon,
  AuthEyeOffIcon,
  AuthLockIcon,
  AuthUnlockIcon,
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
  NAME_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  RegisterFormValues,
  registerSchema,
} from "@/features/auth/schemas/authSchemas";
import { useRegister } from "@/features/auth/hooks/useRegister";
import { Box } from "@/components/ui/box";
import { Pressable } from "@/components/ui/pressable";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView } from "react-native/Libraries/Components/Keyboard/KeyboardAvoidingView";
import { Platform } from "react-native";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

export function RegisterScreen({ navigation }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { t } = useTranslation();

  const { mutateAsync: register, isPending, error } = useRegister();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      const { session } = await register({
        name: values.name,
        surname: values.surname,
        email: values.email,
        password: values.password,
      });

      console.log("Registration successful:", session);

      if (!session) {
        navigation.navigate("OtpScreen", {
          email: values.email,
          purpose: "email",
        });
      }
    } catch {
      return;
    }
  };

  return (
    <AppScreen className="px-6">
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
            icon={AuthUnlockIcon}
            title={t("auth.register.title")}
            subtitle={t("auth.register.subtitle")}
          />

      <Box className="mt-8 gap-4">
        <Box className="flex-row gap-3">
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl className="flex-1" isInvalid={!!errors.name}>
                <FormControlLabel>
                  <FormControlLabelText className="text-sm">
                    {t("auth.common.name")}
                  </FormControlLabelText>
                </FormControlLabel>

                <Input
                  className={`h-12 rounded-xl px-3.5 ${
                    errors.name ? "border-destructive" : ""
                  }`}
                >
                  <InputField
                    placeholder={t("John")}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                </Input>

                <FormControlError>
                  <FormControlErrorIcon as={AuthAlertIcon} />
                  <FormControlErrorText>
                    {t(`auth.common.error.${errors.name?.message ?? ""}`, {
                      min: NAME_MIN_LENGTH,
                    })}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="surname"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl className="flex-1" isInvalid={!!errors.surname}>
                <FormControlLabel>
                  <FormControlLabelText className="text-sm">
                    {t("auth.common.surname")}
                  </FormControlLabelText>
                </FormControlLabel>

                <Input
                  className={`h-12 rounded-xl px-3.5 ${
                    errors.surname ? "border-destructive" : ""
                  }`}
                >
                  <InputField
                    placeholder={t("Doe")}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                </Input>

                <FormControlError>
                  <FormControlErrorIcon as={AuthAlertIcon} />
                  <FormControlErrorText>
                    {t(`auth.common.error.${errors.surname?.message ?? ""}`, {
                      min: NAME_MIN_LENGTH,
                    })}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            )}
          />
        </Box>

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
                <InputIcon as={AuthEmailIcon} className="text-muted-foreground" />

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
                <InputIcon as={AuthLockIcon} className="text-muted-foreground" />

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
                    {t(`auth.common.error.${errors.password?.message ?? ""}`, {
                      min: PASSWORD_MIN_LENGTH,
                      max: PASSWORD_MAX_LENGTH,
                    })}
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
                <InputIcon as={AuthLockIcon} className="text-muted-foreground" />

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
        className="mt-6 h-12 w-full rounded-xl"
        onPress={handleSubmit(onSubmit)}
        disabled={isPending}
      >
        {isPending && <ButtonSpinner className="text-primary-foreground" />}

        <ButtonText>
          {isPending
            ? t("auth.register.creating")
            : t("auth.register.createAccount")}
        </ButtonText>
      </Button>

      <AppErrorMessage className="mt-4" error={error} />

          <Box className="mt-8 flex-row justify-center gap-2">
            <Text className="text-sm text-muted-foreground">
              {t("auth.register.alreadyHaveAccount")}
            </Text>

            <Pressable
              onPress={() => navigation.goBack()}
              accessibilityRole="button"
              accessibilityLabel={t("auth.register.signIn")}
              hitSlop={8}
            >
              <Text className="text-sm font-semibold text-foreground">
                {t("auth.register.signIn")}
              </Text>
            </Pressable>
          </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppScreen>
  );
}
