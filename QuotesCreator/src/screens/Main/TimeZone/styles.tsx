import COLORS from '@/constants/Colors';
import { StyleSheet } from 'react-native';
import { moderateScale } from '@/styles/scaling';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  content: {
    flex: 1,
    paddingHorizontal: moderateScale(18),
    paddingTop: moderateScale(18),
  },

  // =========================
  // SEARCH
  // =========================

  searchContainer: {
    height: moderateScale(48),
    borderRadius: moderateScale(12),
    backgroundColor: '#FAF8FD',
    borderWidth: 1,
    borderColor: '#EDE9F2',

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: moderateScale(14),
    marginBottom: moderateScale(20),
  },

  searchInput: {
    flex: 1,
    marginLeft: moderateScale(10),

    fontSize: moderateScale(13),
    color: COLORS.black,

    paddingVertical: 0,
  },

  // =========================
  // TITLE
  // =========================

  selectText: {
    fontSize: moderateScale(13),
    fontWeight: '700',
    color: COLORS.black,

    marginBottom: moderateScale(10),
  },

  // =========================
  // CARD
  // =========================

  card: {
    backgroundColor: COLORS.white,

    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderColor: '#EEEEF2',

    overflow: 'hidden',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,

    elevation: 2,

    maxHeight: moderateScale(500),
  },

  // =========================
  // TIMEZONE ROW
  // =========================

  timeZoneRow: {
    minHeight: moderateScale(58),

    paddingHorizontal: moderateScale(16),

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    backgroundColor: COLORS.white,

    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F4',
  },

  selectedTimeZoneRow: {
    backgroundColor: '#F8F3FF',
  },

  timeZoneText: {
    flex: 1,

    fontSize: moderateScale(13),
    fontWeight: '500',

    color: COLORS.black,
  },

  selectedTimeZoneText: {
    color: COLORS.accent,
    fontWeight: '600',
  },

  // =========================
  // RADIO BUTTON
  // =========================

  radioButton: {
    width: moderateScale(20),
    height: moderateScale(20),

    borderRadius: moderateScale(10),

    borderWidth: moderateScale(1.5),
    borderColor: '#C8C4CF',

    alignItems: 'center',
    justifyContent: 'center',

    marginLeft: moderateScale(10),
  },

  radioButtonSelected: {
    borderColor: COLORS.accent,
  },

  radioButtonInner: {
    width: moderateScale(10),
    height: moderateScale(10),

    borderRadius: moderateScale(5),

    backgroundColor: COLORS.accent,
  },

  // =========================
  // INFO
  // =========================

  infoContainer: {
    marginTop: moderateScale(16),

    minHeight: moderateScale(70),

    borderRadius: moderateScale(14),

    backgroundColor: '#F8F3FF',

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(12),
  },

  infoIcon: {
    width: moderateScale(32),
    height: moderateScale(32),

    borderRadius: moderateScale(16),

    backgroundColor: '#EEE3FF',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: moderateScale(10),
  },

  infoText: {
    flex: 1,

    fontSize: moderateScale(12),
    lineHeight: moderateScale(17),

    color: '#625B6D',
  },
});

export default styles;
