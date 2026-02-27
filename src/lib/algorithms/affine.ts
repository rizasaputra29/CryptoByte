// ============================================
// Affine Cipher: E(x) = (ax + b) mod 26
//                D(x) = a^(-1)(x - b) mod 26
// ============================================

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

function modInverse(a: number, m: number): number {
  a = ((a % m) + m) % m;
  for (let x = 1; x < m; x++) {
    if ((a * x) % m === 1) return x;
  }
  throw new Error(`No modular inverse exists for a=${a} mod ${m}`);
}

function sanitizeText(text: string): string {
  return text.replace(/[^A-Za-z]/g, "").toUpperCase();
}

export function validateKeys(a: number, b: number): void {
  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    throw new Error("Keys a and b must be integers.");
  }
  if (a < 0 || a > 25) {
    throw new Error("Key 'a' must be between 0 and 25.");
  }
  if (b < 0 || b > 25) {
    throw new Error("Key 'b' must be between 0 and 25.");
  }
  if (gcd(a, 26) !== 1) {
    throw new Error(
      `Key 'a' (${a}) must be coprime with 26. Valid values: 1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25.`
    );
  }
}

export function encrypt(plaintext: string, a: number, b: number): string {
  validateKeys(a, b);
  const cleanText = sanitizeText(plaintext);

  if (cleanText.length === 0) {
    throw new Error("Plaintext must contain at least one alphabetic character.");
  }

  let result = "";
  for (let i = 0; i < cleanText.length; i++) {
    const x = cleanText.charCodeAt(i) - 65;
    const encrypted = (a * x + b) % 26;
    result += String.fromCharCode(encrypted + 65);
  }
  return result;
}

export function decrypt(ciphertext: string, a: number, b: number): string {
  validateKeys(a, b);
  const cleanText = sanitizeText(ciphertext);

  if (cleanText.length === 0) {
    throw new Error("Ciphertext must contain at least one alphabetic character.");
  }

  const aInv = modInverse(a, 26);
  let result = "";
  for (let i = 0; i < cleanText.length; i++) {
    const y = cleanText.charCodeAt(i) - 65;
    const decrypted = (aInv * (y - b + 26)) % 26;
    result += String.fromCharCode(((decrypted % 26) + 26) % 26 + 65);
  }
  return result;
}
