import {
  HomePage,
  PreferencesPage,
  SwitchersPage,
  InfoPage,
  ProfileSettingsPage,
  UserManagementPage,
  UploadDataPage,
  SigninPage,
  SplashscreenPage
} from './pages';

export default [
  { component: HomePage, name: 'Home', segment: 'home' },
  { component: PreferencesPage, name: 'Settings', segment: 'settings' },
  { component: SigninPage, name: 'Signin', segment: 'signin' },
  { component: SplashscreenPage, name: 'Splash', segment: '' },
  { component: SwitchersPage, name: 'Preferences', segment: '' },
  { component: InfoPage, name: 'Info', segment: '' },
  { component: ProfileSettingsPage, name: 'Profile', segment: '' },
  { component: UserManagementPage, name: 'Users', segment: '' },
  { component: UploadDataPage, name: 'Data', segment: '' }
];
