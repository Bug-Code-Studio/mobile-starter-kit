import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { AppScreen } from "@/components/app/AppScreen";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import {
  AlertCircleIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  UnlockIcon,
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

      if (!session) {
        navigation.navigate("AccountVerify", {
          email: values.email,
          purpose: "signup",
        });
      }
    } catch (err) {
      // Handle error appropriately, e.g., show a toast or set a local error state
      console.error(err);
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
            icon={UnlockIcon}
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
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {t(`auth.common.error.${errors.name?.message ?? ""}`)}
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
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {t(`auth.common.error.${errors.surname?.message ?? ""}`)}
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
                <InputIcon as={MailIcon} className="text-muted-foreground" />

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
                <InputIcon as={LockIcon} className="text-muted-foreground" />

                <InputField
                  placeholder="••••••••"
                  secureTextEntry={!showPassword}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />

                <InputSlot onPress={() => setShowPassword((prev) => !prev)}>
                  <InputIcon
                    as={showPassword ? EyeOffIcon : EyeIcon}
                    className="text-muted-foreground"
                  />
                </InputSlot>
              </Input>

              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                  {t(`auth.common.error.${errors.password?.message ?? ""}`)}
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
                <InputIcon as={LockIcon} className="text-muted-foreground" />

                <InputField
                  placeholder="••••••••"
                  secureTextEntry={!showConfirm}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />

                <InputSlot onPress={() => setShowConfirm((prev) => !prev)}>
                  <InputIcon
                    as={showConfirm ? EyeOffIcon : EyeIcon}
                    className="text-muted-foreground"
                  />
                </InputSlot>
              </Input>

              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                  {t(
                    `auth.common.error.${errors.confirmPassword?.message ?? ""}`,
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

          <Box className="mt-8 flex-row justify-center gap-2">
            <Text className="text-sm text-muted-foreground">
              {t("auth.register.alreadyHaveAccount")}
            </Text>

            <Pressable onPress={() => navigation.goBack()}>
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
