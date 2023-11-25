import { randomBytes } from 'crypto';

/*navigate to the /utils folder in your termainal and run 
node --experimental-modules generate_key.mjs*/


// Define the key length in bytes (for example, 32 bytes for AES-256)
const keyLengthBytes = 32;

// Generate a random secret key
const secretKey = randomBytes(keyLengthBytes).toString('hex');


//log to the server side console and save in your environment variables
console.log('Generated Secret Key:', secretKey);