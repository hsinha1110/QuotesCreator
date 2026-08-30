import { StyleSheet, Dimensions } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

const { width, height } = Dimensions.get('window');

const DRAWER_WIDTH = width * 0.78;

const styles = StyleSheet.create({
  // ==========================================
  // OVERLAY
  // ==========================================

  overlay: {
    position: 'absolute',

    top: 0,
    right: 0,
    bottom: 0,
    left: 0,

    zIndex: 9999,
    elevation: 9999,
  },

  backdrop: {
    position: 'absolute',

    top: 0,
    right: 0,
    bottom: 0,
    left: 0,

    backgroundColor: 'rgba(0,0,0,0.42)',
  },

  // ==========================================
  // DRAWER
  // ==========================================

  drawer: {
    width: DRAWER_WIDTH,
    height,

    backgroundColor: '#FFFFFF',

    paddingTop: moderateScale(48),
    paddingHorizontal: moderateScale(18),

    shadowColor: '#000',

    shadowOffset: {
      width: moderateScale(5),
      height: 0,
    },

    shadowOpacity: 0.2,
    shadowRadius: moderateScale(12),

    elevation: 20,
  },

  // ==========================================
  // MAIN CONTAINER
  // ==========================================

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: moderateScale(18),
    paddingTop: moderateScale(45),
    paddingBottom: moderateScale(15),
  },

  // ==========================================
  // HEADER
  // ==========================================

  header: {
    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: moderateScale(22),
  },

  // Old naming
  logoBox: {
    width: moderateScale(42),
    height: moderateScale(42),

    borderRadius: moderateScale(13),

    backgroundColor: '#6C2BD9',

    alignItems: 'center',
    justifyContent: 'center',
  },

  headerContent: {
    flex: 1,

    marginLeft: moderateScale(11),
  },

  appName: {
    fontSize: moderateScale(17),
    fontWeight: '800',

    color: '#17141D',
  },

  appSubtitle: {
    marginTop: moderateScale(2),

    fontSize: moderateScale(10),

    color: '#8D8796',
  },

  // New naming also kept
  logoContainer: {
    width: moderateScale(48),
    height: moderateScale(48),

    borderRadius: moderateScale(14),

    backgroundColor: '#6C2BD9',

    justifyContent: 'center',
    alignItems: 'center',
  },

  logoTextContainer: {
    flex: 1,

    marginLeft: moderateScale(12),
  },

  logoTitle: {
    fontSize: moderateScale(18),
    fontWeight: '800',

    color: '#222222',
  },

  logoSubtitle: {
    marginTop: moderateScale(2),

    fontSize: moderateScale(11),

    color: '#8A8A8A',
  },

  closeButton: {
    width: moderateScale(38),
    height: moderateScale(38),

    borderRadius: moderateScale(19),

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#F5F5F5',
  },

  // ==========================================
  // USER / PROFILE CARD
  // ==========================================

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',

    padding: moderateScale(11),

    borderRadius: moderateScale(16),

    backgroundColor: '#F7F3FC',

    marginBottom: moderateScale(20),
  },

  profileImage: {
    width: moderateScale(46),
    height: moderateScale(46),

    borderRadius: moderateScale(23),
  },

  profilePlaceholder: {
    width: moderateScale(46),
    height: moderateScale(46),

    borderRadius: moderateScale(23),

    backgroundColor: '#E7D8FA',

    alignItems: 'center',
    justifyContent: 'center',
  },

  profileLetter: {
    fontSize: moderateScale(19),
    fontWeight: '800',

    color: '#6C2BD9',
  },

  profileContent: {
    flex: 1,

    marginLeft: moderateScale(11),
    marginRight: moderateScale(8),
  },

  profileName: {
    fontSize: moderateScale(14),
    fontWeight: '700',

    color: '#1C1922',
  },

  profileEmail: {
    fontSize: moderateScale(10),

    color: '#898391',

    marginTop: moderateScale(3),
  },

  // New naming
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(12),

    borderRadius: moderateScale(16),

    backgroundColor: '#F8F6FC',

    marginBottom: moderateScale(20),
  },

  avatar: {
    width: moderateScale(46),
    height: moderateScale(46),

    borderRadius: moderateScale(23),

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#E9DDFB',
  },

  avatarText: {
    fontSize: moderateScale(18),
    fontWeight: '800',

    color: '#6C2BD9',
  },

  userInfo: {
    flex: 1,

    marginLeft: moderateScale(12),
  },

  userName: {
    fontSize: moderateScale(15),
    fontWeight: '700',

    color: '#222222',
  },

  userEmail: {
    marginTop: moderateScale(3),

    fontSize: moderateScale(11),

    color: '#8A8A8A',
  },

  // ==========================================
  // SECTION TITLE
  // ==========================================

  sectionTitle: {
    fontSize: moderateScale(11),

    fontWeight: '800',

    letterSpacing: moderateScale(0.8),

    color: '#A0A0A0',

    marginTop: moderateScale(4),
    marginBottom: moderateScale(8),

    textTransform: 'uppercase',
  },

  // ==========================================
  // MENU ITEM
  // ==========================================

  menuItem: {
    minHeight: moderateScale(30),

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(8),

    borderRadius: moderateScale(12),

    marginBottom: moderateScale(3),
  },

  activeMenuItem: {
    backgroundColor: '#F1E9FC',
  },

  iconBox: {
    width: moderateScale(36),
    height: moderateScale(36),

    borderRadius: moderateScale(10),

    alignItems: 'center',
    justifyContent: 'center',
  },

  activeIconBox: {
    backgroundColor: '#E9D9FA',
  },

  menuText: {
    flex: 1,

    marginLeft: moderateScale(14),

    fontSize: moderateScale(14),

    fontWeight: '600',

    color: '#30303A',
  },

  activeMenuText: {
    color: '#6C2BD9',

    fontWeight: '700',
  },

  // ==========================================
  // BADGE
  // ==========================================

  badge: {
    minWidth: moderateScale(24),
    height: moderateScale(24),

    paddingHorizontal: moderateScale(6),

    borderRadius: moderateScale(12),

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#6C2BD9',
  },

  badgeText: {
    fontSize: moderateScale(10),

    fontWeight: '800',

    color: '#FFFFFF',
  },

  // ==========================================
  // DIVIDER
  // ==========================================

  divider: {
    height: 1,

    backgroundColor: '#EEEEEE',

    marginVertical: moderateScale(12),
  },

  // ==========================================
  // SPACER
  // ==========================================

  spacer: {
    flex: 1,
  },

  // ==========================================
  // LOGOUT
  // ==========================================

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',

    minHeight: moderateScale(50),

    paddingHorizontal: moderateScale(10),

    borderRadius: moderateScale(14),

    backgroundColor: '#FFF5F5',
  },

  logoutIconBox: {
    width: moderateScale(38),
    height: moderateScale(38),

    borderRadius: moderateScale(12),

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#FFE7E7',
  },

  logoutText: {
    marginLeft: moderateScale(12),

    fontSize: moderateScale(14),

    fontWeight: '700',

    color: '#EF4444',
  },

  // New naming
  logoutContainer: {
    marginTop: 'auto',
  },

  logoutIconContainer: {
    width: moderateScale(38),
    height: moderateScale(38),

    borderRadius: moderateScale(12),

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#FFE7E7',
  },

  // ==========================================
  // VERSION
  // ==========================================

  version: {
    textAlign: 'center',

    marginTop: moderateScale(12),

    marginBottom: moderateScale(12),

    fontSize: moderateScale(10),

    color: '#AAAAAA',
  },
});

export default styles;
