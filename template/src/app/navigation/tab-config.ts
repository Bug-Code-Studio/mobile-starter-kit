import type { ComponentType } from 'react';

import { HomeScreen } from '@/features/home/screens/HomeScreen';

import type { MainTabParamList } from './types';

export type MainTabConfig = {
  [RouteName in keyof MainTabParamList]: {
    name: RouteName;
    component: ComponentType;
  };
}[keyof MainTabParamList];

export const mainTabConfig: MainTabConfig[] = [
  {
    name: 'Home',
    component: HomeScreen,
  },
];