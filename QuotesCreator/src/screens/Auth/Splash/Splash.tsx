import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';

import IMAGES from '@/assets/images';
import Routes from '@/navigations/Routes';
import { en } from '@/language';
import styles from './styles';
const Splash = ({ navigation }: any) => {
  const activeDot = useRef(new Animated.Value(0)).current;
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

  // Splash ke baad onboarding
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace(Routes.LOGIN);
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={IMAGES.LOGO} style={styles.logo} resizeMode="contain" />

      {/* App Name */}
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
