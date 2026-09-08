import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { AppScreen } from "@/components/app/AppScreen";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { AlertCircleIcon, MailIcon } from "@/components/ui/icon";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from "@/components/ui/form-control";
import type { AuthStackParamList } from "@/app/navigation/types";
import { OtpFormValues, otpSchema } from "@/features/auth/schemas/authSchemas";
import { useVerifyOtp } from "@/features/auth/hooks/useVerifyOtp";
import {
  resendSignupOtp,
  resendPasswordResetOtp,
} from "@/features/auth/services/authService";
import { useAuthFlowStore } from "@/stores/authFlowStore";
import { Box } from "@/components/ui/box";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";

type Props = NativeStackScreenProps<AuthStackParamList, "AccountVerify">;

export function AccountVerifyScreen({ route, navigation }: Props) {
  const { email, purpose } = route.params;

  const [error, setError] = useState<string | null>(null);
  const [resent, setResent] = useState(false);

  const { mutateAsync: verifyOtp, isPending } = useVerifyOtp();

  const setPasswordResetPending = useAuthFlowStore(
    (state) => state.setPasswordResetPending,
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
      setError(null);

      if (purpose === "password-reset") {
        setPasswordResetPending(true);
      }

      await verifyOtp({
        email,
        token: values.token,
        purpose,
      });

      if (purpose === "password-reset") {
        navigation.navigate("ResetPassword");
      }
    } catch (err) {
      setPasswordResetPending(false);

      setError(
        err instanceof Error ? err.message : "Invalid verification code.",
      );
    }
  };

  const handleResend = async () => {
    try {
      setError(null);
      setResent(false);

      if (purpose === "signup") {
        await resendSignupOtp(email);
      } else {
        await resendPasswordResetOtp(email);
      }

      setResent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to resend code.");
    }
  };

  return (
    <AppScreen className="justify-center px-6">
      <AuthHeader
        icon={MailIcon}
        title="Verify your account"
        subtitle="Enter the 6-digit code we sent to your email."
      />

      <Box className="mt-6 flex-row items-center justify-center gap-2 rounded-xl bg-muted px-4 py-3">
        <Text className="text-sm font-medium text-foreground">{email}</Text>
      </Box>

      <Box className="mt-8">
        <Controller
          control={control}
          name="token"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormControl isInvalid={!!errors.token}>
              <Input
                className={`h-12 rounded-xl px-3.5 ${
                  errors.token ? "border-destructive" : ""
                }`}
              >
                <InputField
                  placeholder="000000"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              </Input>

              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                  {errors.token?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
          )}
        />
      </Box>

      {error && (
        <Box className="mt-4 rounded-xl bg-destructive/10 px-4 py-3">
          <Text className="text-sm text-destructive">{error}</Text>
        </Box>
      )}

      {resent && (
        <Box className="mt-4 flex-row items-center gap-2 rounded-xl bg-muted px-4 py-3">
          <Text className="text-sm text-muted-foreground">
            A new code has been sent.
          </Text>
        </Box>
      )}

      <Button
        className="mt-6 h-12 w-full rounded-xl"
        onPress={handleSubmit(onSubmit)}
        disabled={isPending}
      >
        {isPending && <ButtonSpinner className="text-primary-foreground" />}

        <ButtonText>{isPending ? "Verifying..." : "Verify"}</ButtonText>
      </Button>

      <Box className="mt-8 flex-row justify-center">
        <Text className="text-sm text-muted-foreground">
          Didn&apos;t receive the code?{" "}
        </Text>

        <Pressable onPress={handleResend}>
          <Text className="text-sm font-semibold text-foreground">Resend</Text>
        </Pressable>
      </Box>
    </AppScreen>
  );
}
