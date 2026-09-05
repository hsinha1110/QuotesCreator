import { StyleSheet } from 'react-native';

import { moderateScale } from '@/styles/scaling';

const styles = StyleSheet.create({
  // =========================
  // CONTAINER
  // =========================

  container: {
    flex: 1,
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

    borderWidth: 1,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: moderateScale(14),

    marginBottom: moderateScale(20),
  },

  searchInput: {
    flex: 1,

    marginLeft: moderateScale(10),

    fontSize: moderateScale(13),

    paddingVertical: 0,
  },

  // =========================
  // TITLE
  // =========================

  selectText: {
    fontSize: moderateScale(13),

    fontWeight: '700',

    marginBottom: moderateScale(10),
  },

  // =========================
  // CARD
  // =========================

  card: {
    borderRadius: moderateScale(16),

    borderWidth: 1,

    overflow: 'hidden',

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

    borderBottomWidth: 1,
  },

  // =========================
  // TIMEZONE TEXT
  // =========================

  timeZoneText: {
    flex: 1,

    fontSize: moderateScale(13),

    fontWeight: '500',
  },

  // =========================
  // RADIO BUTTON
  // =========================

  radioButton: {
    width: moderateScale(20),

    height: moderateScale(20),

    borderRadius: moderateScale(10),

    borderWidth: moderateScale(1.5),

    alignItems: 'center',

    justifyContent: 'center',

    marginLeft: moderateScale(10),
  },

  radioButtonInner: {
    width: moderateScale(10),

    height: moderateScale(10),

    borderRadius: moderateScale(5),
  },

  // =========================
  // INFO
  // =========================

  infoContainer: {
    marginTop: moderateScale(16),

    minHeight: moderateScale(70),

    borderRadius: moderateScale(14),

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: moderateScale(14),

    paddingVertical: moderateScale(12),
  },

  infoIcon: {
    width: moderateScale(32),

    height: moderateScale(32),

    borderRadius: moderateScale(16),

    alignItems: 'center',

    justifyContent: 'center',

    marginRight: moderateScale(10),
  },

  infoText: {
    flex: 1,

    fontSize: moderateScale(12),

    lineHeight: moderateScale(17),
  },
});

export default styles;
