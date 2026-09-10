import { Alert, AlertIcon, AlertText } from '@/components/ui/alert';
import { AlertCircleIcon } from '@/components/ui/icon';
import { getUserErrorKey } from '@/lib/errors';
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

  return (
    <Alert className={className} variant="destructive">
      <AlertIcon as={AlertCircleIcon} />
      <AlertText>{t(getUserErrorKey(error))}</AlertText>
    </Alert>
  );
}
