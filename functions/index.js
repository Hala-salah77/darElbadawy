const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.makeMeAdmin = functions.https.onCall(async (data, context) => {
  // ده الإيميل اللي هنبعته من أنجولار عشان نخليه أدمن
  const email = data.email;

  try {
    const user = await admin.auth().getUserByEmail(email);
    // إضافة الختم الفسفوري (Claim)
    await admin.auth().setCustomUserClaims(user.uid, {admin: true});

    return {message: `Success! ${email} is now an admin.`};
  } catch (error) {
    throw new functions.https.HttpsError("internal", error.message);
  }
});
