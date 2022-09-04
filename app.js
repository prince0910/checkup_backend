// get crypto module
const crypto = require("crypto");

// string to be hashed
const password = "mypassword";

// secret or salt to be hashed with
const salt = "some salt2";

// create a sha-256 hasher
const sha256Hasher = crypto.createHmac("sha256", salt);

// hash the string
// and set the output format
const hash = sha256Hasher.update(password).digest("hex");


crypto.randomBytes(32, function(err, buffer) {
     token = buffer.toString('hex');
     console.log('token:',token); 
});


console.log('hash:',hash); 