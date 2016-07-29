The Android app hasn't been updated in a long time.It will be rewritten soon.
## Android
The Android app uses:
- Cordova
- jQuery
  
And the following cordova plugins:
- nl.x-services.plugins.calendar 4.3.1 "Calendar"
- nl.x-services.plugins.socialsharing 4.3.17 "SocialSharing"
- nl.x-services.plugins.toast 2.0.4 "Toast"
- org.apache.cordova.device 0.2.13 "Device"
- org.apache.cordova.dialogs 0.3.0 "Notification"
- org.apache.cordova.inappbrowser 0.6.0 "InAppBrowser"  
  
To test the app on an Android device connected to your computer using a USB cable:  
1. Install and set up cordova.Follow this link if you need help: http://ccoenraets.github.io/cordova-tutorial/create-cordova-project.html  
2. Install the above mentioned plugins.(Again follow the link above to learn how to add that).  
3. Replace the www/ folder in your project with the one in the repo( android/www ).  
4. Run the following commands  
```
cordova platforms add android
cordova run android
```
