import React, {HTMLAttributes} from 'react';
import styled from 'styled-components';

type AvatarProps = HTMLAttributes<HTMLElement> & {
  /** Change Avatar's border Radius */
  mode?: 'circle' | 'square';
  /** Changes a Avatar's size */
  size?: 'small' | 'default' | 'big';
  /** Avatar image src*/
  src: string;
};

/** Simple Avatar*/
export const Avatar: React.FC<AvatarProps> = ({
  mode = 'circle',
  size = 'default',
  src,
}) => {
  return <StyledAvatar {...{mode, size, src}} />;
};

type StyledAvatarProps = {
  size: string;
  mode: string;
};

type SizesType = {
  [key: string]: string;
};

const StyledAvatar = styled.img.attrs(({size, mode}: StyledAvatarProps) => {
  
  const sizes : SizesType = {'small': 'w-3 h-3', 'default': 'w-5 h-5', 'big': 'w-6 h-6'};
  const className: string = `bg-ui-100
    ${sizes[size]}
    ${mode === 'circle' ? 'rounded-full' : 'rounded-xl'}
  `;

  return {className};
})<StyledAvatarProps>``;
