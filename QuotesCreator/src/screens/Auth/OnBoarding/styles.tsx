// styles.ts
import { Dimensions, StyleSheet } from 'react-native';
import { moderateScale } from '@/styles/scaling';
import COLORS from '@/constants/Colors';

const { width } = Dimensions.get('window');

// 1. Ek fixed width & height set karo jo sabhi images ke liye constant rahegi
const IMAGE_SIZE = width * 0.72; // Sabhi images ab bilkul same box area le legi

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: moderateScale(110),
  },

  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE, // Square container standard layout ke liye
    marginTop: moderateScale(25),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },

  image: {
    width: '100%',
    height: '100%',
    // FIX: resizeMode 'contain' container ke andar best-fit rakhega
    // Magar visual balance ke liye imageContainer fix hone se sab same dikhengi.
  },

  content: {
    width: width - moderateScale(50),
    alignItems: 'center',
    paddingTop: moderateScale(20),
  },

  title: {
    fontSize: moderateScale(24),
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: moderateScale(15),
  },

  description: {
    fontSize: moderateScale(15),
    lineHeight: moderateScale(23),
    fontWeight: '400',
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: moderateScale(10),
  },

  bottomContainer: {
    position: 'absolute',
    left: moderateScale(20),
    right: moderateScale(20),
    bottom: moderateScale(35),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  skipButton: {
    width: moderateScale(65),
    height: moderateScale(48),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  skipText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: COLORS.white,
  },

  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(5),
  },

  dot: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
    backgroundColor: COLORS.dotInactive,
  },

  activeDot: {
    width: moderateScale(25),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
    backgroundColor: COLORS.onboardingAccent,
  },

  nextButton: {
    minWidth: moderateScale(105),
    height: moderateScale(48),
    paddingHorizontal: moderateScale(18),
    borderRadius: moderateScale(8),
    backgroundColor: COLORS.onboardingAccent,
    justifyContent: 'center',
    alignItems: 'center',
  },

  nextText: {
    color: COLORS.white,
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
});

export default styles;
