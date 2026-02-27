// ============================================
// Vigenere Cipher
// ============================================

function validateKey(key: string): string {
  const cleaned = key.replace(/[^A-Za-z]/g, "").toUpperCase();
  if (cleaned.length === 0) {
    throw new Error("Key must contain at least one alphabetic character.");
  }
  return cleaned;
}

function sanitizeText(text: string): string {
  return text.replace(/[^A-Za-z]/g, "").toUpperCase();
}

export function encrypt(plaintext: string, key: string): string {
  const cleanKey = validateKey(key);
  const cleanText = sanitizeText(plaintext);

  if (cleanText.length === 0) {
    throw new Error("Plaintext must contain at least one alphabetic character.");
  }

  let result = "";
  for (let i = 0; i < cleanText.length; i++) {
    const p = cleanText.charCodeAt(i) - 65;
    const k = cleanKey.charCodeAt(i % cleanKey.length) - 65;
    const c = (p + k) % 26;
    result += String.fromCharCode(c + 65);
  }
  return result;
}

export function decrypt(ciphertext: string, key: string): string {
  const cleanKey = validateKey(key);
  const cleanText = sanitizeText(ciphertext);

  if (cleanText.length === 0) {
    throw new Error("Ciphertext must contain at least one alphabetic character.");
  }

  let result = "";
  for (let i = 0; i < cleanText.length; i++) {
    const c = cleanText.charCodeAt(i) - 65;
    const k = cleanKey.charCodeAt(i % cleanKey.length) - 65;
    const p = (c - k + 26) % 26;
    result += String.fromCharCode(p + 65);
  }
  return result;
}
