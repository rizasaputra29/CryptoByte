// ============================================
// Playfair Cipher
// 5x5 matrix, J merged into I
// ============================================

function sanitizeText(text: string): string {
  return text.replace(/[^A-Za-z]/g, "").toUpperCase().replace(/J/g, "I");
}

function generateMatrix(key: string): string[][] {
  const cleanKey = key.replace(/[^A-Za-z]/g, "").toUpperCase().replace(/J/g, "I");
  const seen = new Set<string>();
  const letters: string[] = [];

  for (const ch of cleanKey) {
    if (!seen.has(ch)) {
      seen.add(ch);
      letters.push(ch);
    }
  }

  for (let i = 0; i < 26; i++) {
    const ch = String.fromCharCode(65 + i);
    if (ch === "J") continue;
    if (!seen.has(ch)) {
      seen.add(ch);
      letters.push(ch);
    }
  }

  const matrix: string[][] = [];
  for (let r = 0; r < 5; r++) {
    matrix.push(letters.slice(r * 5, r * 5 + 5));
  }
  return matrix;
}

function findPosition(matrix: string[][], ch: string): [number, number] {
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (matrix[r][c] === ch) return [r, c];
    }
  }
  throw new Error(`Character '${ch}' not found in matrix.`);
}

function createDigraphs(text: string): string[] {
  const digraphs: string[] = [];
  let i = 0;
  while (i < text.length) {
    const first = text[i];
    if (i + 1 >= text.length) {
      digraphs.push(first + "X");
      i++;
    } else if (text[i] === text[i + 1]) {
      digraphs.push(first + "X");
      i++;
    } else {
      digraphs.push(first + text[i + 1]);
      i += 2;
    }
  }
  return digraphs;
}

export function encrypt(plaintext: string, key: string): string {
  if (key.replace(/[^A-Za-z]/g, "").length === 0) {
    throw new Error("Key must contain at least one alphabetic character.");
  }

  const cleanText = sanitizeText(plaintext);
  if (cleanText.length === 0) {
    throw new Error("Plaintext must contain at least one alphabetic character.");
  }

  const matrix = generateMatrix(key);
  const digraphs = createDigraphs(cleanText);
  let result = "";

  for (const pair of digraphs) {
    const [r1, c1] = findPosition(matrix, pair[0]);
    const [r2, c2] = findPosition(matrix, pair[1]);

    if (r1 === r2) {
      result += matrix[r1][(c1 + 1) % 5];
      result += matrix[r2][(c2 + 1) % 5];
    } else if (c1 === c2) {
      result += matrix[(r1 + 1) % 5][c1];
      result += matrix[(r2 + 1) % 5][c2];
    } else {
      result += matrix[r1][c2];
      result += matrix[r2][c1];
    }
  }
  return result;
}

export function decrypt(ciphertext: string, key: string): string {
  if (key.replace(/[^A-Za-z]/g, "").length === 0) {
    throw new Error("Key must contain at least one alphabetic character.");
  }

  const cleanText = sanitizeText(ciphertext);
  if (cleanText.length === 0) {
    throw new Error("Ciphertext must contain at least one alphabetic character.");
  }

  if (cleanText.length % 2 !== 0) {
    throw new Error("Ciphertext length must be even for Playfair decryption.");
  }

  const matrix = generateMatrix(key);
  let result = "";

  for (let i = 0; i < cleanText.length; i += 2) {
    const [r1, c1] = findPosition(matrix, cleanText[i]);
    const [r2, c2] = findPosition(matrix, cleanText[i + 1]);

    if (r1 === r2) {
      result += matrix[r1][(c1 + 4) % 5];
      result += matrix[r2][(c2 + 4) % 5];
    } else if (c1 === c2) {
      result += matrix[(r1 + 4) % 5][c1];
      result += matrix[(r2 + 4) % 5][c2];
    } else {
      result += matrix[r1][c2];
      result += matrix[r2][c1];
    }
  }
  return result;
}
