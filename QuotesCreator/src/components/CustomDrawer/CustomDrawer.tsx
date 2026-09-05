import React, { useEffect, useRef } from 'react';

import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  useNavigationState,
  NavigationState,
  PartialState,
} from '@react-navigation/native';
import { moderateScale } from '@/styles/scaling';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

import { RootState } from '@/redux/store';
import Routes from '@/navigations/Routes';
import { navigate } from '@/utils/NavigationUtils';
import { useAuth } from '@/context/AuthContext';

import { CustomDrawerProps, MenuItemProps } from '@/types';

import { THEME_COLORS, ThemeColors } from '@/constants/Colors';
import { translations } from '@/language';

const { width, height } = Dimensions.get('window');

const DRAWER_WIDTH = width * 0.78;

// =====================================================
// ACTIVE ROUTE
// =====================================================

const getActiveRouteName = (
  state: NavigationState | PartialState<NavigationState>,
): string => {
  const route = state.routes[state.index ?? 0];

  if (route.state) {
    return getActiveRouteName(route.state);
  }

  return route.name;
};

// =====================================================
// DRAWER
// =====================================================

const CustomDrawer = ({ visible, onClose }: CustomDrawerProps) => {
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  // =====================================================
  // FIREBASE AUTH
  // =====================================================

  const { logout, user: firebaseUser } = useAuth();

  // =====================================================
  // AUTH REDUX USER
  // =====================================================

  const authUser = useSelector((state: RootState) => state.auth.user);

  // =====================================================
  // PROFILE REDUX USER
  // =====================================================

  /*
   * IMPORTANT:
   *
   * Profile API response is saved in:
   *
   * state.profile.user
   *
   * Your profileImage is coming from this object.
   */

  const profileUser = useSelector((state: RootState) => state.profile.user);

  // =====================================================
  // FAVOURITES
  // =====================================================

  const favourites = useSelector(
    (state: RootState) => state.favourites.favourites || [],
  );

  // =====================================================
  // LANGUAGE
  // =====================================================

  const language = useSelector((state: RootState) => state.language.language);

  const t = translations[language].DRAWER;

  // =====================================================
  // THEME
  // =====================================================

  const themeMode = useSelector((state: RootState) => state.theme.mode);

  const colors = THEME_COLORS[themeMode];

  const styles = createStyles(colors);

  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  const notifications = useSelector(
    (state: RootState) => state.notifications.notifications || [],
  );

  // =====================================================
  // COUNTS
  // =====================================================

  const favouriteCount = favourites.length;

  const unreadCount = notifications.filter(
    notification => !notification.isRead,
  ).length;

  // =====================================================
  // PROFILE IMAGE
  // =====================================================

  /*
   * PRIORITY:
   *
   * 1. Profile API -> profileUser.profileImage
   * 2. Auth API -> authUser.profileImage
   * 3. Firebase -> firebaseUser.photoURL
   */

  const profileImage =
    profileUser?.profileImage ||
    authUser?.profileImage ||
    firebaseUser?.photoURL ||
    null;

  // =====================================================
  // CURRENT USER
  // =====================================================

  const currentUser = {
    id: profileUser?._id || authUser?.id || firebaseUser?.uid || '',

    name:
      profileUser?.name ||
      authUser?.name ||
      firebaseUser?.displayName ||
      'User',

    email: profileUser?.email || authUser?.email || firebaseUser?.email || '',

    profileImage,
  };

  // =====================================================
  // DEBUG
  // =====================================================

  useEffect(() => {
    console.log('========================================');

    console.log('DRAWER AUTH USER:', authUser);

    console.log('DRAWER PROFILE USER:', profileUser);

    console.log('DRAWER FIREBASE USER:', firebaseUser);

    console.log('DRAWER PROFILE IMAGE:', profileImage);

    console.log('DRAWER CURRENT USER:', currentUser);

    console.log('========================================');
  }, [authUser, profileUser, firebaseUser, profileImage]);

  // =====================================================
  // ACTIVE ROUTE
  // =====================================================

  const currentRoute = useNavigationState(state => {
    return getActiveRouteName(state);
  });

  // =====================================================
  // DRAWER ANIMATION
  // =====================================================

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: visible ? 0 : -DRAWER_WIDTH,

      useNativeDriver: true,

      tension: 70,
      friction: 12,
    }).start();
  }, [visible, translateX]);

  // =====================================================
  // NAVIGATION
  // =====================================================

  const handleNavigation = (route: string) => {
    onClose();

    if (!route) {
      return;
    }

    setTimeout(() => {
      navigate(route);
    }, 150);
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = async () => {
    onClose();

    try {
      await logout();
    } catch (error) {
      console.log('❌ DRAWER LOGOUT ERROR:', error);
    }
  };

  // =====================================================
  // MENU ITEM
  // =====================================================

  const MenuItem = ({
    icon,
    title,
    route,
    activeRoute,
    badge,
  }: MenuItemProps) => {
    const active = currentRoute === route;

    const isActive =
      active || (activeRoute !== undefined && currentRoute === activeRoute);

    return (
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => handleNavigation(route)}
        style={[styles.menuItem, isActive && styles.activeMenuItem]}
      >
        {/* ICON */}

        <View style={[styles.iconBox, isActive && styles.activeIconBox]}>
          <Ionicons
            name={icon}
            size={20}
            color={isActive ? colors.accent : colors.textPrimary}
          />
        </View>

        {/* TITLE */}

        <Text style={[styles.menuText, isActive && styles.activeMenuText]}>
          {title}
        </Text>

        {/* BADGE / ARROW */}

        {typeof badge === 'number' && badge > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge > 99 ? '99+' : badge}</Text>
          </View>
        ) : (
          <Ionicons
            name="chevron-forward"
            size={16}
            color={colors.iconSecondary}
          />
        )}
      </TouchableOpacity>
    );
  };

  // =====================================================
  // HIDDEN
  // =====================================================

  if (!visible) {
    return null;
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <View style={styles.overlay}>
      {/* BACKDROP */}

      <Pressable style={styles.backdrop} onPress={onClose} />

      {/* DRAWER */}

      <Animated.View
        style={[
          styles.drawer,
          {
            transform: [
              {
                translateX,
              },
            ],
          },
        ]}
      >
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Ionicons name="sparkles" size={22} color={colors.white} />
          </View>

          <View style={styles.headerContent}>
            <Text style={styles.appName}>QuoteCreator</Text>

            <Text style={styles.appSubtitle}>{t.APP_SUBTITLE}</Text>
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={21} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* ================================================= */}
        {/* PROFILE */}
        {/* ================================================= */}

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.profileCard}
          onPress={() => handleNavigation(Routes.PROFILE)}
        >
          {/* PROFILE IMAGE */}

          {currentUser.profileImage ? (
            <Image
              source={{
                uri: currentUser.profileImage,
              }}
              style={styles.profileImage}
              resizeMode="cover"
              onLoad={() => {
                console.log(
                  '✅ DRAWER PROFILE IMAGE LOADED:',
                  currentUser.profileImage,
                );
              }}
              onError={error => {
                console.log(
                  '❌ DRAWER PROFILE IMAGE ERROR:',
                  error.nativeEvent.error,
                );
              }}
            />
          ) : (
            <View style={styles.profilePlaceholder}>
              <Text style={styles.profileLetter}>
                {currentUser.name?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            </View>
          )}

          {/* PROFILE INFO */}

          <View style={styles.profileContent}>
            <Text style={styles.profileName} numberOfLines={1}>
              {currentUser.name}
            </Text>

            <Text style={styles.profileEmail} numberOfLines={1}>
              {currentUser.email}
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={17}
            color={colors.iconSecondary}
          />
        </TouchableOpacity>

        {/* ================================================= */}
        {/* MAIN MENU */}
        {/* ================================================= */}

        <Text style={styles.sectionTitle}>{t.MAIN_MENU}</Text>

        {/* HOME */}

        <MenuItem
          icon={currentRoute === Routes.HOME ? 'home' : 'home-outline'}
          title={t.HOME}
          route={Routes.HOME}
        />

        {/* CATEGORIES */}

        <MenuItem
          icon={currentRoute === Routes.CATEGORIES ? 'grid' : 'grid-outline'}
          title={t.CATEGORIES}
          route={Routes.CATEGORIES}
        />

        {/* CREATE QUOTE */}

        <MenuItem
          icon={
            currentRoute === Routes.CREATE_QUOTES
              ? 'add-circle'
              : 'add-circle-outline'
          }
          title={t.CREATE_QUOTE}
          route={Routes.CREATE_QUOTES}
        />

        {/* FAVORITES */}

        <MenuItem
          icon={currentRoute === Routes.FAVORITES ? 'heart' : 'heart-outline'}
          title={t.FAVOURITES}
          route={Routes.FAVORITES}
          badge={favouriteCount}
        />

        {/* TEMPLATES */}

        <MenuItem
          icon={currentRoute === Routes.TEMPLATES ? 'copy' : 'copy-outline'}
          title={t.TEMPLATES}
          route={Routes.TEMPLATES}
        />

        {/* DOWNLOADS */}

        <MenuItem
          icon={
            currentRoute === Routes.DOWNLOADS ? 'download' : 'download-outline'
          }
          title={t.DOWNLOADS}
          route={Routes.DOWNLOADS}
        />

        {/* DIVIDER */}

        <View style={styles.divider} />

        {/* NOTIFICATIONS */}

        <MenuItem
          icon={
            currentRoute === Routes.NOTIFICATIONS
              ? 'notifications'
              : 'notifications-outline'
          }
          title={t.NOTIFICATIONS}
          route={Routes.NOTIFICATIONS}
          badge={unreadCount}
        />

        {/* PREFERENCES */}

        <Text style={styles.sectionTitle}>{t.PREFERENCES}</Text>

        {/* SETTINGS */}

        <MenuItem
          icon={
            currentRoute === Routes.SETTINGS ? 'settings' : 'settings-outline'
          }
          title={t.SETTINGS}
          route={Routes.SETTINGS}
        />

        {/* SPACER */}

        <View style={styles.spacer} />

        {/* LOGOUT */}

        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <View style={styles.logoutIconBox}>
            <Ionicons name="log-out-outline" size={20} color={colors.red} />
          </View>

          <Text style={styles.logoutText}>{t.LOGOUT}</Text>
        </TouchableOpacity>

        {/* VERSION */}

        <Text style={styles.version}>{t.VERSION}</Text>
      </Animated.View>
    </View>
  );
};

// =====================================================
// STYLES
// =====================================================

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
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

      backgroundColor: colors.background,

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
    // HEADER
    // ==========================================

    header: {
      flexDirection: 'row',
      alignItems: 'center',

      marginBottom: moderateScale(22),
    },

    logoBox: {
      width: moderateScale(42),
      height: moderateScale(42),

      borderRadius: moderateScale(13),

      backgroundColor: colors.accent,

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

      color: colors.textPrimary,
    },

    appSubtitle: {
      marginTop: moderateScale(2),

      fontSize: moderateScale(10),

      color: colors.textSecondary,
    },

    closeButton: {
      width: moderateScale(34),
      height: moderateScale(34),

      borderRadius: moderateScale(17),

      backgroundColor: colors.light_grey,

      alignItems: 'center',
      justifyContent: 'center',
    },

    // ==========================================
    // PROFILE
    // ==========================================

    profileCard: {
      flexDirection: 'row',
      alignItems: 'center',

      padding: moderateScale(11),

      borderRadius: moderateScale(16),

      backgroundColor: colors.light_grey,

      marginBottom: moderateScale(20),
    },

    profileImage: {
      width: moderateScale(46),
      height: moderateScale(46),

      borderRadius: moderateScale(23),

      backgroundColor: colors.light_grey,
    },

    profilePlaceholder: {
      width: moderateScale(46),
      height: moderateScale(46),

      borderRadius: moderateScale(23),

      backgroundColor: colors.light_grey,

      alignItems: 'center',
      justifyContent: 'center',
    },

    profileLetter: {
      fontSize: moderateScale(19),
      fontWeight: '800',

      color: colors.accent,
    },

    profileContent: {
      flex: 1,

      marginLeft: moderateScale(11),
      marginRight: moderateScale(8),
    },

    profileName: {
      fontSize: moderateScale(14),
      fontWeight: '700',

      color: colors.textPrimary,
    },

    profileEmail: {
      fontSize: moderateScale(10),

      color: colors.textSecondary,

      marginTop: moderateScale(3),
    },

    // ==========================================
    // SECTION TITLE
    // ==========================================

    sectionTitle: {
      fontSize: moderateScale(9),

      fontWeight: '800',

      color: colors.textSecondary,

      letterSpacing: 1,

      marginLeft: moderateScale(5),
      marginBottom: moderateScale(7),
      marginTop: moderateScale(2),

      textTransform: 'uppercase',
    },

    // ==========================================
    // MENU ITEM
    // ==========================================

    menuItem: {
      height: moderateScale(46),

      flexDirection: 'row',
      alignItems: 'center',

      paddingHorizontal: moderateScale(6),

      borderRadius: moderateScale(12),

      marginBottom: moderateScale(3),
    },

    activeMenuItem: {
      backgroundColor: colors.light_grey,
    },

    iconBox: {
      width: moderateScale(36),
      height: moderateScale(36),

      borderRadius: moderateScale(10),

      alignItems: 'center',
      justifyContent: 'center',
    },

    activeIconBox: {
      backgroundColor: colors.light_grey,
    },

    menuText: {
      flex: 1,

      marginLeft: moderateScale(10),

      fontSize: moderateScale(13),
      fontWeight: '600',

      color: colors.textPrimary,
    },

    activeMenuText: {
      color: colors.accent,

      fontWeight: '700',
    },

    // ==========================================
    // BADGE
    // ==========================================

    badge: {
      minWidth: moderateScale(22),
      height: moderateScale(22),

      paddingHorizontal: moderateScale(6),

      borderRadius: moderateScale(11),

      backgroundColor: colors.red,

      alignItems: 'center',
      justifyContent: 'center',
    },

    badgeText: {
      fontSize: moderateScale(9),

      fontWeight: '800',

      color: colors.white,
    },

    // ==========================================
    // DIVIDER
    // ==========================================

    divider: {
      height: 1,

      backgroundColor: colors.border,

      marginVertical: moderateScale(10),
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
      height: moderateScale(48),

      borderRadius: moderateScale(13),

      backgroundColor: colors.light_grey,

      flexDirection: 'row',
      alignItems: 'center',

      paddingHorizontal: moderateScale(9),

      marginBottom: moderateScale(10),
    },

    logoutIconBox: {
      width: moderateScale(36),
      height: moderateScale(36),

      borderRadius: moderateScale(10),

      backgroundColor: colors.light_grey,

      alignItems: 'center',
      justifyContent: 'center',
    },

    logoutText: {
      marginLeft: moderateScale(11),

      fontSize: moderateScale(14),
      fontWeight: '700',

      color: colors.red,
    },

    // ==========================================
    // VERSION
    // ==========================================

    version: {
      textAlign: 'center',

      fontSize: moderateScale(9),

      color: colors.textSecondary,

      marginBottom: moderateScale(12),
    },
  });

export default CustomDrawer;
