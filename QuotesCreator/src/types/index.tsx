import { RouteProp } from '@react-navigation/native';
import { TextInputProps } from 'react-native';

import Routes from '@/navigations/Routes';

// ==================================================
// INPUT
// ==================================================

export interface InputComponentProps extends TextInputProps {
  leftIcon?: string;
  isPassword?: boolean;
  error?: string;
}

// ==================================================
// AUTH
// ==================================================

export interface AuthFooterProps {
  text: string;
  linkText: string;
  onPress: () => void;
}

// ==================================================
// TABS
// ==================================================

export type TabItem = {
  key: string;
  title: string;
};

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (key: string) => void;
}

// ==================================================
// BUTTON
// ==================================================

export interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

// ==================================================
// DRAWER
// ==================================================

export type MenuItemProps = {
  icon: string;
  title: string;
  route: string;
  activeRoute?: string;
  badge?: number;
};

export type CustomDrawerProps = {
  visible: boolean;
  onClose: () => void;
};

// ==================================================
// SOCIAL BUTTON
// ==================================================

export interface SocialButtonProps {
  title: string;
  icon: any;
  onPress: () => void;
}

// ==================================================
// IMAGE PICKER
// ==================================================

export interface ImagePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onCamera: () => void;
  onGallery: () => void;
}

// ==================================================
// QUOTE ACTIONS
// ==================================================

export type QuoteActionsProps = {
  onFavoritePress?: () => void;
  onSharePress?: () => void;
  favoriteSize?: number;
  isFavorite?: boolean;
  isLiked?: boolean;
  likes?: number;
  showLikes?: boolean;
};

// ==================================================
// AUTH PAYLOADS
// ==================================================

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  profileImage?: {
    uri: string;
    type: string;
    name: string;
  } | null;
}

// ==================================================
// USER
// ==================================================

export interface User {
  id: string;
  name: string;
  email: string;
  profileImage: string | null;
  language: 'English' | 'Hindi';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  error: string | null;
}

// ==================================================
// AUTH CONTEXT
// ==================================================

export type AuthContextType = {
  user: any;
  loading: boolean;
  googleLogin: () => Promise<any>;
  facebookLogin: () => Promise<any>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
};

export type AuthProviderProps = {
  children: React.ReactNode;
};

// ==================================================
// NOTIFICATIONS
// ==================================================

export type NotificationItem = {
  _id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  text: string;

  data?: {
    language?: string;
    image?: string;
    [key: string]: any;
  };

  isRead: boolean;
  createdAt: string;
  updatedAt?: string;
};

export type NotificationState = {
  notifications: NotificationItem[];
  isLoading: boolean;
  error: string | null;
};

// ==================================================
// HEADER
// ==================================================

export interface HeaderProps {
  title: string;

  // LEFT
  icon?: string;
  onMenuPress?: () => void;
  showMenu?: boolean;

  // RIGHT
  rightIcon?: string;
  rightText?: string;
  onRightPress?: () => void;

  // NOTIFICATION
  onNotificationPress?: () => void;
  showNotification?: boolean;
  notificationCount?: number;
}

// ==================================================
// LANGUAGE
// ==================================================

export type Language = 'English' | 'Hindi';

// ==================================================
// LATEST QUOTES
// ==================================================

export type LatestQuotesParams = {
  language: Language;
  page: number;
  limit: number;
};

export type popularQuotesParams = {
  language: Language;
  page: number;
  limit: number;
};
// ==================================================
// QUOTE
// ==================================================

export type Quote = {
  _id: string;
  text: string;
  author?: string;
  image?: string | null;
  language: Language;
  views?: number;
  likes?: number;
  isLiked?: boolean;
  isDraft?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  displayText: string;
};

// ==================================================
// DAILY QUOTE
// ==================================================

export interface DailyQuote {
  _id: string;

  text: string;

  textEnglish?: string;

  textHindi?: string;

  author?: string;

  title?: string;

  imageUrl?: string;

  createdAt?: string;

  updatedAt?: string;
}

export type DailyQuoteCardProps = {
  quote: DailyQuote;
  onFavoritePress?: () => void;
  onSharePress?: () => void;
};

// ==================================================
// SECTION HEADER
// ==================================================

export type SectionHeaderProps = {
  title: string;
  onViewAllPress?: () => void;
};

// ==================================================
// CATEGORIES
// ==================================================

export type CategoriesParams = {
  language: Language;
  page: number;
  limit: number;
};

export interface CategoryTranslation {
  English: string;
  Hindi: string;
}

export interface Category {
  _id: string;
  name: string;
  displayName: string;
  displayLanguage: string;
  image: string | null;

  translations: {
    English: string;
    Hindi: string;
  };

  quoteCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoriesResponse {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  language: Language;
  categories: Category[];
}

export type ItemCategoriesProps = {
  item: Category;
  fullWidth?: boolean;
  onPress: () => void;
};

// ==================================================
// LATEST QUOTE ITEM
// ==================================================

export type ItemLatestQuotesProps = {
  item: Quote;
};

// ==================================================
// POPULAR QUOTES
// ==================================================

export type ItemPopularProps = {
  item: Quote;
  onLikePress?: (quoteId: string) => void;
  onUnlikePress?: (quoteId: string) => void;
};

export interface PopularQuotesParams {
  language: Language;
  page: number;
  limit: number;
}

export interface PopularQuotesResponse {
  success: boolean;
  message?: string;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  language: Language;
  quotes: Quote[];
}

// ==================================================
// QUOTE STATES
// ==================================================

export interface LatestQuoteState {
  quotes: Quote[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface PopularQuoteState {
  quotes: Quote[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  language: Language;
  isLoading: boolean;
  error: string | null;
}

// ==================================================
// GET QUOTES
// ==================================================

export interface GetQuotesParams {
  categoryId?: string;
  subcategoryId?: string;
  page?: number;
  limit?: number;
  language?: Language;
}

export interface QuotesState {
  quotes: Quote[];

  page: number;

  limit: number;

  total: number;

  totalPages: number;

  hasNextPage: boolean;

  hasPreviousPage: boolean;

  language: Language;

  loading: boolean;

  error: string | null;
}

// ==================================================
// SUBCATEGORIES
// ==================================================

export type SubCategoriesParams = {
  categoryId: string;
  categoryName: string;
};

export type SubCategoriesRouteProp = RouteProp<
  {
    SubCategories: SubCategoriesParams;
  },
  'SubCategories'
>;

export interface SubCategory {
  _id: string;

  categoryId: string;

  name: string;

  displayName: string;

  displayText: string;

  displayLanguage: Language;

  translations?: {
    English?: string;
    Hindi?: string;
  };

  quoteCount: number;

  createdAt?: string;

  updatedAt?: string;
}

export interface SubCategoriesState {
  subcategories: SubCategory[];

  page: number;

  limit: number;

  total: number;

  totalPages: number;

  hasNextPage: boolean;

  hasPreviousPage: boolean;

  language: Language;

  loading: boolean;

  error: string | null;
}

// ==================================================
// QUOTES SCREEN ROUTE
// ==================================================

export type QuotesParams = {
  categoryId: string;
  subcategoryId?: string;
  categoryName?: string;
};

export type QuotesRouteProp = RouteProp<
  {
    [Routes.QUOTES]: QuotesParams;
  },
  typeof Routes.QUOTES
>;

// ==================================================
// FAVOURITES
// ==================================================

export type ItemFavouritesProps = {
  item: Quote;
  onShare?: (item: Quote) => void;
};

// ==================================================
// TIMEZONE
// ==================================================

export type TimeZoneItem = {
  label: string;
  value: string;
};

// ==================================================
// DEVICE
// ==================================================

export interface RegisterDeviceData {
  userId: string;
  fcmToken: string;
  platform: 'ios' | 'android';
  language: Language;
}

// ==================================================
// DELETE ACCOUNT
// ==================================================

export interface DeleteAccountState {
  isLoading: boolean;
  success: boolean;
  error: string | null;
  message: string | null;
}
export interface LatestQuotesState {
  quotes: Quote[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  total: number;
  error: string | null;
}

export interface ProfileState {
  profile: {
    id: string;
    name: string;
    email: string;
    profileImage: string | null;
    provider?: 'email' | 'google' | 'facebook';
  } | null;

  isLoading: boolean;
  error: string | null;
}

export type UpdateProfileParams = {
  userId: string;
  name: string;
  email: string;
  profileImage?: {
    uri: string;
    type?: string;
    fileName?: string;
  } | null;
};
