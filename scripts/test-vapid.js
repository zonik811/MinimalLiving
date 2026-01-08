const webpush = require("web-push");

const publicKey = "BOwTC2-z1FUnDCW336uwbAWs53EWSotzisby8H5CJj6mmhYSpRdbu83psL3n5i4Gsp2DxjWKU9EPzf7iyK7UVm9U";
const privateKey = "-AHKBXoy0RD8J1hCYuTZwIufMW3E9bzdFr-67HER3h8";

try {
    webpush.setVapidDetails(
        "mailto:test@example.com",
        publicKey,
        privateKey
    );
    console.log("VAPID keys are valid!");
} catch (error) {
    console.error("VAPID Key Error:", error.message);
}
