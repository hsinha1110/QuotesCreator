import { StyleSheet } from 'react-native';

import { moderateScale } from '@/styles/scaling';
import COLORS from '@/constants/Colors';

const styles = StyleSheet.create({
  // ==========================================
  // CONTAINER
  // ==========================================

  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  scrollContent: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: moderateScale(40),
  },

  // ==========================================
  // PROFILE
  // ==========================================

  profileSection: {
    alignItems: 'center',

    marginTop: moderateScale(10),
    marginBottom: moderateScale(24),
  },

  profileImageContainer: {
    width: moderateScale(120),
    height: moderateScale(120),

    borderRadius: moderateScale(60),

    borderWidth: moderateScale(3),
    borderColor: '#DDD4FF',

    alignItems: 'center',
    justifyContent: 'center',

    position: 'relative',
  },

  profileImage: {
    width: moderateScale(108),
    height: moderateScale(108),

    borderRadius: moderateScale(54),

    backgroundColor: '#F0EDFF',
  },

  cameraButton: {
    position: 'absolute',

    right: moderateScale(-4),
    bottom: moderateScale(2),

    width: moderateScale(38),
    height: moderateScale(38),

    borderRadius: moderateScale(19),

    backgroundColor: COLORS.accent,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: moderateScale(3),
    borderColor: COLORS.white,
  },

  changePictureText: {
    marginTop: moderateScale(12),

    fontSize: moderateScale(15),

    fontWeight: '600',

    color: COLORS.accent,
  },

  // ==========================================
  // LABEL
  // ==========================================

  label: {
    fontSize: moderateScale(13),

    fontWeight: '600',

    color: COLORS.black,

    marginBottom: moderateScale(7),

    marginTop: moderateScale(6),
  },

  // ==========================================
  // LANGUAGE
  // ==========================================

  languageContainer: {
    minHeight: moderateScale(54),

    borderWidth: 1,
    borderColor: '#E2E2E8',

    borderRadius: moderateScale(12),

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: moderateScale(14),

    backgroundColor: COLORS.white,
  },

  languageText: {
    flex: 1,

    marginLeft: moderateScale(12),

    fontSize: moderateScale(15),

    color: COLORS.black,

    fontWeight: '500',
  },

  languageDropdown: {
    marginTop: moderateScale(5),

    borderWidth: 1,
    borderColor: '#E2E2E8',

    borderRadius: moderateScale(12),

    backgroundColor: COLORS.white,

    overflow: 'hidden',

    elevation: moderateScale(3),
  },

  languageOption: {
    minHeight: moderateScale(48),

    paddingHorizontal: moderateScale(14),

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',
  },

  languageOptionText: {
    fontSize: moderateScale(14),

    color: COLORS.black,
  },

  // ==========================================
  // NOTIFICATION
  // ==========================================

  sectionTitle: {
    fontSize: moderateScale(16),

    fontWeight: '700',

    color: COLORS.accent,

    marginTop: moderateScale(24),

    marginBottom: moderateScale(10),
  },

  notificationCard: {
    borderWidth: 1,

    borderColor: '#E2E2E8',

    borderRadius: moderateScale(14),

    overflow: 'hidden',

    backgroundColor: COLORS.white,
  },

  settingRow: {
    minHeight: moderateScale(60),

    paddingHorizontal: moderateScale(14),

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',
  },

  settingLeft: {
    flexDirection: 'row',

    alignItems: 'center',

    flex: 1,
  },

  settingText: {
    marginLeft: moderateScale(13),

    fontSize: moderateScale(14),

    fontWeight: '500',

    color: COLORS.black,
  },

  divider: {
    height: 1,

    backgroundColor: '#EEEEEE',

    marginHorizontal: moderateScale(14),
  },

  timeRight: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: moderateScale(6),
  },

  timeText: {
    fontSize: moderateScale(13),

    color: '#666',

    fontWeight: '500',
  },

  // ==========================================
  // SAVE BUTTON
  // ==========================================

  saveButtonContainer: {
    marginTop: moderateScale(24),
  },

  // ==========================================
  // DELETE
  // ==========================================

  deleteButton: {
    minHeight: moderateScale(54),

    marginTop: moderateScale(14),

    borderWidth: 1,

    borderColor: '#FFE0E0',

    borderRadius: moderateScale(12),

    alignItems: 'center',

    justifyContent: 'center',

    backgroundColor: COLORS.white,
  },

  deleteText: {
    fontSize: moderateScale(15),

    fontWeight: '600',

    color: '#E53935',
  },
  defaultProfile: {
    width: '100%',
    height: '100%',
    borderRadius: moderateScale(60),

    backgroundColor: '#F1F1F1',

    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
