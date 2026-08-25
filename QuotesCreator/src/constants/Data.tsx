import IMAGES from '@/assets/images';
import { OnboardingItem } from '@/types';

export const onboardingData: OnboardingItem[] = [
  {
    id: '1',
    image: IMAGES.ONBOARDING_1,
    title: 'Welcome to Quotes',
    description:
      'Read thousands of inspirational quotes and make your day better.',
  },
  {
    id: '2',
    image: IMAGES.ONBOARDING_2,
    title: 'Create & Edit',
    description:
      'Create your own quotes with our powerful editor and customize them.',
  },
  {
    id: '3',
    image: IMAGES.ONBOARDING_3,
    title: 'Share & Inspire',
    description:
      'Share your quotes with the world and inspire millions of people.',
  },
];
