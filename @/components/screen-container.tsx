import React from 'react';
import { View, ViewProps } from 'react-native';

type Props = ViewProps & { children?: React.ReactNode };

export const ScreenContainer = ({ children, style, ...rest }: Props) => {
  return (
    <View style={[{ flex: 1 }, style]} {...rest}>
      {children}
    </View>
  );
};

export default ScreenContainer;
