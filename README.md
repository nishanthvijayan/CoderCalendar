# CoderCalendar
Android App and browser extensions for competitive programming enthusiasts.
Shows a list of live & upcoming coding contests taking place in various popular competitive programming websites with the facility to add them to your google calender.
Currently shows updates from Codechef , HackerEarth , Hackerrank, Topcoder and Codeforces.

Note: Both the android app and the extensions currently supports the Indian Standard Time only.

Coder's Calendar is  available for download at:
- Chrome Extension : https://chrome.google.com/webstore/detail/coders-calendar/bageaffklfkikjigoclfgengklfnidll
- Firefox add-on : https://addons.mozilla.org/en-US/firefox/addon/coder-calendar/
  
Found any bugs? Have any suggestions to make this project better?  
Know any other cool coding sites?  
Feel free to log them as an issue.  
Happy Coding!  
  
## Android
The Android app uses:
- Cordova
- jQuery
  
And the following cordova plugins:
- com.telerik.plugins.nativepagetransitions 0.2.14 "Native Page Transitions"
- nl.x-services.plugins.calendar 4.3.1 "Calendar"
- nl.x-services.plugins.socialsharing 4.3.17 "SocialSharing"
- nl.x-services.plugins.toast 2.0.4 "Toast"
- org.apache.cordova.console 0.2.12 "Console"
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
