import { StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import COLORS from '@/constants/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  scrollContent: {
    paddingBottom: moderateScale(30),
  },

  // ==========================================
  // PROFILE HEADER
  // ==========================================

  profileHeader: {
    marginHorizontal: moderateScale(16),
    marginTop: moderateScale(8),
    paddingVertical: moderateScale(26),
    borderRadius: moderateScale(20),
    backgroundColor: COLORS.accent,
    alignItems: 'center',

    elevation: moderateScale(4),

    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: moderateScale(3),
    },
    shadowOpacity: 0.12,
    shadowRadius: moderateScale(6),
  },

  profileImageWrapper: {
    width: moderateScale(88),
    height: moderateScale(88),
    borderRadius: moderateScale(44),
    backgroundColor: COLORS.white,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: moderateScale(3),
    borderColor: '#E7DEFF',

    overflow: 'hidden',
  },

  defaultProfile: {
    width: '100%',
    height: '100%',
    borderRadius: moderateScale(44),

    backgroundColor: '#F1F1F1',

    alignItems: 'center',
    justifyContent: 'center',
  },

  profileName: {
    marginTop: moderateScale(12),
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: COLORS.white,
  },

  profileEmail: {
    marginTop: moderateScale(4),
    fontSize: moderateScale(11),
    color: '#EDE8FF',
  },

  // ==========================================
  // SECTION
  // ==========================================

  sectionTitle: {
    marginHorizontal: moderateScale(16),
    marginTop: moderateScale(24),
    marginBottom: moderateScale(10),

    fontSize: moderateScale(15),
    fontWeight: '700',
    color: COLORS.accent,
  },

  // ==========================================
  // CARD
  // ==========================================

  card: {
    marginHorizontal: moderateScale(16),

    borderRadius: moderateScale(16),

    backgroundColor: COLORS.white,

    borderWidth: 1,
    borderColor: '#EEEEF4',

    overflow: 'hidden',

    elevation: moderateScale(2),

    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: moderateScale(2),
    },
    shadowOpacity: 0.06,
    shadowRadius: moderateScale(4),
  },

  // ==========================================
  // PROFILE ROW
  // ==========================================

  profileRow: {
    minHeight: moderateScale(62),

    paddingHorizontal: moderateScale(14),

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  rowIconContainer: {
    width: moderateScale(38),
    height: moderateScale(38),

    borderRadius: moderateScale(19),

    backgroundColor: '#F5F2FF',

    alignItems: 'center',
    justifyContent: 'center',
  },

  rowTitle: {
    marginLeft: moderateScale(12),

    fontSize: moderateScale(14),
    fontWeight: '500',

    color: COLORS.black,
  },

  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginLeft: moderateScale(64),
  },

  // ==========================================
  // DANGER
  // ==========================================

  dangerIconContainer: {
    backgroundColor: '#FFF1F1',
  },

  dangerText: {
    color: '#E53935',
  },

  // ==========================================
  // LOGOUT
  // ==========================================

  logoutButton: {
    marginHorizontal: moderateScale(16),
    marginTop: moderateScale(24),

    height: moderateScale(54),

    borderRadius: moderateScale(14),

    borderWidth: 1,
    borderColor: '#FFE0E0',

    backgroundColor: COLORS.white,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: moderateScale(8),
  },

  logoutText: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: '#E53935',
  },

  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: moderateScale(44),
  },
});

export default styles;
