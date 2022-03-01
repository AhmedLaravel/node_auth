const crypto = require("crypto");
// generating a 64 base secret key for access token
const key1 = crypto.randomBytes(64).toString("hex");

// generating a 64 base secret key for refresh token
const key2 = crypto.randomBytes(64).toString("hex");

console.table({key1,key2});