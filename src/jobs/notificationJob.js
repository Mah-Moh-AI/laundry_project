const admin = require("firebase-admin");
const { getMessaging } = require("firebase-admin/messaging");
const logger = require("../logging/index");

const {
  FCM_PROJECT_ID,
  GOOGLE_APPLICATION_CREDENTIALS,
} = require("../config/env");

module.exports = class FcmNotification {
  constructor(fcmtoken) {
    this.fcmToken = fcmtoken;
  }

  async newNotification(title, body) {
    // FCM intialize
    if (!admin.apps.length) {
      admin.initializeApp({
        //   credential: admin.credential.cert(GOOGLE_APPLICATION_CREDENTIALS),
        credential: admin.credential.applicationDefault(), // not mandatory
        projectId: FCM_PROJECT_ID, // not mandatory
      });
    }

    const message = {
      notification: {
        title,
        body,
      },
      token: this.fcmToken,
    };
    return await getMessaging().send(message);
  }

  async sendNotification(title, body) {
    const response = await this.newNotification(title, body);
    return response;
  }
};

// write below line in console
// $env:GOOGLE_APPLICATION_CREDENTIALS="D:\0- CS Study\2- backend\3_Laundry_Project\pushnotificationfcmtest-firebase-adminsdk-pjcqs-565ac2ce9d.json"
