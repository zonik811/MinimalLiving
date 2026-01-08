const webpush = require("web-push");

try {
    const vapidKeys = webpush.generateVAPIDKeys();
    console.log("PUBLIC_KEY:" + vapidKeys.publicKey);
    console.log("PRIVATE_KEY:" + vapidKeys.privateKey);
} catch (err) {
    console.error("Error generating keys:", err);
}
