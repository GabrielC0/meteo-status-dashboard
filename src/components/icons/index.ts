import SuccessIcon from "./SuccessIcon";
import WarningIcon from "./WarningIcon";
import ErrorIcon from "./ErrorIcon";
import UnknownIcon from "./UnknownIcon";

export { default as SuccessIcon } from "./SuccessIcon";
export { default as WarningIcon } from "./WarningIcon";
export { default as ErrorIcon } from "./ErrorIcon";
export { default as UnknownIcon } from "./UnknownIcon";

export type { IconProps } from "../ui/StatusIcon";

export const StatusIcons = {
  SUCCESS: SuccessIcon,
  WARNING: WarningIcon,
  ERROR: ErrorIcon,
  UNKNOWN: UnknownIcon,
} as const;
