import React from 'react';

import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, TouchableOpacity, Text } from 'react-native';

import * as Screens from '@/screens/index';

import styles from './styles';

const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, navigation }: BottomTabBarProps) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.tabBar}>
        {state.routes.map(route => {
          const isFocused = state.index === state.routes.indexOf(route);

          // CENTER ADD BUTTON
          if (route.name === 'CreateQuote') {
            return (
              <View style={styles.centerButtonContainer} key={route.key}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.addButton}
                  onPress={() => {
                    navigation.navigate('CreateQuote');
                  }}
                >
                  <Ionicons name="add" size={32} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            );
          }

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          let iconName = 'home-outline';

          if (route.name === 'Home') {
            iconName = isFocused ? 'home' : 'home-outline';
          }

          if (route.name === 'Explore') {
            iconName = isFocused ? 'search' : 'search-outline';
          }

          if (route.name === 'Favorites') {
            iconName = isFocused ? 'heart' : 'heart-outline';
          }

          if (route.name === 'Profile') {
            iconName = isFocused ? 'person' : 'person-outline';
          }

          return (
            <TouchableOpacity
              key={route.key}
              activeOpacity={0.7}
              onPress={onPress}
              style={styles.tabItem}
            >
              <Ionicons
                name={iconName}
                size={23}
                color={isFocused ? '#6C2BD9' : '#8A8A8A'}
              />

              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isFocused ? '#6C2BD9' : '#8A8A8A',
                  },
                ]}
              >
                {route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={Screens.Home} />

      <Tab.Screen name="Explore" component={Screens.Explore} />

      <Tab.Screen name="CreateQuote" component={Screens.CreateQuotes} />

      <Tab.Screen name="Favorites" component={Screens.Favorites} />

      <Tab.Screen name="Profile" component={Screens.Profile} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
