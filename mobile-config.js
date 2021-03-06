App.info({
  id: 'com.bbipad.test',
  website: 'https://bb-ipad.herokuapp.com/'
});

App.accessRule('*');
App.setPreference('orientation', 'landscape');

App.icons({
  iphone_2x: 'resources/icons/iphone_2x.png',
  iphone_3x: 'resources/icons/iphone_3x.png',
  ipad: 'resources/icons/ipad.png',
  ipad_2x: 'resources/icons/ipad_2x.png',
  ipad_pro: 'resources/icons/ipad_pro.png',
  ios_settings: 'resources/icons/ios_settings.png',
  ios_settings_2x: 'resources/icons/ios_settings_2x.png',
  ios_settings_3x: 'resources/icons/ios_settings_3x.png',
  ios_spotlight: 'resources/icons/ios_spotlight.png',
  ios_spotlight_2x: 'resources/icons/ios_spotlight_2x.png'
});

App.launchScreens({
  iphone_2x: 'resources/splash/iphone_2x.jpeg',
  iphone5: 'resources/splash/iphone5.jpeg',
  iphone6: 'resources/splash/iphone6.jpeg',
  // iphone6p_portrait: 'resources/splash/iphone6p_portrait.jpeg',
  iphone6p_landscape: 'resources/splash/iphone6p_landscape.jpeg',
  // ipad_portrait: 'resources/splash/ipad_portrait.jpeg',
  // ipad_portrait_2x: 'resources/splash/ipad_portrait_2x.jpeg',
  ipad_landscape: 'resources/splash/ipad_landscape.jpeg',
  ipad_landscape_2x: 'resources/splash/ipad_landscape_2x.jpeg'
});

App.configurePlugin('cordova-plugin-file', {
  iosPersistentFileLocation: 'Library'
});
