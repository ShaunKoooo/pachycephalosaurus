import { PageConfig } from './types';

// 先導入佔位組件（稍後會被實際組件替換）
import { BasicInfoIntroPage } from '@/screens/cofitapp/onboarding/basic-info/BasicInfoIntroPage';
import { BasicInfoGenderPage } from '@/screens/cofitapp/onboarding/basic-info/BasicInfoGenderPage';
import { BasicInfoBirthdayPage } from '@/screens/cofitapp/onboarding/basic-info/BasicInfoBirthdayPage';
import { BasicInfoHeightWeightPage } from '@/screens/cofitapp/onboarding/basic-info/BasicInfoHeightWeightPage';

import { TargetIntroPage } from '@/screens/cofitapp/onboarding/target/TargetIntroPage';
import { TargetGoalPage } from '@/screens/cofitapp/onboarding/target/TargetGoalPage';
import { TargetWeightPage } from '@/screens/cofitapp/onboarding/target/TargetWeightPage';
import { TargetSpeedPage } from '@/screens/cofitapp/onboarding/target/TargetSpeedPage';

import { ActivityIntroPage } from '@/screens/cofitapp/onboarding/activity/ActivityIntroPage';
import { FoodHabitPage } from '@/screens/cofitapp/onboarding/activity/FoodHabitPage';
import { ActivityFrequencyPage } from '@/screens/cofitapp/onboarding/activity/ActivityFrequencyPage';

import { FastingIntroPage } from '@/screens/cofitapp/onboarding/fasting/FastingIntroPage';
import { FastingChoosingPage } from '@/screens/cofitapp/onboarding/fasting/FastingChoosingPage';
import { FastingSchedulePage } from '@/screens/cofitapp/onboarding/fasting/FastingSchedulePage';

import { PlateSettingIntroPage } from '@/screens/cofitapp/onboarding/plate-setting/PlateSettingIntroPage';
import { PlateSettingPage } from '@/screens/cofitapp/onboarding/plate-setting/PlateSettingPage';

import { ResultSummaryPage } from '@/screens/cofitapp/onboarding/result/ResultSummaryPage';
import { ResultReportPage } from '@/screens/cofitapp/onboarding/result/ResultReportPage';

/**
 * Onboarding 流程的頁面配置
 * 按照順序定義所有頁面
 */
export const PAGE_CONFIG: PageConfig[] = [
  // Basic Info Flow
  {
    component: BasicInfoIntroPage,
    name: 'BasicInfoIntroPage',
  },
  {
    component: BasicInfoGenderPage,
    name: 'BasicInfoGenderPage',
  },
  {
    component: BasicInfoBirthdayPage,
    name: 'BasicInfoBirthdayPage',
  },
  {
    component: BasicInfoHeightWeightPage,
    name: 'BasicInfoHeightWeightPage',
  },

  // Target Flow
  {
    component: TargetIntroPage,
    name: 'TargetIntroPage',
  },
  {
    component: TargetGoalPage,
    name: 'TargetGoalPage',
  },
  {
    component: TargetWeightPage,
    name: 'TargetWeightPage',
  },
  {
    component: TargetSpeedPage,
    name: 'TargetSpeedPage',
  },

  // Activity Flow
  {
    component: ActivityIntroPage,
    name: 'ActivityIntroPage',
  },
  {
    component: FoodHabitPage,
    name: 'FoodHabitPage',
  },
  {
    component: ActivityFrequencyPage,
    name: 'ActivityFrequencyPage',
  },

  // Fasting Flow
  {
    component: FastingIntroPage,
    name: 'FastingIntroPage',
  },
  {
    component: FastingChoosingPage,
    name: 'FastingChoosingPage',
  },
  {
    component: FastingSchedulePage,
    name: 'FastingSchedulePage',
  },

  // Plate Setting Flow
  {
    component: PlateSettingIntroPage,
    name: 'PlateSettingIntroPage',
  },
  {
    component: PlateSettingPage,
    name: 'PlateSettingPage',
  },

  // Result Flow
  {
    component: ResultSummaryPage,
    name: 'ResultSummaryPage',
  },
  {
    component: ResultReportPage,
    name: 'ResultReportPage',
  },
];
