import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface Props {
  size?: number;
}

const GoogleIcon = ({ size = 20 }: Props) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
    >
      <Path
        fill="#4285F4"
        d="M21.35 12.23c0-.72-.06-1.42-.18-2.09H12v3.96h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.26Z"
      />
      <Path
        fill="#34A853"
        d="M12 21.91c2.63 0 4.84-.87 6.45-2.42l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.91Z"
      />
      <Path
        fill="#FBBC05"
        d="M6.54 13.93a5.85 5.85 0 0 1 0-3.86V7.54H3.3a9.82 9.82 0 0 0 0 8.92l3.24-2.53Z"
      />
      <Path
        fill="#EA4335"
        d="M12 6.04c1.43 0 2.72.49 3.73 1.46l2.8-2.8C16.84 3.08 14.63 2.09 12 2.09a9.74 9.74 0 0 0-8.7 5.45l3.24 2.53C7.31 7.76 9.46 6.04 12 6.04Z"
      />
    </Svg>
  );
};

export default GoogleIcon;