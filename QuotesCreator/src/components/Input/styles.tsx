import {StyleSheet} from 'react-native';

import {ThemeColors} from '@/constants/Colors';

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    wrapper: {
      width: '100%',
      marginBottom: 14,
    },

    inputContainer: {
      width: '100%',
      height: 52,

      borderWidth: 1,
      borderColor: colors.inputBorder,

      borderRadius: 12,

      backgroundColor: colors.inputBackground,

      flexDirection: 'row',
      alignItems: 'center',

      paddingHorizontal: 14,
    },

    inputError: {
      borderColor: colors.red,
    },

    leftIcon: {
      marginRight: 10,
    },

    input: {
      flex: 1,
      height: '100%',

      fontSize: 15,

      color: colors.textPrimary,

      paddingVertical: 0,
    },

    eyeButton: {
      width: 40,
      height: 50,

      alignItems: 'center',
      justifyContent: 'center',
    },

    errorContainer: {
      flexDirection: 'row',
      alignItems: 'center',

      marginTop: 5,
      paddingHorizontal: 3,
    },

    errorText: {
      marginLeft: 5,

      fontSize: 12,

      color: colors.red,
    },
  });

export default createStyles;