import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

// Encryption Helper Function
export function encryptData(data, secretKey) {
  // Generate an initialization vector (IV)
  const iv = randomBytes(16);

  // Create a cipher object with the 'aes-256-cbc' algorithm
  const cipher = createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);

  // Encrypt the data
  let encryptedData = cipher.update(data, 'utf8', 'hex');
  encryptedData += cipher.final('hex');

  // Return the encrypted data along with the IV
  return {
    iv: iv.toString('hex'),
    encryptedData,
  };
}

// Decryption Helper Function
export function decryptData(encryptedData, secretKey, iv) {
  // Create a decipher object with the 'aes-256-cbc' algorithm
  const decipher = createDecipheriv('aes-256-cbc', Buffer.from(secretKey), Buffer.from(iv, 'hex'));

  // Decrypt the data
  let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
  decryptedData += decipher.final('utf8');

  // Return the decrypted data
  return decryptedData;
}

// Example Usage:
const secretKey = 'your-secret-key'; // Replace with your actual secret key
const originalData = 'sensitive-data';

// Encrypt the data
const encryptedDataObj = encryptData(originalData, secretKey);

console.log('Encrypted Data:', encryptedDataObj.encryptedData);
console.log('IV:', encryptedDataObj.iv);

// Decrypt the data
const decryptedData = decryptData(encryptedDataObj.encryptedData, secretKey, encryptedDataObj.iv);

console.log('Decrypted Data:', decryptedData);
