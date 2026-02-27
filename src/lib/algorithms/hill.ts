// ============================================
// Hill Cipher (2×2 and 3×3 matrix)
// E(P) = K * P mod 26
// D(C) = K^(-1) * C mod 26
// ============================================

export type HillMatrix = number[][];

function sanitizeText(text: string): string {
  return text.replace(/[^A-Za-z]/g, "").toUpperCase();
}

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

function modInverse(a: number, m: number): number {
  a = mod(a, m);
  for (let x = 1; x < m; x++) {
    if ((a * x) % m === 1) return x;
  }
  throw new Error(`No modular inverse for ${a} mod ${m}`);
}

// ─── Determinant (recursive, works for any NxN) ───

function determinant(matrix: HillMatrix): number {
  const n = matrix.length;
  if (n === 1) return matrix[0][0];
  if (n === 2) {
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  }

  let det = 0;
  for (let col = 0; col < n; col++) {
    const minor = getMinor(matrix, 0, col);
    det += (col % 2 === 0 ? 1 : -1) * matrix[0][col] * determinant(minor);
  }
  return det;
}

function getMinor(matrix: HillMatrix, row: number, col: number): HillMatrix {
  return matrix
    .filter((_, r) => r !== row)
    .map((r) => r.filter((_, c) => c !== col));
}

// ─── Matrix Inverse mod 26 ───

function adjugate(matrix: HillMatrix): HillMatrix {
  const n = matrix.length;
  const adj: HillMatrix = Array.from({ length: n }, () => Array(n).fill(0));

  if (n === 1) {
    adj[0][0] = 1;
    return adj;
  }

  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const minor = getMinor(matrix, r, c);
      const cofactor = ((r + c) % 2 === 0 ? 1 : -1) * determinant(minor);
      adj[c][r] = cofactor; // transposed
    }
  }
  return adj;
}

function invertMatrix(matrix: HillMatrix): HillMatrix {
  const n = matrix.length;
  const det = mod(determinant(matrix), 26);

  if (det === 0) {
    throw new Error("Matrix determinant is 0. Matrix is not invertible.");
  }

  let detInv: number;
  try {
    detInv = modInverse(det, 26);
  } catch {
    throw new Error(
      `Matrix determinant (${det}) has no modular inverse mod 26. Matrix is not invertible.`
    );
  }

  const adj = adjugate(matrix);
  const inv: HillMatrix = Array.from({ length: n }, () => Array(n).fill(0));

  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      inv[r][c] = mod(detInv * adj[r][c], 26);
    }
  }
  return inv;
}

// ─── Validation ───

export function validateMatrix(matrix: HillMatrix): void {
  const n = matrix.length;
  if (n !== 2 && n !== 3) {
    throw new Error("Matrix must be 2×2 or 3×3.");
  }
  for (let r = 0; r < n; r++) {
    if (matrix[r].length !== n) {
      throw new Error(`Row ${r} has ${matrix[r].length} elements, expected ${n}.`);
    }
    for (let c = 0; c < n; c++) {
      if (!Number.isInteger(matrix[r][c])) {
        throw new Error("All matrix values must be integers.");
      }
    }
  }
  const det = mod(determinant(matrix), 26);
  if (det === 0) {
    throw new Error("Matrix determinant is 0. Matrix is not invertible mod 26.");
  }
  try {
    modInverse(det, 26);
  } catch {
    throw new Error(
      `Matrix determinant (${det}) is not coprime with 26. Matrix is not invertible.`
    );
  }
}

// ─── Parse key string ───

export function parseMatrixKey(keyStr: string, size: number = 2): HillMatrix {
  const total = size * size;
  const nums = keyStr
    .split(/[\s,]+/)
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !isNaN(n));

  if (nums.length !== total) {
    throw new Error(
      `Matrix key must contain exactly ${total} integers for a ${size}×${size} matrix.`
    );
  }

  const matrix: HillMatrix = [];
  for (let r = 0; r < size; r++) {
    const row: number[] = [];
    for (let c = 0; c < size; c++) {
      row.push(mod(nums[r * size + c], 26));
    }
    matrix.push(row);
  }
  return matrix;
}

// ─── Get determinant for display ───

export function getDeterminant(matrix: HillMatrix): number {
  return determinant(matrix);
}

export function getDetMod26(matrix: HillMatrix): number {
  return mod(determinant(matrix), 26);
}

export function isInvertible(matrix: HillMatrix): boolean {
  const det = mod(determinant(matrix), 26);
  const coprimes = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];
  return coprimes.includes(det);
}

// ─── Encrypt / Decrypt ───

function multiplyBlock(matrix: HillMatrix, block: number[]): number[] {
  const n = matrix.length;
  const result: number[] = [];
  for (let r = 0; r < n; r++) {
    let sum = 0;
    for (let c = 0; c < n; c++) {
      sum += matrix[r][c] * block[c];
    }
    result.push(mod(sum, 26));
  }
  return result;
}

export function encrypt(plaintext: string, matrix: HillMatrix): string {
  validateMatrix(matrix);
  const n = matrix.length;
  let cleanText = sanitizeText(plaintext);

  if (cleanText.length === 0) {
    throw new Error("Plaintext must contain at least one alphabetic character.");
  }

  // Pad with X if not divisible by block size
  while (cleanText.length % n !== 0) {
    cleanText += "X";
  }

  let result = "";
  for (let i = 0; i < cleanText.length; i += n) {
    const block = [];
    for (let j = 0; j < n; j++) {
      block.push(cleanText.charCodeAt(i + j) - 65);
    }
    const encrypted = multiplyBlock(matrix, block);
    result += encrypted.map((v) => String.fromCharCode(v + 65)).join("");
  }
  return result;
}

export function decrypt(ciphertext: string, matrix: HillMatrix): string {
  validateMatrix(matrix);
  const n = matrix.length;
  const cleanText = sanitizeText(ciphertext);

  if (cleanText.length === 0) {
    throw new Error("Ciphertext must contain at least one alphabetic character.");
  }

  if (cleanText.length % n !== 0) {
    throw new Error(
      `Ciphertext length must be divisible by ${n} for Hill ${n}×${n} decryption.`
    );
  }

  const invMatrix = invertMatrix(matrix);
  let result = "";

  for (let i = 0; i < cleanText.length; i += n) {
    const block = [];
    for (let j = 0; j < n; j++) {
      block.push(cleanText.charCodeAt(i + j) - 65);
    }
    const decrypted = multiplyBlock(invMatrix, block);
    result += decrypted.map((v) => String.fromCharCode(v + 65)).join("");
  }
  return result;
}
