var webPush = require('web-push');
 
const vapidKeys = {
   "publicKey": "BKrVcsmo943BpI-JrowNgIODorGw4JeEW-nsvCR94pDbFmD6xpQlGk3-zXXmDZBSNf4Hh-d3SXA59hiDAvomrtc",
   "privateKey": "T-hfCoynRYsYineGHnrZG4_J5oHN9L_1_3N_FOU1x1E"
};
 
 
webPush.setVapidDetails(
   'mailto:example@yourdomain.org',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
var pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/fiWM34xD9Tw:APA91bExzNafTh5-wpBZPEyMIxSmopKJXGgl8R3jAPiod5UQ3c_bcaCg3hMJLyEVPMiCkjmBaon1E4UTSfeYYINfy1L67Uoa8jnMTbnGsLDPFsxSQzLd8qUSDIDWoNJydJaOxikQrXY4",
   "keys": {
       "p256dh": "BA+XgDPMTw6AiM8cuq39/MByIBlz39S+4frZFYwut8uq54QMTB8xE+9OMubC8qVlCg8eHPSIjX89uLxDy4FHZTU=",
       "auth": "avQF7jyB6CHEcP/kts5gkw=="
   }
};
var payload = 'Great';
const title = 'Notifikasi Sederhana';
var options = {
   gcmAPIKey: '862234896193',
   TTL: 60,
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options,
   title
);