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
    // KEYBOARD
    // ==========================================

    keyboardContainer: {
      flex: 1,
    },

    // ==========================================
    // CONTENT
    // ==========================================

    content: {
      paddingHorizontal: moderateScale(20),

      paddingBottom: moderateScale(30),
    },

    // ==========================================
    // HEADING
    // ==========================================

    headingContainer: {
      marginTop: moderateScale(20),

      marginBottom: moderateScale(25),
    },

    title: {
      fontSize: moderateScale(24),

      fontWeight: '700',

      color: colors.textPrimary,

      marginBottom: moderateScale(8),
    },

    subtitle: {
      fontSize: moderateScale(14),

      lineHeight: moderateScale(21),

      color: colors.textSecondary,
    },

    // ==========================================
    // INPUT CONTAINER
    // ==========================================

    inputContainer: {
      marginBottom: moderateScale(20),
    },

    label: {
      fontSize: moderateScale(15),

      fontWeight: '600',

      color: colors.textPrimary,

      marginBottom: moderateScale(9),
    },

    // ==========================================
    // QUOTE INPUT
    // ==========================================

    quoteInput: {
      minHeight: moderateScale(150),

      borderWidth: 1,

      borderColor: colors.inputBorder,

      borderRadius: moderateScale(14),

      paddingHorizontal: moderateScale(15),

      paddingTop: moderateScale(15),

      paddingBottom: moderateScale(30),

      fontSize: moderateScale(15),

      color: colors.textPrimary,

      backgroundColor: colors.inputBackground,
    },

    characterCount: {
      position: 'absolute',

      right: moderateScale(12),

      bottom: moderateScale(10),

      fontSize: moderateScale(11),

      color: colors.textSecondary,
    },

    // ==========================================
    // AUTHOR INPUT
    // ==========================================

    authorInput: {
      height: moderateScale(52),
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: moderateScale(14),
      paddingHorizontal: moderateScale(15),
      fontSize: moderateScale(15),
      color: colors.textPrimary,
      backgroundColor: colors.inputBackground,
    },

    optional: {
      fontSize: moderateScale(11),
      color: colors.textSecondary,
      marginTop: moderateScale(5),
    },

    // ==========================================
    // PREVIEW
    // ==========================================

    previewContainer: {
      marginTop: moderateScale(2),
      marginBottom: moderateScale(25),
    },

    previewLabel: {
      fontSize: moderateScale(15),

      fontWeight: '600',

      color: colors.textPrimary,

      marginBottom: moderateScale(10),
    },

    previewCard: {
      minHeight: moderateScale(150),
      borderRadius: moderateScale(18),
      backgroundColor: colors.primary,
      padding: moderateScale(22),
      justifyContent: 'center',
      alignItems: 'center',
    },

    previewQuote: {
      fontSize: moderateScale(18),
      lineHeight: moderateScale(27),
      fontWeight: '600',
      color: colors.white,
      textAlign: 'center',
    },

    previewAuthor: {
      marginTop: moderateScale(15),
      fontSize: moderateScale(13),
      color: colors.white,
      opacity: 0.9,
    },

    // ==========================================
    // SAVE BUTTON
    // ==========================================

    continueButton: {
      height: moderateScale(54),
      borderRadius: moderateScale(14),
      backgroundColor: colors.accent,
      justifyContent: 'center',
      alignItems: 'center',
    },

    disabledButton: {
      opacity: 0.45,
    },

    continueText: {
      color: colors.white,
      fontSize: moderateScale(15),
      fontWeight: '700',
    },
  });

export default createStyles;
