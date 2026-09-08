import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppScreen } from '@/components/app/AppScreen';
import { AuthHeader } from '@/features/auth/components/AuthHeader';
import { Input, InputField, InputIcon } from '@/components/ui/input';
import {
  Button,
  ButtonSpinner,
  ButtonText,
} from '@/components/ui/button';
import { AlertCircleIcon, HelpCircleIcon, MailIcon } from '@/components/ui/icon';
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';

import type { AuthStackParamList } from '@/app/navigation/types';
import { ForgotPasswordFormValues, forgotPasswordSchema } from '@/features/auth/schemas/authSchemas';
import { useForgotPassword } from '@/features/auth/hooks/useForgotPassword';
import { Box } from '@/components/ui/box';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';

type Props = NativeStackScreenProps<
  AuthStackParamList,
  'ForgotPassword'
>;

export function ForgotPasswordScreen({
  navigation,
}: Props) {
  const [error, setError] = useState<string | null>(null);

  const { mutateAsync: sendResetOtp, isPending } =
    useForgotPassword();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (
    values: ForgotPasswordFormValues,
  ) => {
    try {
      setError(null);

      await sendResetOtp(values.email);

      navigation.navigate('AccountVerify', {
        email: values.email,
        purpose: 'password-reset',
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to send reset code.',
      );
    }
  };

  return (
    <AppScreen className="justify-center px-6">
      <AuthHeader
        icon={HelpCircleIcon}
        title="Forgot password?"
        subtitle="Enter your email and we'll send you a verification code."
      />

      <Box className="mt-10">
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
                  errors.email ? 'border-destructive' : ''
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
                  {errors.email?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
          )}
        />
      </Box>

      {error && (
        <Box className="mt-4 rounded-xl bg-destructive/10 px-4 py-3">
          <Text className="text-sm text-destructive">
            {error}
          </Text>
        </Box>
      )}

      <Button
        className="mt-6 h-12 w-full rounded-xl"
        onPress={handleSubmit(onSubmit)}
        disabled={isPending}
      >
        {isPending && (
          <ButtonSpinner className="text-primary-foreground" />
        )}

        <ButtonText>
          {isPending ? 'Sending...' : 'Send Code'}
        </ButtonText>
      </Button>

      <Box className="mt-8 flex-row justify-center">
        <Text className="text-sm text-muted-foreground">
          Remember your password?{' '}
        </Text>

        <Pressable onPress={() => navigation.goBack()}>
          <Text className="text-sm font-semibold text-foreground">
            Sign in
          </Text>
        </Pressable>
      </Box>
    </AppScreen>
  );
}