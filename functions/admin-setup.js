const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// UID from firebase console
const uid = "YnlVWDt50oX1pp94PCkX2yzpYQN2";

admin.auth().setCustomUserClaims(uid, { admin: true })
    .then(() => {
        console.log("Success! ${email} is now an admin.");
        process.exit();
    })
    .catch(error => {
        console.error("error:", error);
    });