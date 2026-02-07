import { ComponentType } from 'react';

// Onboarding Stack 參數列表
export type OnboardingStackParamList = {
  // Basic Info
  BasicInfoIntroPage: undefined;
  BasicInfoGenderPage: undefined;
  BasicInfoBirthdayPage: undefined;
  BasicInfoHeightWeightPage: undefined;

  // Target
  TargetIntroPage: undefined;
  TargetGoalPage: undefined;
  TargetWeightPage: undefined;
  TargetSpeedPage: undefined;

  // Activity
  ActivityIntroPage: undefined;
  FoodHabitPage: undefined;
  ActivityFrequencyPage: undefined;

  // Fasting
  FastingIntroPage: undefined;
  FastingChoosingPage: undefined;
  FastingSchedulePage: undefined;

  // Plate Setting
  PlateSettingIntroPage: undefined;
  PlateSettingPage: undefined;

  // Result
  ResultSummaryPage: undefined;
  ResultReportPage: undefined;
};

// 頁面配置介面
export interface PageConfig {
  component: ComponentType<any>;
  name: keyof OnboardingStackParamList;
  title?: string;
}

// 導出所有頁面名稱的聯合類型
export type OnboardingPageName = keyof OnboardingStackParamList;
