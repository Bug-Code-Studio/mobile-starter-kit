import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import {
  AlertCircleIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
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
  LoginFormValues,
  loginSchema,
} from "@/features/auth/schemas/authSchemas";
import { useLogin } from "@/features/auth/hooks/useLogin";


import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { Pressable } from "@/components/ui/pressable";
import { AppScreen } from "@/components/app/AppScreen";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync: login, isPending } = useLogin();

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
      setError(null);

      await login({
        email: values.email,
        password: values.password,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    }
  };

  return (
    <AppScreen className="justify-center px-6">
      <AuthHeader
        icon={LockIcon}
        title="Welcome back"
        subtitle="Sign in to continue to your account."
      />

      <Box className="mt-10 gap-4">
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormControl isInvalid={!!errors.email}>
              <FormControlLabel>
                <FormControlLabelText className="text-sm">
                  Email
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
                  {errors.email?.message}
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
                  Password
                </FormControlLabelText>
              </FormControlLabel>

              <Input
                className={`h-12 rounded-xl px-3.5 ${
                  errors.password ? "border-destructive" : ""
                }`}
              >
                <InputIcon as={LockIcon} className="text-muted-foreground" />

                <InputField
                  placeholder="Your password"
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
                  {errors.password?.message}
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
            Forgot password?
          </Text>
        </Pressable>
      </Box>

      {error && (
        <Box className="mt-4 rounded-xl bg-destructive/10 px-4 py-3">
          <Text className="text-sm text-destructive">{error}</Text>
        </Box>
      )}

      <Button
        className="mt-6 h-12 w-full rounded-xl"
        onPress={handleSubmit(onSubmit)}
        disabled={isPending}
      >
        {isPending && <ButtonSpinner className="text-primary-foreground" />}

        <ButtonText>{isPending ? "Signing in..." : "Sign In"}</ButtonText>
      </Button>

      <Box className="mt-8 flex-row justify-center">
        <Text className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
        </Text>

        <Pressable onPress={() => navigation.navigate("Register")}>
          <Text className="text-sm font-semibold text-foreground">Sign up</Text>
        </Pressable>
      </Box>
    </AppScreen>
  );
}
