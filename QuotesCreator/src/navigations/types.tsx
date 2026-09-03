import { NavigatorScreenParams, RouteProp } from '@react-navigation/native';

import { Quote } from '@/types';
import Routes from './Routes';

// =====================================================
// AUTH STACK
// =====================================================
export type MainStackParamList = {
  [Routes.BOTTOM_TABS]: undefined;
};
export type AuthStackParamList = {
  [Routes.SPLASH]: undefined;
  [Routes.LOGIN]: undefined;
  [Routes.REGISTER]: undefined;
  [Routes.FORGOT]: undefined;
};

// =====================================================
// BOTTOM TAB
// =====================================================

export type BottomTabParamList = {
  [Routes.HOME]: undefined;
  [Routes.EXPLORE]: undefined;
  [Routes.CREATE_QUOTES]: undefined;
  [Routes.FAVORITES]: undefined;
  [Routes.PROFILE]: undefined;
};

// =====================================================
// DRAWER
// =====================================================

export type DrawerParamList = {
  [Routes.BOTTOM_TABS]: NavigatorScreenParams<BottomTabParamList>;

  [Routes.CREATE_QUOTES]: undefined;
  [Routes.FAVORITES]: undefined;
  [Routes.TEMPLATES]: undefined;
  [Routes.DOWNLOADS]: undefined;
  [Routes.SETTINGS]: undefined;
  [Routes.ABOUT]: undefined;
  [Routes.CATEGORIES]: undefined;
  [Routes.NOTIFICATIONS]: undefined;

  [Routes.EDIT_PROFILE]: undefined;
  [Routes.PROFILE]: undefined;
  [Routes.SUB_CATEGORIES]: {
    categoryId: string;
    categoryName: string;
  };

  [Routes.QUOTES]: {
    type: 'latest' | 'popular';
    title?: string;
  };
  [Routes.LATEST]: {
    title?: string;
  };
  [Routes.POPULAR]: {
    title?: string;
  };

  [Routes.NOTIFICATIONS_SETTINGS]: undefined;
  [Routes.TIME_ZONE]: undefined;

  [Routes.QUOTES_DETAILS]: {
    item: Quote;
    quotes: Quote[];
    index: number;
  };
};

// =====================================================
// QUOTES DETAILS
// =====================================================

export type QuotesDetailsRouteProp = RouteProp<
  DrawerParamList,
  Routes.QUOTES_DETAILS
>;
