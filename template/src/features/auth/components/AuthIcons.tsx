import type { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";

type AuthIconProps = Omit<ComponentProps<typeof Ionicons>, "name">;

export function AuthAlertIcon(props: AuthIconProps) {
  return <Ionicons name="alert-circle-outline" {...props} color={props.color ?? "#e11d48"} />;
}

export function AuthEmailIcon(props: AuthIconProps) {
  return <Ionicons name="mail-outline" {...props} color={props.color ?? "#737373"} />;
}

export function AuthLockIcon(props: AuthIconProps) {
  return <Ionicons name="lock-closed-outline" {...props} color={props.color ?? "#737373"} />;
}

export function AuthUnlockIcon(props: AuthIconProps) {
  return <Ionicons name="lock-open-outline" {...props} color={props.color ?? "#171717"} />;
}

export function AuthEyeIcon(props: AuthIconProps) {
  return <Ionicons name="eye-outline" {...props} color={props.color ?? "#737373"} />;
}

export function AuthEyeOffIcon(props: AuthIconProps) {
  return <Ionicons name="eye-off-outline" {...props} color={props.color ?? "#737373"} />;
}

export function AuthHelpIcon(props: AuthIconProps) {
  return <Ionicons name="help-circle-outline" {...props} color={props.color ?? "#171717"} />;
}
