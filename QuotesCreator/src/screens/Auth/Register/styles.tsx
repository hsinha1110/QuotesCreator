import { StyleSheet } from 'react-native';

import COLORS from '@/constants/Colors';
import { moderateScale } from '@/styles/scaling';

const styles = StyleSheet.create({
  // ======================================
  // CONTAINER
  // ======================================

  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  scrollContent: {
    flexGrow: 1,
  },

  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: moderateScale(24),
    paddingVertical: moderateScale(30),
  },

  // ======================================
  // PROFILE IMAGE
  // ======================================

  profileContainer: {
    width: moderateScale(82),
    height: moderateScale(82),
    borderRadius: moderateScale(41),
    alignSelf: 'center',
    marginBottom: moderateScale(7),
    position: 'relative',
  },

  profilePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: moderateScale(41),
    backgroundColor: '#F0EAFE',
    borderWidth: moderateScale(2),
    borderColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: moderateScale(41),
    borderWidth: moderateScale(2),
    borderColor: COLORS.accent,
  },

  // ======================================
  // CAMERA BADGE
  // ======================================

  cameraBadge: {
    position: 'absolute',
    right: moderateScale(-3),
    bottom: moderateScale(-1),
    width: moderateScale(31),
    height: moderateScale(31),
    borderRadius: moderateScale(16),
    backgroundColor: COLORS.accent,
    borderWidth: moderateScale(3),
    borderColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ======================================
  // PHOTO TEXT
  // ======================================

  photoTitle: {
    fontSize: moderateScale(13),
    fontWeight: '700',
    color: COLORS.black,
    textAlign: 'center',
  },

  photoSubtitle: {
    fontSize: moderateScale(11),
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: moderateScale(2),
    marginBottom: moderateScale(14),
  },

  // ======================================
  // HEADER
  // ======================================

  header: {
    alignItems: 'center',
    marginBottom: moderateScale(18),
  },

  title: {
    fontSize: moderateScale(25),
    lineHeight: moderateScale(31),
    fontWeight: '800',
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: moderateScale(5),
  },

  subtitle: {
    fontSize: moderateScale(13),
    lineHeight: moderateScale(19),
    color: COLORS.textSecondary,
    textAlign: 'center',
  },

  // ======================================
  // BUTTON
  // ======================================

  buttonContainer: {
    marginTop: moderateScale(20),
  },

  // ======================================
  // DIVIDER
  // ======================================

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: moderateScale(10),
  },

  divider: {
    flex: 1,
    height: moderateScale(1),
    backgroundColor: '#E8E2F5',
  },

  dividerText: {
    marginHorizontal: moderateScale(12),
    fontSize: moderateScale(12),
    color: COLORS.black,
  },

  // ======================================
  // SOCIAL
  // ======================================

  socialContainer: {
    flexDirection: 'row',
    gap: moderateScale(10),
  },
});

export default styles;