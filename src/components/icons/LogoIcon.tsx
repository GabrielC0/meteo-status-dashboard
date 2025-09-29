export const ClientLogoIcon = ({
  width = 1050,
  height = 1050,
}: {
  width?: number;
  height?: number;
}) => (
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
      ></path>
      <path
        id="ID_2"
        d="M15.254 10L13.4013 13.2098H9.69609L5.77435 20H17.3231L23.0933 10H15.254Z"
        fill="#00568a"
      ></path>
      <path
        id="ID_3"
        d="M7.84347 10L9.69609 6.79017L5.77436 0L0 10L5.77436 20L9.69609
  13.2098L7.84347 10Z"
        fill="#88C4F2"
      ></path>
      <path
        id="ID_4"
        d="M13.4013 6.79017L11.5487 10L13.4013 13.2098L15.254
  10L13.4013 6.79017Z"
        fill="#DDEDF9"
      ></path>
      <path
        id="ID_5"
        d="M11.5487 10H7.84346L9.69608 13.2098H13.4013L11.5487
  10Z"
        fill="#93CFFC"
      ></path>
      <path
        id="ID_6"
        d="M9.69608 6.79017L7.84346 10H11.5487L13.4013 6.79017H9.69608Z"
        fill="#4E9FCF"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0_278_564">
        <rect width="23.0933" height="20" fill="white"></rect>
      </clipPath>
    </defs>
  </svg>
);
