import React, { useEffect, useRef } from 'react';
import { Animated, Image, Text, View } from 'react-native';

import IMAGES from '@/assets/images';
import Routes from '@/navigations/Routes';
import { en } from '@/language';

import createStyles from './styles';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { COLORS, THEME_COLORS } from '@/constants/Colors';

const Splash = ({ navigation }: any) => {
  const activeDot = useRef(new Animated.Value(0)).current;
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  const colors = THEME_COLORS[themeMode];
  const styles = createStyles(colors);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(activeDot, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(activeDot, {
          toValue: 2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(activeDot, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [activeDot]);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace(Routes.LOGIN);
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={IMAGES.LOGO} style={styles.logo} resizeMode="contain" />

      <Text style={styles.title}>
        Quote<Text style={styles.highlight}>Creator</Text>
      </Text>

      <Text style={styles.subtitle}>{en.SLOGAN}</Text>

      <View style={styles.pagination}>
        {[0, 1, 2].map(index => {
          const scale = activeDot.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [1, 1.5, 1],
            extrapolate: 'clamp',
          });

          const opacity = activeDot.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [0.35, 1, 0.35],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  transform: [{ scale }],
                  opacity,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

export default Splash;
