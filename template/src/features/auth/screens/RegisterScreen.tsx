import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppScreen } from '@/components/app/AppScreen';
import { AuthHeader } from '@/features/auth/components/AuthHeader';
import {
  Input,
  InputField,
  InputIcon,
  InputSlot,
} from '@/components/ui/input';
import {
  Button,
  ButtonSpinner,
  ButtonText,
} from '@/components/ui/button';
import {
  AlertCircleIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  UnlockIcon,
} from '@/components/ui/icon';
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';

import type { AuthStackParamList } from '@/app/navigation/types';
import { RegisterFormValues, registerSchema } from '@/features/auth/schemas/authSchemas';
import { useRegister } from '@/features/auth/hooks/useRegister';
import { Box } from '@/components/ui/box';
import { Pressable } from '@/components/ui/pressable';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';

type Props = NativeStackScreenProps<
  AuthStackParamList,
  'Register'
>;

export function RegisterScreen({ navigation }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { mutateAsync: register, isPending } = useRegister();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      surname: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (
    values: RegisterFormValues,
  ) => {
    try {
      setError(null);

      const { session } = await register({
        name: values.name,
        surname: values.surname,
        email: values.email,
        password: values.password,
      });

      if (!session) {
        navigation.navigate('AccountVerify', {
          email: values.email,
          purpose: 'signup',
        });
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to create account.',
      );
    }
  };

  return (
    <AppScreen edges={['top', 'bottom']}>
      <ScrollView
        contentContainerClassName="justify-center px-6"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <AuthHeader
          icon={UnlockIcon}
          title="Create account"
          subtitle="Enter your information to get started."
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
                      Name
                    </FormControlLabelText>
                  </FormControlLabel>

                  <Input
                    className={`h-12 rounded-xl px-3.5 ${
                      errors.name ? 'border-destructive' : ''
                    }`}
                  >
                    <InputField
                      placeholder="Name"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  </Input>

                  <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} />
                    <FormControlErrorText>
                      {errors.name?.message}
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
                      Surname
                    </FormControlLabelText>
                  </FormControlLabel>

                  <Input
                    className={`h-12 rounded-xl px-3.5 ${
                      errors.surname ? 'border-destructive' : ''
                    }`}
                  >
                    <InputField
                      placeholder="Surname"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  </Input>

                  <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} />
                    <FormControlErrorText>
                      {errors.surname?.message}
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
                    errors.password ? 'border-destructive' : ''
                  }`}
                >
                  <InputIcon
                    as={LockIcon}
                    className="text-muted-foreground"
                  />

                  <InputField
                    placeholder="At least 8 characters"
                    secureTextEntry={!showPassword}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />

                  <InputSlot
                    onPress={() =>
                      setShowPassword((prev) => !prev)
                    }
                  >
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

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl isInvalid={!!errors.confirmPassword}>
                <FormControlLabel>
                  <FormControlLabelText className="text-sm">
                    Confirm password
                  </FormControlLabelText>
                </FormControlLabel>

                <Input
                  className={`h-12 rounded-xl px-3.5 ${
                    errors.confirmPassword
                      ? 'border-destructive'
                      : ''
                  }`}
                >
                  <InputIcon
                    as={LockIcon}
                    className="text-muted-foreground"
                  />

                  <InputField
                    placeholder="Re-enter your password"
                    secureTextEntry={!showConfirm}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />

                  <InputSlot
                    onPress={() =>
                      setShowConfirm((prev) => !prev)
                    }
                  >
                    <InputIcon
                      as={showConfirm ? EyeOffIcon : EyeIcon}
                      className="text-muted-foreground"
                    />
                  </InputSlot>
                </Input>

                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {errors.confirmPassword?.message}
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
            {isPending ? 'Creating...' : 'Create Account'}
          </ButtonText>
        </Button>

        <Box className="mt-8 flex-row justify-center">
          <Text className="text-sm text-muted-foreground">
            Already have an account?{' '}
          </Text>

          <Pressable onPress={() => navigation.goBack()}>
            <Text className="text-sm font-semibold text-foreground">
              Sign in
            </Text>
          </Pressable>
        </Box>
      </ScrollView>
    </AppScreen>
  );
}