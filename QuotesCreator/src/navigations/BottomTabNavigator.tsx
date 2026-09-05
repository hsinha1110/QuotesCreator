import React from 'react';

import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';

import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  View,
  TouchableOpacity,
  Text,
} from 'react-native';

import {useSelector} from 'react-redux';

import * as Screens from '@/screens/index';

import {RootState} from '@/redux/store';

import {translations} from '@/language';

import {THEME_COLORS} from '@/constants/Colors';

import createStyles from './styles';

const Tab = createBottomTabNavigator();

const CustomTabBar = ({
  state,
  navigation,
}: BottomTabBarProps) => {
  // =====================================================
  // LANGUAGE
  // =====================================================

  const language = useSelector(
    (state: RootState) => state.language.language,
  );

  const t = translations[language].BOTTOM_TAB;

  // =====================================================
  // THEME
  // =====================================================

  const themeMode = useSelector(
    (state: RootState) => state.theme.mode,
  );

  const colors = THEME_COLORS[themeMode];

  const styles = createStyles(colors);

  // =====================================================
  // GET TAB LABEL
  // =====================================================

  const getTabLabel = (routeName: string) => {
    switch (routeName) {
      case 'Home':
        return t.HOME;

      case 'Explore':
        return t.EXPLORE;

      case 'Favorites':
        return t.FAVORITES;

      case 'Profile':
        return t.PROFILE;

      default:
        return routeName;
    }
  };

  // =====================================================
  // TAB BAR
  // =====================================================

  return (
    <View style={styles.wrapper}>
      <View style={styles.tabBar}>
        {state.routes.map(route => {
          const isFocused =
            state.index ===
            state.routes.indexOf(route);

          // =================================================
          // CENTER ADD BUTTON
          // =================================================

          if (route.name === 'CreateQuote') {
            return (
              <View
                style={styles.centerButtonContainer}
                key={route.key}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.addButton}
                  onPress={() => {
                    navigation.navigate('CreateQuote');
                  }}>
                  <Ionicons
                    name="add"
                    size={32}
                    color={colors.white}
                  />
                </TouchableOpacity>
              </View>
            );
          }

          // =================================================
          // TAB PRESS
          // =================================================

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (
              !isFocused &&
              !event.defaultPrevented
            ) {
              navigation.navigate(route.name);
            }
          };

          // =================================================
          // ICON
          // =================================================

          let iconName = 'home-outline';

          if (route.name === 'Home') {
            iconName = isFocused
              ? 'home'
              : 'home-outline';
          }

          if (route.name === 'Explore') {
            iconName = isFocused
              ? 'search'
              : 'search-outline';
          }

          if (route.name === 'Favorites') {
            iconName = isFocused
              ? 'heart'
              : 'heart-outline';
          }

          if (route.name === 'Profile') {
            iconName = isFocused
              ? 'person'
              : 'person-outline';
          }

          // =================================================
          // TRANSLATED LABEL
          // =================================================

          const label = getTabLabel(route.name);

          // =================================================
          // TAB ITEM
          // =================================================

          return (
            <TouchableOpacity
              key={route.key}
              activeOpacity={0.7}
              onPress={onPress}
              style={styles.tabItem}>
              <Ionicons
                name={iconName}
                size={23}
                color={
                  isFocused
                    ? colors.accent
                    : colors.iconSecondary
                }
              />

              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isFocused
                      ? colors.accent
                      : colors.iconSecondary,
                  },
                ]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// =======================================================
// BOTTOM TAB NAVIGATOR
// =======================================================

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={props => (
        <CustomTabBar {...props} />
      )}
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen
        name="Home"
        component={Screens.Home}
      />

      <Tab.Screen
        name="Explore"
        component={Screens.Explore}
      />

      <Tab.Screen
        name="CreateQuote"
        component={Screens.CreateQuotes}
      />

      <Tab.Screen
        name="Favorites"
        component={Screens.Favorites}
      />

      <Tab.Screen
        name="Profile"
        component={Screens.Profile}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;