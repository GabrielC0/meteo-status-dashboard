import { IconProps } from "../ui/StatusIcon";

const SuccessIcon = ({ width = 20, height = 20, className }: IconProps) => {
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
        d="m9 12 2 2 4-4"
        stroke="white"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SuccessIcon;
