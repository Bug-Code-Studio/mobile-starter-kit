import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/app/navigation/types';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { AppScreen } from '@/components/app/AppScreen';
import { AuthHeader } from '@/features/auth/components/AuthHeader';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { AlertCircleIcon, EyeIcon, EyeOffIcon, LockIcon } from '@/components/ui/icon';
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { ResetPasswordFormValues, resetPasswordSchema } from '@/features/auth/schemas/authSchemas';
import { useResetPassword } from '@/features/auth/hooks/useResetPassword';
import { useAuthFlowStore } from '@/stores/authFlowStore';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';

type Props = NativeStackScreenProps<AuthStackParamList, "ResetPassword">;

export function ResetPasswordScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { mutateAsync: resetPassword, isPending } =
    useResetPassword();

  const setPasswordResetPending =
    useAuthFlowStore(
      (state) => state.setPasswordResetPending,
    );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (
    values: ResetPasswordFormValues,
  ) => {
    try {

      await resetPassword(values.password);

      setPasswordResetPending(false);

      navigation.navigate('Login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppScreen className="justify-center px-6">
      <AuthHeader
        icon={LockIcon}
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
                  errors.password ? 'border-destructive' : ''
                }`}
              >
                <InputIcon
                  as={LockIcon}
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
                  placeholder="••••••••"
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
                  {t(`auth.common.error.${errors.confirmPassword?.message ?? ""}`)}
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
        {isPending && (
          <ButtonSpinner className="text-primary-foreground" />
        )}

        <ButtonText>
          {isPending ? t('auth.common.updating') : t('auth.common.updatePassword')}
        </ButtonText>
      </Button>
    </AppScreen>
  );
}