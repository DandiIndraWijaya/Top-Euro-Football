let webPush = require('web-push');
 
const vapidKeys = {
   "publicKey": "BKrVcsmo943BpI-JrowNgIODorGw4JeEW-nsvCR94pDbFmD6xpQlGk3-zXXmDZBSNf4Hh-d3SXA59hiDAvomrtc",
   "privateKey": "T-hfCoynRYsYineGHnrZG4_J5oHN9L_1_3N_FOU1x1E"
};
 
 
webPush.setVapidDetails(
   'mailto:example@yourdomain.org',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
let pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/caxTEvf-IA0:APA91bH0DZFLIzwebiofzduSHj6ltvSeimockgRJCQfYtGD50koyEVaEvnGByccXAuDEfVznMc9eZNla3bjDD3i6JMCeROSASdSa1Cbx3u3p57HrGacHUQHLm-GOsFZVor5-J5c5ijDA",
   "keys": {
       "p256dh": "BA/AXp25XaK2teBvLqgCO/jSd/AdDG6EodHREkMA40fWJ7tQYg1MxsZy+xnBNH3YWOQOtmhkaSdG+Z6UsBPwb/U=",
       "auth": "0Rh+iBf3/idpJMcoTuCkjA=="
   }
};
let payload = 'Notification';
const title = 'Top Euro League';
let options = {
   gcmAPIKey: '862234896193',
   TTL: 60,
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options,
   title
);