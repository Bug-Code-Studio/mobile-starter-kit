import { Alert, AlertIcon, AlertText } from '@/components/ui/alert';
import { AlertCircleIcon } from '@/components/ui/icon';
import { resolveUserError } from '@/lib/errors';
import { useTranslation } from 'react-i18next';

type AppErrorMessageProps = {
  error: unknown;
  className?: string;
};

export function AppErrorMessage({
  error,
  className,
}: AppErrorMessageProps) {
  const { t } = useTranslation();

  if (!error) {
    return null;
  }

  const { key, params } = resolveUserError(error);

  return (
    <Alert
      className={className}
      variant="destructive"
      accessibilityLiveRegion="assertive"
      accessibilityRole="alert"
    >
      <AlertIcon as={AlertCircleIcon} />
      <AlertText>{t(key, params)}</AlertText>
    </Alert>
  );
}
