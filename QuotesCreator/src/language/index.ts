export { default as hi } from './hi';
export { default as en } from './en';

import en from './en';
import hi from './hi';

export const translations = {
  English: en,
  Hindi: hi,
};

export type AppLanguage = keyof typeof translations;
