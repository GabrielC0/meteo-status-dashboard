import { IconProps, LogoIconProps } from '@/types';

export const ErrorIcon = ({ width = 20, height = 20, className }: IconProps) => (
  <svg
    width={width}
    height={height}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M404.33 152.89H392.2C384.71 84.85 326.14 32 256 32C227.819 31.9729 200.322 40.6756 177.289 56.9116C154.255 73.1476 136.817 96.1198 127.37 122.67H122.8C72.86 122.67 32 163.47 32 213.33C32 263.2 72.86 304 122.8 304H404.33C446 304 480 270 480 228.44C480 186.89 446 152.89 404.33 152.89Z"
      stroke="var(--text-color-secondary)"
      strokeWidth="36"
      fill="none"
    />
    <path
      d="M208 304L192 400H240V480L320 368H272L288 304"
      stroke="var(--yellow)"
      strokeWidth="36"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M120 352L96 400M136 432L120 464M400 352L376 400M416 432L400 464"
      stroke="var(--cyan)"
      strokeWidth="36"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SuccessIcon = ({ width = 20, height = 20, className }: IconProps) => (
  <svg
    width={width}
    height={height}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    className={className}
    aria-hidden="true"
  >
    <line
      x1="256"
      x2="256"
      y1="48"
      y2="96"
      fill="none"
      stroke="var(--yellow)"
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="36"
    />
    <line
      x1="256"
      x2="256"
      y1="416"
      y2="464"
      fill="none"
      stroke="var(--yellow)"
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="36"
    />
    <line
      x1="403.08"
      x2="369.14"
      y1="108.92"
      y2="142.86"
      fill="none"
      stroke="var(--yellow)"
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="36"
    />
    <line
      x1="142.86"
      x2="108.92"
      y1="369.14"
      y2="403.08"
      fill="none"
      stroke="var(--yellow)"
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="36"
    />
    <line
      x1="464"
      x2="416"
      y1="256"
      y2="256"
      fill="none"
      stroke="var(--yellow)"
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="36"
    />
    <line
      x1="96"
      x2="48"
      y1="256"
      y2="256"
      fill="none"
      stroke="var(--yellow)"
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="36"
    />
    <line
      x1="403.08"
      x2="369.14"
      y1="403.08"
      y2="369.14"
      fill="none"
      stroke="var(--yellow)"
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="36"
    />
    <line
      x1="142.86"
      x2="108.92"
      y1="142.86"
      y2="108.92"
      fill="none"
      stroke="var(--yellow)"
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="36"
    />
    <circle
      cx="256"
      cy="256"
      r="80"
      fill="none"
      stroke="var(--yellow)"
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="36"
    />
  </svg>
);

export const UnknownIcon = ({ width = 20, height = 20, className }: IconProps) => (
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

export const WarningIcon = ({ width = 20, height = 20, className }: IconProps) => (
  <svg
    width={width}
    height={height}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    className={className}
    aria-hidden="true"
    stroke="var(--text-color-secondary)"
  >
    <path
      d="M384.8,271.4a80,80,0,1,0-123.55-92"
      fill="transparent"
      stroke="var(--yellow)"
      strokeWidth="36px"
    />
    <path
      d="M90.61,306.85A16.07,16.07,0,0,0,104,293.6C116.09,220.17,169.63,176,232,176c57.93,0,96.62,37.75,112.2,77.74a15.84,15.84,0,0,0,12.2,9.87c50,8.15,91.6,41.54,91.6,99.59C448,422.6,399.4,464,340,464H106c-49.5,0-90-24.7-90-79.2C16,336.33,54.67,312.58,90.61,306.85Z"
      fill="transparent"
      strokeWidth="36px"
    />
    <line
      x1="464"
      x2="496"
      y1="208"
      y2="208"
      stroke="var(--yellow)"
      strokeLinecap="round"
      strokeWidth="36px"
    />
    <line
      x1="336"
      x2="336"
      y1="48"
      y2="80"
      stroke="var(--yellow)"
      strokeLinecap="round"
      strokeWidth="36px"
    />
    <line
      x1="222.86"
      x2="245.49"
      y1="94.86"
      y2="117.49"
      stroke="var(--yellow)"
      strokeLinecap="round"
      strokeWidth="36px"
    />
    <line
      x1="449.14"
      x2="426.51"
      y1="94.86"
      y2="117.49"
      stroke="var(--yellow)"
      strokeLinecap="round"
      strokeWidth="36px"
    />
  </svg>
);

export const ClientLogoIcon = ({ width = 1050, height = 1050 }: LogoIconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet"
    style={{ pointerEvents: 'none' }}
    className="loginPage__cubeLogoBackground"
  >
    <g clipPath="url(#clip0_278_564)">
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 12 10"
        to="360 12 10"
        dur="90s"
        repeatCount="indefinite"
      />
      <path
        id="ID_1"
        d="M9.69609 6.79017H13.4013L15.254 10H23.0933L17.3231 0H5.77435L9.69609 6.79017Z"
        fill="#0099FF"
      />
      <path
        id="ID_2"
        d="M15.254 10L13.4013 13.2098H9.69609L5.77435 20H17.3231L23.0933 10H15.254Z"
        fill="#00568a"
      />
      <path
        id="ID_3"
        d="M7.84347 10L9.69609 6.79017L5.77436 0L0 10L5.77436 20L9.69609 13.2098L7.84347 10Z"
        fill="#88C4F2"
      />
      <path
        id="ID_4"
        d="M13.4013 6.79017L11.5487 10L13.4013 13.2098L15.254 10L13.4013 6.79017Z"
        fill="#DDEDF9"
      />
      <path id="ID_5" d="M11.5487 10H7.84346L9.69608 13.2098H13.4013L11.5487 10Z" fill="#93CFFC" />
      <path
        id="ID_6"
        d="M9.69608 6.79017L7.84346 10H11.5487L13.4013 6.79017H9.69608Z"
        fill="#4E9FCF"
      />
    </g>
    <defs>
      <clipPath id="clip0_278_564">
        <rect width="23.0933" height="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export const LogoutIcon = ({ width = 20, height = 20, className }: IconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12L16 7M21 12H9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SettingsIcon = ({ width = 16, height = 16, className }: IconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.2569 9.77251 19.9859C9.5799 19.7148 9.31074 19.5053 9 19.38C8.69838 19.2469 8.36381 19.2072 8.03941 19.266C7.71502 19.3248 7.41568 19.4795 7.18 19.71L7.12 19.77C6.93425 19.956 6.71368 20.1035 6.47088 20.2041C6.22808 20.3048 5.96783 20.3566 5.705 20.3566C5.44217 20.3566 5.18192 20.3048 4.93912 20.2041C4.69632 20.1035 4.47575 19.956 4.29 19.77C4.10405 19.5843 3.95653 19.3637 3.85588 19.1209C3.75523 18.8781 3.70343 18.6178 3.70343 18.355C3.70343 18.0922 3.75523 17.8319 3.85588 17.5891C3.95653 17.3463 4.10405 17.1257 4.29 16.94L4.35 16.88C4.58054 16.6443 4.73519 16.345 4.794 16.0206C4.85282 15.6962 4.81312 15.3616 4.68 15.06C4.55324 14.7642 4.34276 14.512 4.07447 14.3343C3.80618 14.1566 3.49179 14.0613 3.17 14.06H3C2.46957 14.06 1.96086 13.8493 1.58579 13.4742C1.21071 13.0991 1 12.5904 1 12.06C1 11.5296 1.21071 11.0209 1.58579 10.6458C1.96086 10.2707 2.46957 10.06 3 10.06H3.09C3.42099 10.0523 3.742 9.94512 4.01309 9.75251C4.28417 9.5599 4.49372 9.29074 4.62 8.98C4.75312 8.67838 4.79282 8.34381 4.734 8.01941C4.67519 7.69502 4.52054 7.39568 4.29 7.16L4.23 7.1C4.04405 6.91425 3.89653 6.69368 3.79588 6.45088C3.69523 6.20808 3.64343 5.94783 3.64343 5.685C3.64343 5.42217 3.69523 5.16192 3.79588 4.91912C3.89653 4.67632 4.04405 4.45575 4.23 4.27C4.41575 4.08405 4.63632 3.93653 4.87912 3.83588C5.12192 3.73523 5.38217 3.68343 5.645 3.68343C5.90783 3.68343 6.16808 3.73523 6.41088 3.83588C6.65368 3.93653 6.87425 4.08405 7.06 4.27L7.12 4.33C7.35568 4.56054 7.65502 4.71519 7.97941 4.774C8.30381 4.83282 8.63838 4.79312 8.94 4.66H9C9.29577 4.53324 9.54802 4.32276 9.72569 4.05447C9.90337 3.78618 9.99872 3.47179 10 3.15V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CloseIcon = ({ width = 16, height = 16, className }: IconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M18 6L6 18M6 6L18 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const AddUserIcon = ({ width = 16, height = 16, className }: IconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11ZM20 8V14M17 11H23"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const EditIcon = ({ width = 14, height = 14, className }: IconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13M18.5 2.5C18.8978 2.10218 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10218 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const DeleteIcon = ({ width = 14, height = 14, className }: IconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const StatusIcons = {
  SUCCESS: SuccessIcon,
  WARNING: WarningIcon,
  ERROR: ErrorIcon,
  UNKNOWN: UnknownIcon,
};
