import { TextInputProps } from 'react-native';

export interface InputComponentProps extends TextInputProps {
  leftIcon?: string;
  isPassword?: boolean;
  error?: string;
}

export interface AuthFooterProps {
  text: string;
  linkText: string;
  onPress: () => void;
}

export interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}
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
export interface SocialButtonProps {
  title: string;
  icon: any;
  onPress: () => void;
}

export interface ImagePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onCamera: () => void;
  onGallery: () => void;
}

export type QuoteActionsProps = {
  onFavoritePress?: () => void;
  onSharePress?: () => void;
  favoriteSize?: number;
  isFavorite?: boolean;
  isLiked?: boolean;
  likes?: number;
};

export interface LoginPayload {
  email: string;
  password: string;
}

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

export type NotificationItem = {
  _id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
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

export type HeaderProps = {
  title: string;
  icon?: string;
  onMenuPress?: () => void;
  showMenu?: boolean;
  rightIcon?: string;
  onRightPress?: () => void;
  onNotificationPress?: () => void;
  showNotification?: boolean;
  notificationCount?: number;
};
export type Language = 'English' | 'Hindi';

export type LatestQuotesParams = {
  language: Language;
  page: number;
  limit: number;
};

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
};

export type DailyQuote = {
  title: string;
  body: string;
  createdAt?: string;
};

export type DailyQuoteCardProps = {
  quote: DailyQuote;
  onFavoritePress?: () => void;
  onSharePress?: () => void;
};

export type SectionHeaderProps = {
  title: string;
  onViewAllPress?: () => void;
};

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
  displayLanguage: Language;
  image: string | null;
  translations: CategoryTranslation;
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

export type ItemLatestQuotesProps = {
  item: Quote;
};

export type ItemCategoriesProps = {
  item: Category;
  fullWidth?: boolean;
};

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

export interface DailyNotificationState {
  notifications: NotificationItem[];
  isLoading: boolean;
  error: string | null;
}

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
  language: 'English' | 'Hindi';
  isLoading: boolean;
  error: string | null;
}

export interface DeleteAccountState {
  isLoading: boolean;
  success: boolean;
  error: string | null;
  message: string | null;
}
