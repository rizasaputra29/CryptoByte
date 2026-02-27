// ============================================
// Enigma Cipher (Simplified 3-Rotor)
// ============================================

// Historical rotor wirings (Enigma I)
const ROTORS: string[] = [
  "EKMFLGDQVZNTOWYHXUSPAIBRCJ", // Rotor I
  "AJDKSIRUXBLHWTMCQGZNPYFVOE", // Rotor II
  "BDFHJLCPRTXVZNYEIWGAKMUSQO", // Rotor III
];

const ROTOR_NOTCHES: string[] = ["Q", "E", "V"]; // Turnover positions

const REFLECTOR = "YRUHQSLDPXNGOKMIEBFZCWVJAT"; // Reflector B

function sanitizeText(text: string): string {
  return text.replace(/[^A-Za-z]/g, "").toUpperCase();
}

export interface EnigmaConfig {
  rotorPositions: [number, number, number]; // 0-25 for each rotor
  ringSettings: [number, number, number];   // 0-25 for each rotor
}

export function validateConfig(config: EnigmaConfig): void {
  for (let i = 0; i < 3; i++) {
    if (
      !Number.isInteger(config.rotorPositions[i]) ||
      config.rotorPositions[i] < 0 ||
      config.rotorPositions[i] > 25
    ) {
      throw new Error(`Rotor position ${i + 1} must be an integer between 0 and 25.`);
    }
    if (
      !Number.isInteger(config.ringSettings[i]) ||
      config.ringSettings[i] < 0 ||
      config.ringSettings[i] > 25
    ) {
      throw new Error(`Ring setting ${i + 1} must be an integer between 0 and 25.`);
    }
  }
}

export function parseEnigmaKey(keyStr: string): EnigmaConfig {
  // Format: "pos1,pos2,pos3;ring1,ring2,ring3" or "pos1,pos2,pos3"
  const parts = keyStr.split(";").map((s) => s.trim());
  const positions = parts[0]
    .split(/[\s,]+/)
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !isNaN(n));

  if (positions.length !== 3) {
    throw new Error(
      "Enigma key must have 3 rotor positions (e.g., '0,0,0' or '0,0,0;0,0,0')."
    );
  }

  let rings: number[] = [0, 0, 0];
  if (parts.length > 1) {
    rings = parts[1]
      .split(/[\s,]+/)
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));
    if (rings.length !== 3) {
      throw new Error("Ring settings must have 3 values (e.g., '0,0,0').");
    }
  }

  return {
    rotorPositions: [positions[0], positions[1], positions[2]],
    ringSettings: [rings[0], rings[1], rings[2]],
  };
}

class EnigmaMachine {
  private positions: [number, number, number];
  private ringSettings: [number, number, number];

  constructor(config: EnigmaConfig) {
    validateConfig(config);
    this.positions = [...config.rotorPositions];
    this.ringSettings = [...config.ringSettings];
  }

  private stepRotors(): void {
    // Double stepping mechanism
    const middleAtNotch =
      String.fromCharCode(this.positions[1] + 65) === ROTOR_NOTCHES[1];
    const rightAtNotch =
      String.fromCharCode(this.positions[2] + 65) === ROTOR_NOTCHES[2];

    if (middleAtNotch) {
      this.positions[0] = (this.positions[0] + 1) % 26;
      this.positions[1] = (this.positions[1] + 1) % 26;
    } else if (rightAtNotch) {
      this.positions[1] = (this.positions[1] + 1) % 26;
    }

    this.positions[2] = (this.positions[2] + 1) % 26;
  }

  private passThrough(ch: number, rotor: number, forward: boolean): number {
    const wiring = ROTORS[rotor];
    const pos = this.positions[rotor];
    const ring = this.ringSettings[rotor];

    if (forward) {
      const input = (ch + pos - ring + 26) % 26;
      const output = wiring.charCodeAt(input) - 65;
      return (output - pos + ring + 26) % 26;
    } else {
      const input = (ch + pos - ring + 26) % 26;
      const output = wiring.indexOf(String.fromCharCode(input + 65));
      return (output - pos + ring + 26) % 26;
    }
  }

  private encryptChar(ch: number): number {
    this.stepRotors();

    // Forward through rotors (right to left: 2, 1, 0)
    let signal = ch;
    signal = this.passThrough(signal, 2, true);
    signal = this.passThrough(signal, 1, true);
    signal = this.passThrough(signal, 0, true);

    // Reflector
    signal = REFLECTOR.charCodeAt(signal) - 65;

    // Backward through rotors (left to right: 0, 1, 2)
    signal = this.passThrough(signal, 0, false);
    signal = this.passThrough(signal, 1, false);
    signal = this.passThrough(signal, 2, false);

    return signal;
  }

  process(text: string): string {
    let result = "";
    for (const ch of text) {
      const num = ch.charCodeAt(0) - 65;
      const encrypted = this.encryptChar(num);
      result += String.fromCharCode(encrypted + 65);
    }
    return result;
  }
}

export function encrypt(plaintext: string, config: EnigmaConfig): string {
  const cleanText = sanitizeText(plaintext);
  if (cleanText.length === 0) {
    throw new Error("Plaintext must contain at least one alphabetic character.");
  }
  validateConfig(config);
  const machine = new EnigmaMachine(config);
  return machine.process(cleanText);
}

export function decrypt(ciphertext: string, config: EnigmaConfig): string {
  // Enigma is self-reciprocal: decrypt = encrypt with same settings
  const cleanText = sanitizeText(ciphertext);
  if (cleanText.length === 0) {
    throw new Error("Ciphertext must contain at least one alphabetic character.");
  }
  validateConfig(config);
  const machine = new EnigmaMachine(config);
  return machine.process(cleanText);
}
