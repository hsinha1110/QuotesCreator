import { StyleSheet } from 'react-native';

import { moderateScale } from 'react-native-size-matters';

import { ThemeColors } from '@/constants/Colors';

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    // ==========================================
    // CONTAINER
    // ==========================================

    container: {
      flex: 1,

      backgroundColor: colors.background,
    },

    // ==========================================
    // TIME CONTAINER
    // ==========================================

    timeContainer: {
      flex: 1,

      paddingHorizontal: moderateScale(20),

      paddingTop: moderateScale(30),

      backgroundColor: colors.background,
    },

    // ==========================================
    // TITLE
    // ==========================================

    timeTitle: {
      fontSize: moderateScale(18),

      fontWeight: '600',

      color: colors.textPrimary,

      lineHeight: moderateScale(26),

      marginBottom: moderateScale(25),
    },

    // ==========================================
    // TIME CARD
    // ==========================================

    timeCard: {
      minHeight: moderateScale(100),

      borderRadius: moderateScale(18),

      backgroundColor: colors.light_grey,

      borderWidth: 1,

      borderColor: colors.border,

      paddingHorizontal: moderateScale(20),

      paddingVertical: moderateScale(18),

      flexDirection: 'row',

      alignItems: 'center',

      justifyContent: 'space-between',
    },

    // ==========================================
    // TIME LABEL
    // ==========================================

    timeLabel: {
      fontSize: moderateScale(13),

      color: colors.textSecondary,

      marginBottom: moderateScale(5),
    },

    // ==========================================
    // TIME VALUE
    // ==========================================

    timeValue: {
      fontSize: moderateScale(32),

      fontWeight: '700',

      color: colors.accent,
    },

    // ==========================================
    // CHANGE
    // ==========================================

    editText: {
      fontSize: moderateScale(13),

      fontWeight: '600',

      color: colors.accent,
    },

    // ==========================================
    // PICKER
    // ==========================================

    pickerContainer: {
      marginTop: moderateScale(20),

      alignItems: 'center',

      justifyContent: 'center',

      backgroundColor: colors.card,

      borderRadius: moderateScale(18),

      paddingVertical: moderateScale(15),

      borderWidth: 1,

      borderColor: colors.border,
    },

    // ==========================================
    // INFO
    // ==========================================

    infoContainer: {
      marginTop: moderateScale(25),

      padding: moderateScale(15),

      borderRadius: moderateScale(14),

      backgroundColor: colors.card,

      borderWidth: 1,

      borderColor: colors.border,

      flexDirection: 'row',

      alignItems: 'flex-start',
    },

    infoIcon: {
      fontSize: moderateScale(17),

      color: colors.accent,

      marginRight: moderateScale(10),
    },

    infoText: {
      flex: 1,

      fontSize: moderateScale(13),

      lineHeight: moderateScale(19),

      color: colors.textSecondary,
    },

    // ==========================================
    // TIMEZONE
    // ==========================================

    timezoneContainer: {
      marginTop: moderateScale(18),

      paddingVertical: moderateScale(18),

      paddingHorizontal: moderateScale(16),

      borderBottomWidth: 1,

      borderBottomColor: colors.border,

      backgroundColor: colors.background,
    },

    timezoneTitle: {
      fontSize: moderateScale(14),

      fontWeight: '600',

      color: colors.textPrimary,

      marginBottom: moderateScale(5),
    },

    timezoneValue: {
      fontSize: moderateScale(13),

      color: colors.textSecondary,
    },
  });

export default createStyles;
