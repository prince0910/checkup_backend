import crypto from "crypto";

const pass = " I love you "; //something to encrypt

const {publicKey,privateKey} = crypto.generateKeyPairSync("rsa",{
    modulusLength: 2048, //for secure hashing length of a hashfunction
})

//encryption function
//using sha256 but you can use any sha524 or others
const encryptMe = crypto.publicEncrypt({
    key: publicKey,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: "sha256"
}, Buffer.from(pass));  //remember palin text first should be converted to binary form

console.log("Hash: ",encryptMe.toString("base64"));

// //////////////////////now lets decrypt

const decryptData =  crypto.privateDecrypt({
    key: privateKey,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: "sha256"
},encryptMe);

console.log("\n แปลงค่าได้ : ", decryptData.toString())

// require('crypto').randomBytes(48, function(err, buffer) {
//     var token = buffer.toString('hex');
//     console.log(token)
// });

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
    charactersLength));
   }
   
   return result;
}

function log(){
    const username = 'nut'
    const password = '1234'

    item = test.query('SELECT pwd FROM Employee WHERE userName = "pwd"', function (err,result){
        if(err) throw err;
        else if('user' == / something correct /){
            console.log("TRUE");
        }
        console.log(result[0]);
    });
 
        



}

// console.log('makeid(5)',makeid(5).toString("base64"));