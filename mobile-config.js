App.info({
  id: 'com.bbipad.test',
  website: 'https://bb-ipad.herokuapp.com/'
});

App.accessRule('*');
App.setPreference('orientation', 'landscape');

App.icons({
  ipad: 'resources/icons/ipad.icon.png',
  ipad_2x: 'resources/icons/ipad_2x.icon.png',
});

App.launchScreens({
  ipad_landscape: 'resources/splash/ipad_landscape.splash.png',
  ipad_landscape_2x: 'resources/splash/ipad_landscape_2x.splash.png'
});

App.configurePlugin('cordova-plugin-file', {
  iosPersistentFileLocation: 'Library'
});
