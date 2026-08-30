import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface Props {
  size?: number;
}

const FacebookIcon = ({ size = 20 }: Props) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill="#1877F2"
        d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11 10.13 11.93v-8.43H7.08v-3.5h3.05V9.41c0-3.03 1.79-4.7 4.55-4.7 1.32 0 2.7.24 2.7.24v2.98h-1.52c-1.5 0-1.97.94-1.97 1.9v2.28h3.35l-.54 3.5h-2.81V24C19.61 23.07 24 18.09 24 12.07Z"
      />
    </Svg>
  );
};

export default FacebookIcon;
