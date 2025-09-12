import { IconProps } from "../ui/StatusIcon";

const UnknownIcon = ({ width = 20, height = 20, className }: IconProps) => {
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
        d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 17h.01"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default UnknownIcon;
