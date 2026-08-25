import { View, Image, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';
import IMAGES from '@/assets/images';
import Routes from '@/navigations/Routes';
import { en } from '@/language';

const Splash = ({ navigation }: any) => {
  const [progress, setProgress] = useState(0);

  // Progress loader
  useEffect(() => {
    const duration = 2000;
    const intervalTime = 20;
    const increment = intervalTime / duration;

    const interval = setInterval(() => {
      setProgress(prev => {
        const nextProgress = prev + increment;

        if (nextProgress >= 1) {
          clearInterval(interval);
          return 1;
        }

        return nextProgress;
      });
    }, intervalTime);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Loader complete hone ke baad navigation
  useEffect(() => {
    if (progress >= 1) {
      navigation.replace(Routes.ONBOARDING);
    }
  }, [progress, navigation]);

  return (
    <LinearGradient
      colors={['#3B1C85', '#4A249C', '#170E49']}
      locations={[0, 0.45, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <Image source={IMAGES.LOGO} style={styles.logo} />
      <Text style={styles.slogan}>{en.SLOGAN}</Text>
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progress,
            {
              width: `${progress * 100}%`,
            },
          ]}
        />
      </View>
    </LinearGradient>
  );
};

export default Splash;
