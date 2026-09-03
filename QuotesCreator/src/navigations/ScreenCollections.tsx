import * as Screens from '@/screens/index';

import Routes from '@/navigations/Routes';

// =====================================================
// AUTH STACK
// =====================================================

export const authStack = [
  {
    name: Routes.SPLASH,
    component: Screens.Splash,
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
