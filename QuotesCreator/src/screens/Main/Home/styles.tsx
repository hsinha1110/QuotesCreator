import {StyleSheet} from 'react-native';
import {moderateScale} from '@/styles/scaling';
import {ThemeColors} from '@/constants/Colors';

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    // =====================================================
    // CONTAINER
    // =====================================================

    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    content: {
      paddingHorizontal: moderateScale(20),
      paddingTop: moderateScale(20),
      paddingBottom: moderateScale(30),
    },

    scrollContent: {
      paddingHorizontal: moderateScale(20),
      paddingTop: moderateScale(20),
      paddingBottom: moderateScale(30),
    },

    // =====================================================
    // HEADER / GREETING
    // =====================================================

    title: {
      fontSize: moderateScale(22),
      lineHeight: moderateScale(28),
      fontWeight: '700',
      color: colors.textPrimary,
    },

    subtitle: {
      marginTop: moderateScale(5),
      fontSize: moderateScale(13),
      lineHeight: moderateScale(19),
      color: colors.primary,
    },

    // =====================================================
    // NOTIFICATION / DAILY QUOTE SECTION
    // =====================================================

    notificationLabel: {
      marginTop: moderateScale(24),
      marginBottom: moderateScale(10),
      fontSize: moderateScale(12),
      lineHeight: moderateScale(16),
      fontWeight: '700',
      letterSpacing: 0.3,
      color: colors.accent,
    },

    notificationCard: {
      width: '100%',
      paddingHorizontal: moderateScale(18),
      paddingTop: moderateScale(14),
      paddingBottom: moderateScale(14),
      borderRadius: moderateScale(20),

      backgroundColor: colors.card,

      position: 'relative',

      elevation: moderateScale(3),

      shadowColor: colors.black,

      shadowOffset: {
        width: 0,
        height: moderateScale(2),
      },

      shadowOpacity: 0.08,
      shadowRadius: moderateScale(6),

      borderWidth: moderateScale(1),
      borderColor: colors.border,
    },

    quoteIcon: {
      position: 'absolute',
      top: moderateScale(7),
      left: moderateScale(10),
      width: moderateScale(28),
      height: moderateScale(28),
    },

    quoteContent: {
      paddingTop: moderateScale(12),
      alignItems: 'center',
    },

    notificationTitle: {
      fontSize: moderateScale(17),
      lineHeight: moderateScale(23),
      fontWeight: '700',
      color: colors.textPrimary,
      textAlign: 'center',
    },

    notificationBody: {
      marginTop: moderateScale(5),
      fontSize: moderateScale(14),
      lineHeight: moderateScale(21),
      fontWeight: '400',
      color: colors.textPrimary,
      textAlign: 'center',
    },

    dailyQuoteBottom: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: moderateScale(14),
    },

    dailyQuoteDate: {
      flex: 1,
      fontSize: moderateScale(10),
      lineHeight: moderateScale(14),
      color: colors.textSecondary,
    },

    dailyBottomRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: moderateScale(14),
    },

    dailyDate: {
      flex: 1,
      fontSize: moderateScale(10),
      lineHeight: moderateScale(14),
      color: colors.textSecondary,
      fontWeight: 'bold',
    },

    // =====================================================
    // ACTIONS
    // =====================================================

    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: moderateScale(10),
    },

    actionButton: {
      width: moderateScale(32),
      height: moderateScale(32),
      alignItems: 'center',
      justifyContent: 'center',
    },

    latestActions: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: moderateScale(8),
    },

    latestActionButton: {
      width: moderateScale(30),
      height: moderateScale(30),
      alignItems: 'center',
      justifyContent: 'center',
    },

    // =====================================================
    // SECTION HEADER
    // =====================================================

    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: moderateScale(24),
      marginBottom: moderateScale(12),
    },

    sectionTitle: {
      fontSize: moderateScale(14),
      lineHeight: moderateScale(20),
      fontWeight: '700',
      color: colors.textPrimary,
    },

    viewAll: {
      fontSize: moderateScale(12),
      lineHeight: moderateScale(18),
      fontWeight: '600',
      color: colors.accent,
    },

    // =====================================================
    // CATEGORY
    // =====================================================

    categoryList: {
      paddingHorizontal: moderateScale(2),
      paddingBottom: moderateScale(8),
    },

    categorySeparator: {
      width: moderateScale(12),
    },

    // =====================================================
    // LATEST
    // =====================================================

    latestList: {
      paddingBottom: moderateScale(5),
    },

    latestSeparator: {
      width: moderateScale(12),
      paddingHorizontal: moderateScale(10),
    },

    latestCard: {
      width: moderateScale(210),
      height: moderateScale(155),

      padding: moderateScale(15),

      borderRadius: moderateScale(18),

      backgroundColor: colors.card,

      elevation: moderateScale(3),

      shadowColor: colors.black,

      shadowOffset: {
        width: 0,
        height: moderateScale(2),
      },

      shadowOpacity: 0.08,
      shadowRadius: moderateScale(5),

      borderWidth: moderateScale(1),
      borderColor: colors.border,
    },

    latestQuoteIcon: {
      width: moderateScale(28),
      height: moderateScale(28),
    },

    latestQuoteText: {
      marginTop: moderateScale(7),

      fontSize: moderateScale(13),
      lineHeight: moderateScale(19),

      color: colors.textPrimary,
    },

    latestBottom: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',

      marginTop: 'auto',

      paddingTop: moderateScale(10),
    },

    latestAuthor: {
      flex: 1,

      marginRight: moderateScale(8),

      fontSize: moderateScale(10),
      lineHeight: moderateScale(14),

      color: colors.textSecondary,
    },

    latestFavoriteButton: {
      width: moderateScale(30),
      height: moderateScale(30),

      alignItems: 'center',
      justifyContent: 'center',
    },

    // =====================================================
    // EMPTY STATE
    // =====================================================

    emptyContainer: {
      width: moderateScale(250),
      height: moderateScale(100),

      alignItems: 'center',
      justifyContent: 'center',
    },

    emptyText: {
      fontSize: moderateScale(12),
      color: colors.textSecondary,
    },

    // =====================================================
    // POPULAR
    // =====================================================

    popularList: {
      paddingBottom: moderateScale(5),
    },

    popularSeparator: {
      width: moderateScale(12),
    },

    popularCard: {
      width: moderateScale(210),
      height: moderateScale(155),

      padding: moderateScale(15),

      borderRadius: moderateScale(18),

      backgroundColor: colors.card,

      elevation: moderateScale(3),

      shadowColor: colors.black,

      shadowOffset: {
        width: 0,
        height: moderateScale(2),
      },

      shadowOpacity: 0.08,
      shadowRadius: moderateScale(5),

      borderWidth: moderateScale(1),
      borderColor: colors.border,
    },

    popularQuoteIcon: {
      width: moderateScale(28),
      height: moderateScale(28),
    },

    popularQuoteText: {
      marginTop: moderateScale(7),

      fontSize: moderateScale(13),
      lineHeight: moderateScale(19),

      color: colors.textPrimary,

      fontWeight: '600',
    },

    popularBottom: {
      flexDirection: 'row',

      alignItems: 'center',
      justifyContent: 'space-between',

      marginTop: 'auto',

      paddingTop: moderateScale(10),
    },

    popularAuthor: {
      flex: 1,

      marginRight: moderateScale(8),

      fontSize: moderateScale(10),
      lineHeight: moderateScale(14),

      color: colors.textSecondary,
    },

    popularLikesContainer: {
      flexDirection: 'row',

      alignItems: 'center',

      marginRight: moderateScale(5),
    },

    popularLikes: {
      marginLeft: moderateScale(3),

      fontSize: moderateScale(10),
      lineHeight: moderateScale(14),

      color: colors.textPrimary,

      fontWeight: '600',
    },
  });

export default createStyles;