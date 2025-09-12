import { IconProps } from "../ui/StatusIcon";

const ErrorIcon = ({ width = 20, height = 20, className }: IconProps) => {
  return (
    <svg
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
    >
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path
        d="m15 9-6 6"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m9 9 6 6"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ErrorIcon;
