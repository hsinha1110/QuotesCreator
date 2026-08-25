import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './styles';
import IMAGES from '@/assets/images';
import Routes from '@/navigations/Routes';
import { OnboardingItem } from '@/types';
import { onboardingData } from '@/constants/Data';

const { width } = Dimensions.get('window');




const OnBoarding = ({ navigation }: any) => {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      navigation.replace(Routes.LOGIN);
    }
  };

  const handleSkip = () => {
    navigation.replace(Routes.LOGIN);
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: OnboardingItem;
    index: number;
  }) => {
    return (
      <View style={styles.slide}>
        <View style={styles.imageContainer}>
          <Image
            source={item.image}
            style={[
              styles.image,
              // First image ke intrinsic dimensions match karne ke liye scale balanced kiya hai
              index === 0 && { transform: [{ scale: 0.85 }] },
            ]}
            resizeMode="contain"
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#3F1E8C', '#48249A', '#32196F', '#26145F']}
      locations={[0, 0.3, 0.65, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={false}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          onPress={handleSkip}
          activeOpacity={0.7}
          style={styles.skipButton}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <View style={styles.pagination}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, index === currentIndex && styles.activeDot]}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={handleNext}
          activeOpacity={0.8}
          style={styles.nextButton}
        >
          <Text style={styles.nextText}>
            {currentIndex === onboardingData.length - 1
              ? 'Get Started'
              : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default OnBoarding;
