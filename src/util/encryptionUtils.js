import CryptoJS from 'crypto-js';

// 암호화 함수
const encryptText = (inputText) => {
  if (inputText === null) {
    return null;
  }

  const encrypted = CryptoJS.AES.encrypt(inputText, 'secret passphrase').toString();
  let processedText = encrypted.replace(/\//g, '歲'); // '/'를 다른 문자로 치환
  return processedText;
};

// 복호화 함수
const decryptText = (encryptedText) => {
  if (encryptedText === null) {
    return null;
  }

  let processedDecryptedText = encryptedText.replace(/歲/g, '/'); // 다른 문자를 '/'로 복구
  const decrypted = CryptoJS.AES.decrypt(processedDecryptedText, 'secret passphrase').toString(CryptoJS.enc.Utf8);
  return decrypted;
};

export { encryptText, decryptText };
