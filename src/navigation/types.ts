// CofitApp Root Stack（最外層 - Stack 包 Tab）
export type CofitAppRootStackParamList = {
  MainTabs: undefined; // Tab Navigator
  OnboardingStack: undefined; // 首次登入引導流程
  HomeStack: { id: string };
  DiaryStack: { id: string };
  ExpertStack: { id: string };
  CofitAppProfileStack: { id: string };
  NotificationsStack: { id: string };
};

// CofitPro Root Stack（最外層 - Stack 包 Tab）
export type CofitProRootStackParamList = {
  MainTabs: undefined; // Tab Navigator
  ClientsStack: { id: string };
  ClientChatStack: { clientId: string };
  CommunityStack: { id: string };
  NotificationsStack: { id: string };
  CofitProProfileStack: undefined;
};

// CofitApp Tab 參數（只有主頁面，沒有詳情頁）
export type CofitAppTabParamList = {
  Home: undefined;
  Diary: undefined;
  Expert: undefined;
  Shop: undefined;
  Notifications: undefined;
  Profile: undefined;
};

// CofitPro Tab 參數（只有主頁面，沒有詳情頁）
export type CofitProTabParamList = {
  Clients: undefined;
  ClientChat: undefined;
  Community: undefined;
  Notifications: undefined;
  Profile: undefined;
};
