import { StyleSheet } from 'react-native';

import { ThemeColors } from '@/constants/Colors';

import { moderateScale } from '@/styles/scaling';

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
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
      backgroundColor: colors.card,
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
      backgroundColor: colors.grey,
      alignSelf: 'center',
      marginBottom: moderateScale(20),
    },

    title: {
      fontSize: moderateScale(20),
      fontWeight: '800',
      color: colors.textPrimary,
      textAlign: 'center',
    },

    subtitle: {
      fontSize: moderateScale(13),
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: moderateScale(6),
      marginBottom: moderateScale(20),
    },

    option: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: moderateScale(14),
      paddingVertical: moderateScale(13),
      paddingHorizontal: moderateScale(14),
      marginBottom: moderateScale(12),
      backgroundColor: colors.card,
    },

    iconContainer: {
      width: moderateScale(44),
      height: moderateScale(44),
      borderRadius: moderateScale(12),
      backgroundColor: colors.light_grey,
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
      color: colors.textPrimary,
    },

    optionSubtitle: {
      fontSize: moderateScale(11),
      color: colors.textSecondary,
      marginTop: moderateScale(3),
    },

    arrow: {
      color: colors.textSecondary,
    },

    icon: {
      color: colors.accent,
    },

    cancelButton: {
      height: moderateScale(48),
      borderRadius: moderateScale(12),
      backgroundColor: colors.light_grey,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: moderateScale(4),
    },

    cancelText: {
      fontSize: moderateScale(14),
      fontWeight: '700',
      color: colors.accent,
    },
  });

export default createStyles;
