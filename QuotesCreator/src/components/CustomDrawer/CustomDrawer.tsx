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

import Ionicons from 'react-native-vector-icons/Ionicons';

import { useSelector } from 'react-redux';

import { RootState } from '@/redux/store';

import Routes from '@/navigations/Routes';
import { navigate } from '@/utils/NavigationUtils';

import { useAuth } from '@/context/AuthContext';

import { CustomDrawerProps, MenuItemProps } from '@/types';

import COLORS from '@/constants/Colors';

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
  // AUTH
  // =====================================================

  const { logout, user: firebaseUser } = useAuth();

  // =====================================================
  // REDUX USER
  // MongoDB user is stored here after social login
  // =====================================================

  const reduxUser = useSelector((state: RootState) => state.auth.user);

  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  const notifications = useSelector(
    (state: RootState) => state.notifications.notifications || [],
  );

  // =====================================================
  // CURRENT USER
  //
  // MongoDB/Redux user = PRIMARY
  // Firebase user = FALLBACK
  // =====================================================

  const currentUser = {
    id: reduxUser?.id || firebaseUser?.uid || '',

    name: reduxUser?.name || firebaseUser?.displayName || 'User',

    email: reduxUser?.email || firebaseUser?.email || '',

    profileImage: reduxUser?.profileImage || firebaseUser?.photoURL || null,
  };

  // =====================================================
  // ACTIVE ROUTE
  // =====================================================

  const currentRoute = useNavigationState(state => {
    return getActiveRouteName(state);
  });

  // =====================================================
  // DEBUG
  // =====================================================

  console.log('================================');
  console.log('🔥 DRAWER CURRENT USER');
  console.log('================================');

  console.log('Redux User:', reduxUser);

  console.log('Firebase User:', {
    uid: firebaseUser?.uid,
    email: firebaseUser?.email,
    name: firebaseUser?.displayName,
    photoURL: firebaseUser?.photoURL,
  });

  console.log('Final Current User:', currentUser);

  console.log('Current Route:', currentRoute);

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
      console.log('🔥 DRAWER LOGOUT STARTED');

      await logout();

      console.log('✅ DRAWER LOGOUT SUCCESS');
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
            color={isActive ? COLORS.accent : COLORS.black}
          />
        </View>

        {/* TITLE */}

        <Text style={[styles.menuText, isActive && styles.activeMenuText]}>
          {title}
        </Text>

        {/* BADGE */}

        {badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge > 99 ? '99+' : badge}</Text>
          </View>
        ) : (
          <Ionicons name="chevron-forward" size={16} color={COLORS.white} />
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
            <Ionicons name="sparkles" size={22} color={COLORS.white} />
          </View>

          <View style={styles.headerContent}>
            <Text style={styles.appName}>QuoteCreator</Text>

            <Text style={styles.appSubtitle}>Create. Inspire. Share.</Text>
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={21} color={COLORS.black} />
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
            />
          ) : (
            <View style={styles.profilePlaceholder}>
              <Text style={styles.profileLetter}>
                {currentUser.name?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            </View>
          )}

          {/* PROFILE DATA */}

          <View style={styles.profileContent}>
            <Text style={styles.profileName} numberOfLines={1}>
              {currentUser.name}
            </Text>

            <Text style={styles.profileEmail} numberOfLines={1}>
              {currentUser.email}
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={17} color="#9D98A6" />
        </TouchableOpacity>

        {/* ================================================= */}
        {/* MAIN MENU */}
        {/* ================================================= */}

        <Text style={styles.sectionTitle}>MAIN MENU</Text>

        {/* HOME */}

        <MenuItem
          icon={currentRoute === Routes.HOME ? 'home' : 'home-outline'}
          title="Home"
          route={Routes.HOME}
        />

        {/* CATEGORIES */}

        <MenuItem
          icon={currentRoute === Routes.CATEGORIES ? 'grid' : 'grid-outline'}
          title="Categories"
          route={Routes.CATEGORIES}
        />

        {/* CREATE QUOTE */}

        <MenuItem
          icon={
            currentRoute === Routes.CREATE_QUOTES
              ? 'add-circle'
              : 'add-circle-outline'
          }
          title="Create Quote"
          route={Routes.CREATE_QUOTES}
        />

        {/* FAVORITES */}

        <MenuItem
          icon={currentRoute === Routes.FAVORITES ? 'heart' : 'heart-outline'}
          title="Favourites"
          route={Routes.FAVORITES}
        />

        {/* TEMPLATES */}

        <MenuItem
          icon={currentRoute === Routes.TEMPLATES ? 'copy' : 'copy-outline'}
          title="Templates"
          route={Routes.TEMPLATES}
        />

        {/* DOWNLOADS */}

        <MenuItem
          icon={
            currentRoute === Routes.DOWNLOADS ? 'download' : 'download-outline'
          }
          title="Downloads"
          route={Routes.DOWNLOADS}
        />

        {/* ================================================= */}
        {/* DIVIDER */}
        {/* ================================================= */}

        <View style={styles.divider} />

        {/* ================================================= */}
        {/* NOTIFICATIONS */}
        {/* ================================================= */}

        <MenuItem
          icon={
            currentRoute === Routes.NOTIFICATIONS
              ? 'notifications'
              : 'notifications-outline'
          }
          title="Notifications"
          route={Routes.NOTIFICATIONS}
          badge={notifications.length}
        />

        {/* ================================================= */}
        {/* PREFERENCES */}
        {/* ================================================= */}

        <Text style={styles.sectionTitle}>PREFERENCES</Text>

        {/* LANGUAGE */}

        <MenuItem
          icon="language-outline"
          title="Language"
          route=""
          activeRoute=""
        />

        {/* THEME */}

        <MenuItem icon="moon-outline" title="Theme" route="" activeRoute="" />

        {/* SETTINGS */}

        <MenuItem
          icon={
            currentRoute === Routes.SETTINGS ? 'settings' : 'settings-outline'
          }
          title="Settings"
          route={Routes.SETTINGS}
        />

        {/* ================================================= */}
        {/* SPACER */}
        {/* ================================================= */}

        <View style={styles.spacer} />

        {/* ================================================= */}
        {/* LOGOUT */}
        {/* ================================================= */}

        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <View style={styles.logoutIconBox}>
            <Ionicons name="log-out-outline" size={20} color="#E53935" />
          </View>

          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* ================================================= */}
        {/* VERSION */}
        {/* ================================================= */}

        <Text style={styles.version}>QuoteCreator • v1.0.0</Text>
      </Animated.View>
    </View>
  );
};

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
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

  drawer: {
    width: DRAWER_WIDTH,
    height,

    backgroundColor: '#FFFFFF',

    paddingTop: 48,
    paddingHorizontal: 18,

    shadowColor: '#000',

    shadowOffset: {
      width: 5,
      height: 0,
    },

    shadowOpacity: 0.2,
    shadowRadius: 12,

    elevation: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: 22,
  },

  logoBox: {
    width: 42,
    height: 42,

    borderRadius: 13,

    backgroundColor: '#6C2BD9',

    alignItems: 'center',
    justifyContent: 'center',
  },

  headerContent: {
    flex: 1,

    marginLeft: 11,
  },

  appName: {
    fontSize: 17,
    fontWeight: '800',

    color: '#17141D',
  },

  appSubtitle: {
    marginTop: 2,

    fontSize: 10,

    color: '#8D8796',
  },

  closeButton: {
    width: 34,
    height: 34,

    borderRadius: 17,

    backgroundColor: '#F5F2FA',

    alignItems: 'center',
    justifyContent: 'center',
  },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',

    padding: 11,

    borderRadius: 16,

    backgroundColor: '#F7F3FC',

    marginBottom: 20,
  },

  profileImage: {
    width: 46,
    height: 46,

    borderRadius: 23,
  },

  profilePlaceholder: {
    width: 46,
    height: 46,

    borderRadius: 23,

    backgroundColor: '#E7D8FA',

    alignItems: 'center',
    justifyContent: 'center',
  },

  profileLetter: {
    fontSize: 19,
    fontWeight: '800',

    color: '#6C2BD9',
  },

  profileContent: {
    flex: 1,

    marginLeft: 11,
    marginRight: 8,
  },

  profileName: {
    fontSize: 14,
    fontWeight: '700',

    color: '#1C1922',
  },

  profileEmail: {
    fontSize: 10,

    color: '#898391',

    marginTop: 3,
  },

  sectionTitle: {
    fontSize: 9,

    fontWeight: '800',

    color: '#A19BAA',

    letterSpacing: 1,

    marginLeft: 5,
    marginBottom: 7,
    marginTop: 2,
  },

  menuItem: {
    height: 46,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 6,

    borderRadius: 12,

    marginBottom: 3,
  },

  activeMenuItem: {
    backgroundColor: '#F1E9FC',
  },

  iconBox: {
    width: 36,
    height: 36,

    borderRadius: 10,

    alignItems: 'center',
    justifyContent: 'center',
  },

  activeIconBox: {
    backgroundColor: '#E9D9FA',
  },

  menuText: {
    flex: 1,

    marginLeft: 10,

    fontSize: 13,

    fontWeight: '600',

    color: '#302C37',
  },

  activeMenuText: {
    color: '#6C2BD9',

    fontWeight: '700',
  },

  badge: {
    minWidth: 22,
    height: 22,

    paddingHorizontal: 6,

    borderRadius: 11,

    backgroundColor: COLORS.red,

    alignItems: 'center',
    justifyContent: 'center',
  },

  badgeText: {
    fontSize: 9,

    fontWeight: '800',

    color: '#FFFFFF',
  },

  divider: {
    height: 1,

    backgroundColor: '#ECE9F0',

    marginVertical: 10,
  },

  spacer: {
    flex: 1,
  },

  logoutButton: {
    height: 48,

    borderRadius: 13,

    backgroundColor: '#FFF1F1',

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 9,

    marginBottom: 10,
  },

  logoutIconBox: {
    width: 36,
    height: 36,

    borderRadius: 10,

    backgroundColor: '#FFE1E1',

    alignItems: 'center',
    justifyContent: 'center',
  },

  logoutText: {
    marginLeft: 11,

    fontSize: 14,

    fontWeight: '700',

    color: '#E53935',
  },

  version: {
    textAlign: 'center',

    fontSize: 9,

    color: '#AAA5B0',

    marginBottom: 12,
  },
});

export default CustomDrawer;
