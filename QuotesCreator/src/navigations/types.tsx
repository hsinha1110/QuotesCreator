import Routes from '@/navigations/Routes';

export type AuthStackParamList = {
  [Routes.SPLASH]: undefined;
  [Routes.LOGIN]: undefined;
  [Routes.REGISTER]: undefined;
  [Routes.FORGOT]: undefined;
};

export type MainNavigatorProps = {
  [Routes.HOME]: undefined;
  isAuthenticated: boolean;
};
