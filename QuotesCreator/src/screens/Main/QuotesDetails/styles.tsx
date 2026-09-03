import { StyleSheet, Dimensions } from 'react-native';

import { moderateScale } from '@/styles/scaling';
import COLORS from '@/constants/Colors';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  page: {
    width,
    flex: 1,

    justifyContent: 'center',

    paddingHorizontal: moderateScale(16),
    paddingBottom: moderateScale(40),
  },

  // ==========================================
  // CARD
  // ==========================================

  quoteCard: {
    width: '100%',
    minHeight: moderateScale(200),
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(24),

    borderRadius: moderateScale(20),

    backgroundColor: COLORS.white,

    elevation: moderateScale(3),

    shadowColor: COLORS.black,

    shadowOffset: {
      width: 0,
      height: moderateScale(2),
    },

    shadowOpacity: 0.08,
    shadowRadius: moderateScale(5),
  },

  // ==========================================
  // IMAGE
  // ==========================================

  quoteImage: {
    width: moderateScale(48),
    height: moderateScale(48),

    bottom: moderateScale(26),
    right: moderateScale(10),
  },

  // ==========================================
  // TEXT
  // ==========================================
  quoteText: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(24),
    fontWeight: '600',
    color: COLORS.black,
    textAlign: 'center',

    minHeight: moderateScale(72),
  },

  // ==========================================
  // AUTHOR
  // ==========================================

  author: {
    marginTop: moderateScale(16),

    fontSize: moderateScale(14),

    lineHeight: moderateScale(20),

    fontWeight: '500',

    color: COLORS.black,

    textAlign: 'center',
  },

  // ==========================================
  // INFO
  // ==========================================

  infoRow: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    marginTop: moderateScale(22),

    paddingTop: moderateScale(14),

    borderTopWidth: 1,

    borderTopColor: '#DDDDDD',
  },

  language: {
    fontSize: moderateScale(12),

    color: '#777777',
  },

  views: {
    fontSize: moderateScale(12),

    color: COLORS.black,
  },

  // ==========================================
  // ACTIONS
  // ==========================================

  actions: {
    marginTop: moderateScale(16),

    alignItems: 'flex-end',
  },

  // ==========================================
  // COUNTER
  // ==========================================

  counterContainer: {
    position: 'absolute',

    bottom: moderateScale(20),

    alignSelf: 'center',

    paddingHorizontal: moderateScale(14),

    paddingVertical: moderateScale(6),

    borderRadius: moderateScale(20),

    backgroundColor: COLORS.light_grey,
  },

  counter: {
    fontSize: moderateScale(12),

    fontWeight: '600',

    color: COLORS.black,
  },
});

export default styles;
