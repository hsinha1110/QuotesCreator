import * as Screens from '@/screens/index';
import Routes from '@/navigations/Routes';
// ======================================
// AUTH STACK
// ======================================

export const authStack = [
  {
    name: Routes.SPLASH,
    component: Screens.Splash,
  },
  {
    name: Routes.ONBOARDING,
    component: Screens.OnBoarding,
  },
  {
    name: Routes.LOGIN,
    component: Screens.Login,
  },
  {
    name: Routes.REGISTER,
    component: Screens.Register,
  },
  {
    name: Routes.FORGOT,
    component: Screens.Forgot,
  },
];

// ======================================
// DASHBOARD STACK
// ======================================

export const dashboardStack = [
  {
    name: Routes.HOME,
    component: Screens.Home,
  },
];

// ======================================
// ALL STACKS
// ======================================

export const mergedStacks = [...dashboardStack, ...authStack];
