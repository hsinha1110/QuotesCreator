import { StyleSheet } from 'react-native';

import COLORS from '@/constants/Colors';
import { moderateScale } from '@/styles/scaling';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },

  modalContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: moderateScale(28),
    borderTopRightRadius: moderateScale(28),
    paddingHorizontal: moderateScale(24),
    paddingTop: moderateScale(12),
    paddingBottom: moderateScale(30),
  },

  handle: {
    width: moderateScale(42),
    height: moderateScale(4),
    borderRadius: moderateScale(4),
    backgroundColor: '#D8D3E5',
    alignSelf: 'center',
    marginBottom: moderateScale(20),
  },

  title: {
    fontSize: moderateScale(20),
    fontWeight: '800',
    color: COLORS.black,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: moderateScale(13),
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: moderateScale(6),
    marginBottom: moderateScale(20),
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E7E2F1',
    borderRadius: moderateScale(14),
    paddingVertical: moderateScale(13),
    paddingHorizontal: moderateScale(14),
    marginBottom: moderateScale(12),
  },

  iconContainer: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(12),
    backgroundColor: '#F0EAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  optionContent: {
    flex: 1,
    marginLeft: moderateScale(12),
  },

  optionTitle: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: COLORS.black,
  },

  optionSubtitle: {
    fontSize: moderateScale(11),
    color: COLORS.textSecondary,
    marginTop: moderateScale(3),
  },

  arrow: {
    color: COLORS.textSecondary,
  },

  icon: {
    color: COLORS.accent,
  },

  cancelButton: {
    height: moderateScale(48),
    borderRadius: moderateScale(12),
    backgroundColor: '#F4F1FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: moderateScale(4),
  },

  cancelText: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: COLORS.accent,
  },
});

export default styles;