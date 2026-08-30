import * as Screens from '@/screens/index';
import Routes from '@/navigations/Routes';

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

export const dashboardStack = [
  {
    name: Routes.BOTTOM_TAB_NAVIGATOR,
    component: Screens.BottomTab,
  },
  {
    name: Routes.CATEGORIES,
    component: Screens.Categories,
  },
  {
    name: Routes.SUB_CATEGORIES,
    component: Screens.SubCategories,
  },
  {
    name: Routes.QUOTES,
    component: Screens.Quotes,
  },
];

export const mergedStacks = [...dashboardStack, ...authStack];
