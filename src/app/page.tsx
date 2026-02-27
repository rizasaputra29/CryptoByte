"use client";

import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Download, Trash2, Clock } from "lucide-react";

import * as vigenere from "@/lib/algorithms/vigenere";
import * as affine from "@/lib/algorithms/affine";
import * as playfair from "@/lib/algorithms/playfair";
import * as hill from "@/lib/algorithms/hill";
import * as enigma from "@/lib/algorithms/enigma";

type CipherType = "vigenere" | "affine" | "playfair" | "hill" | "enigma";

interface HistoryEntry {
  id: string;
  cipher: string;
  mode: string;
  input: string;
  output: string;
  key: string;
  timestamp: number;
}

const CIPHER_INFO: Record<CipherType, { label: string; badge: string; description: string }> = {
  vigenere: {
    label: "Vigenere Cipher",
    badge: "Substitution",
    description: "Polyalphabetic substitution cipher using a keyword to shift each letter.",
  },
  affine: {
    label: "Affine Cipher",
    badge: "Mathematical",
    description: "E(x) = (ax + b) mod 26. Key 'a' must be coprime with 26.",
  },
  playfair: {
    label: "Playfair Cipher",
    badge: "Digraph",
    description: "Digraph substitution using a 5×5 key matrix. J is merged into I.",
  },
  hill: {
    label: "Hill Cipher",
    badge: "Matrix",
    description: "Polygraphic cipher using a 2×2 or 3×3 key matrix multiplied mod 26.",
  },
  enigma: {
    label: "Enigma Cipher",
    badge: "Machine",
    description: "Simplified 3-rotor Enigma with historical wirings and reflector.",
  },
};

const HISTORY_KEY = "kriptocalc-history";

function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveHistoryToStorage(entries: HistoryEntry[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
}

export default function HomePage() {
  const [cipher, setCipher] = useState<CipherType>("vigenere");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Keys
  const [keyword, setKeyword] = useState("");
  const [affineA, setAffineA] = useState("5");
  const [affineB, setAffineB] = useState("8");
  const [matrixKey, setMatrixKey] = useState("3,3,2,5,0,0,0,0,0");
  const [hillSize, setHillSize] = useState<2 | 3>(2);
  const [rotorPos, setRotorPos] = useState("0,0,0");
  const [ringSet, setRingSet] = useState("0,0,0");

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const getKeyDisplay = (): string => {
    switch (cipher) {
      case "vigenere":
      case "playfair":
        return keyword;
      case "affine":
        return `a=${affineA}, b=${affineB}`;
      case "hill":
        return matrixKey;
      case "enigma":
        return `pos=${rotorPos} ring=${ringSet}`;
    }
  };

  const addToHistory = (input: string, output: string) => {
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      cipher: CIPHER_INFO[cipher].label,
      mode,
      input,
      output,
      key: getKeyDisplay(),
      timestamp: Date.now(),
    };
    const updated = [entry, ...history].slice(0, 50);
    setHistory(updated);
    saveHistoryToStorage(updated);
  };

  const doEncrypt = useCallback(() => {
    setError(null);
    try {
      let result = "";
      switch (cipher) {
        case "vigenere": result = vigenere.encrypt(inputText, keyword); break;
        case "affine": result = affine.encrypt(inputText, parseInt(affineA) || 0, parseInt(affineB) || 0); break;
        case "playfair": result = playfair.encrypt(inputText, keyword); break;
        case "hill": {
          const sliceLen = hillSize * hillSize;
          const mStr = matrixKey.split(",").slice(0, sliceLen).join(",");
          const m = hill.parseMatrixKey(mStr, hillSize);
          result = hill.encrypt(inputText, m);
          break;
        }
        case "enigma": { const c = enigma.parseEnigmaKey(`${rotorPos};${ringSet}`); result = enigma.encrypt(inputText, c); break; }
      }
      setOutputText(result);
      addToHistory(inputText, result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Encryption failed.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cipher, inputText, keyword, affineA, affineB, matrixKey, rotorPos, ringSet]);

  const doDecrypt = useCallback(() => {
    setError(null);
    try {
      let result = "";
      switch (cipher) {
        case "vigenere": result = vigenere.decrypt(inputText, keyword); break;
        case "affine": result = affine.decrypt(inputText, parseInt(affineA) || 0, parseInt(affineB) || 0); break;
        case "playfair": result = playfair.decrypt(inputText, keyword); break;
        case "hill": {
          const sliceLen = hillSize * hillSize;
          const mStr = matrixKey.split(",").slice(0, sliceLen).join(",");
          const m = hill.parseMatrixKey(mStr, hillSize);
          result = hill.decrypt(inputText, m);
          break;
        }
        case "enigma": { const c = enigma.parseEnigmaKey(`${rotorPos};${ringSet}`); result = enigma.decrypt(inputText, c); break; }
      }
      setOutputText(result);
      addToHistory(inputText, result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Decryption failed.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cipher, inputText, keyword, affineA, affineB, matrixKey, rotorPos, ringSet]);

  const handleSubmit = useCallback(() => {
    if (mode === "encrypt") doEncrypt();
    else doDecrypt();
  }, [mode, doEncrypt, doDecrypt]);

  const handleClear = () => {
    setInputText("");
    setOutputText("");
    setError(null);
  };

  const handleCopy = () => {
    if (outputText) navigator.clipboard.writeText(outputText);
  };

  const handleDownload = () => {
    if (!outputText) return;
    const content = `Algorithm: ${CIPHER_INFO[cipher].label}\nMode: ${mode}\nKey: ${getKeyDisplay()}\n\nInput:\n${inputText}\n\nOutput:\n${outputText}\n\nGenerated by CryptoByte`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cryptobyte-${cipher}-${mode}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearHistory = () => {
    setHistory([]);
    saveHistoryToStorage([]);
  };

  const deleteHistoryEntry = (id: string) => {
    const updated = history.filter((e) => e.id !== id);
    setHistory(updated);
    saveHistoryToStorage(updated);
  };

  const info = CIPHER_INFO[cipher];

  return (
    <div className="space-y-8 pt-20 md:pt-20">
      {/* Header */}
      <div className="space-y-3 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-black tracking-tight">
          Implementasi Algoritma Kriptografi Klasik
        </h1>
        <p className="mx-auto max-w-2xl text-neutral-500">
          Kalkulator enkripsi dan dekripsi berbasis web untuk algoritma kriptografi klasik.
        </p>
      </div>

      {/* Error */}
      {error && (
        <Alert variant="destructive" className="rounded-xl">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ─── Cipher Tool (spans 2 cols on lg) ─── */}
        <Card className="rounded-xl border-neutral-200 lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="text-black">{info.label}</CardTitle>
                <Badge variant="outline" className="border-neutral-300 text-neutral-500">{info.badge}</Badge>
              </div>
              <Select value={cipher} onValueChange={(v) => { setCipher(v as CipherType); setError(null); setOutputText(""); }}>
                <SelectTrigger className="w-full sm:w-[220px] rounded-xl border-neutral-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vigenere">Vigenere Cipher</SelectItem>
                  <SelectItem value="affine">Affine Cipher</SelectItem>
                  <SelectItem value="playfair">Playfair Cipher</SelectItem>
                  <SelectItem value="hill">Hill Cipher </SelectItem>
                  <SelectItem value="enigma">Enigma Cipher</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-neutral-500 mt-1">{info.description}</p>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-neutral-700">Input Text</Label>
                <span className="text-xs text-neutral-400">{inputText.replace(/[^A-Za-z]/g, "").length} chars</span>
              </div>
              <Textarea
                placeholder="Enter text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value.toUpperCase())}
                className="min-h-[100px] rounded-xl border-neutral-200 font-mono text-sm"
              />
            </div>

            {/* Key */}
            <div className="space-y-2">
              <Label className="text-neutral-700">Key</Label>
              {(cipher === "vigenere" || cipher === "playfair") && (
                <Input placeholder={cipher === "vigenere" ? "e.g., KEY" : "e.g., KEYWORD"} value={keyword} onChange={(e) => setKeyword(e.target.value.replace(/[^A-Za-z]/g, "").toUpperCase())} className="rounded-xl border-neutral-200 font-mono" />
              )}
              {cipher === "affine" && (
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="a (e.g., 5)" value={affineA} onChange={(e) => setAffineA(e.target.value.replace(/[^0-9]/g, ""))} className="rounded-xl border-neutral-200 font-mono" />
                  <Input placeholder="b (e.g., 8)" value={affineB} onChange={(e) => setAffineB(e.target.value.replace(/[^0-9]/g, ""))} className="rounded-xl border-neutral-200 font-mono" />
                </div>
              )}
              {cipher === "hill" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Label className="text-xs text-neutral-500 uppercase font-medium tracking-wide">Matrix Size</Label>
                    <div className="inline-flex rounded-xl border border-neutral-200 p-1 bg-white">
                      <button
                        onClick={() => setHillSize(2)}
                        className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                          hillSize === 2 ? "bg-black text-white" : "text-neutral-500 hover:text-black"
                        }`}
                      >
                        2×2
                      </button>
                      <button
                        onClick={() => setHillSize(3)}
                        className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                          hillSize === 3 ? "bg-black text-white" : "text-neutral-500 hover:text-black"
                        }`}
                      >
                        3×3
                      </button>
                    </div>
                  </div>

                  <div className="rounded-xl border border-neutral-200 p-4 bg-neutral-50 max-w-fit">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-3">Key Matrix</p>
                    <div className={`grid gap-2 ${hillSize === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
                      {(() => {
                        const vals = matrixKey.split(",").map(v => v.trim());
                        const total = hillSize * hillSize;
                        return Array.from({ length: total }).map((_, i) => (
                          <Input
                            key={i}
                            value={vals[i] || "0"}
                            onChange={(e) => {
                              const updated = [...vals];
                              while (updated.length < 9) updated.push("0");
                              updated[i] = e.target.value.replace(/[^0-9-]/g, "");
                              setMatrixKey(updated.join(","));
                            }}
                            className="w-14 h-14 rounded-xl border-neutral-200 bg-white font-mono text-center text-lg focus-visible:ring-1 focus-visible:ring-black focus-visible:ring-offset-0"
                          />
                        ));
                      })()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-500 font-mono">
                      det = {(() => {
                        try {
                          const sliceLen = hillSize * hillSize;
                          const mStr = matrixKey.split(",").slice(0, sliceLen).join(",");
                          const m = hill.parseMatrixKey(mStr, hillSize);
                          return hill.getDeterminant(m);
                        } catch { return "?"; }
                      })()}
                    </span>
                    <span className="text-[10px] text-neutral-300">|</span>
                    <span className={`text-[10px] font-mono ${(() => {
                      try {
                        const sliceLen = hillSize * hillSize;
                        const mStr = matrixKey.split(",").slice(0, sliceLen).join(",");
                        const m = hill.parseMatrixKey(mStr, hillSize);
                        return hill.isInvertible(m) ? "text-green-600" : "text-red-500";
                      } catch { return "text-red-500"; }
                    })()}`}>
                      {(() => {
                        try {
                          const sliceLen = hillSize * hillSize;
                          const mStr = matrixKey.split(",").slice(0, sliceLen).join(",");
                          const m = hill.parseMatrixKey(mStr, hillSize);
                          return hill.isInvertible(m) ? "✓ Mod 26 Invertible" : "✗ Not Invertible";
                        } catch { return "✗ Invalid Matrix"; }
                      })()}
                    </span>
                  </div>
                </div>
              )}
              {cipher === "enigma" && (
                <div className="space-y-3">
                  <div className="rounded-xl border border-neutral-200 p-4">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-3">Rotor Configuration</p>
                    <div className="grid grid-cols-3 gap-3">
                      {["I", "II", "III"].map((rotor, idx) => {
                        const posVals = rotorPos.split(",").map(v => parseInt(v.trim()) || 0);
                        const ringVals = ringSet.split(",").map(v => parseInt(v.trim()) || 0);
                        return (
                          <div key={rotor} className="rounded-lg border border-neutral-100 bg-neutral-50 p-3 text-center space-y-2">
                            <p className="text-xs font-semibold text-black">Rotor {rotor}</p>
                            <div className="space-y-1">
                              <label className="text-[10px] text-neutral-400 block">Position</label>
                              <Input
                                value={posVals[idx]?.toString() || "0"}
                                onChange={(e) => {
                                  const updated = [...posVals];
                                  while (updated.length < 3) updated.push(0);
                                  updated[idx] = parseInt(e.target.value) || 0;
                                  setRotorPos(updated.join(","));
                                }}
                                className="rounded-lg border-neutral-200 font-mono text-center text-lg h-10"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-neutral-400 block">Ring</label>
                              <Input
                                value={ringVals[idx]?.toString() || "0"}
                                onChange={(e) => {
                                  const updated = [...ringVals];
                                  while (updated.length < 3) updated.push(0);
                                  updated[idx] = parseInt(e.target.value) || 0;
                                  setRingSet(updated.join(","));
                                }}
                                className="rounded-lg border-neutral-200 font-mono text-center text-lg h-10"
                              />
                            </div>
                            <p className="text-[10px] text-neutral-400 font-mono">
                              {String.fromCharCode(65 + ((posVals[idx] || 0) % 26))}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-neutral-400 mt-3">
                      Positions and ring settings: 0–25 (A–Z). Signal path: → III → II → I → Reflector → I → II → III →
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Mode toggle + Submit */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex rounded-xl border border-neutral-200 p-1">
                <button
                  onClick={() => setMode("encrypt")}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${mode === "encrypt" ? "bg-black text-white" : "text-neutral-500 hover:text-black"}`}
                >
                  Encrypt
                </button>
                <button
                  onClick={() => setMode("decrypt")}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${mode === "decrypt" ? "bg-black text-white" : "text-neutral-500 hover:text-black"}`}
                >
                  Decrypt
                </button>
              </div>
              <Button onClick={handleSubmit} className="rounded-xl bg-black text-white hover:bg-neutral-800">
                Submit
              </Button>
              <Button onClick={handleClear} variant="outline" className="rounded-xl border-neutral-200 text-neutral-500">
                Clear
              </Button>
            </div>

            {/* Output */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-neutral-700">Output</Label>
                <span className="text-xs text-neutral-400">{outputText.length} chars</span>
              </div>
              <Textarea value={outputText} readOnly placeholder="Result will appear here..." className="min-h-[100px] rounded-xl border-neutral-200 bg-neutral-50 font-mono text-sm" />
              <div className="flex gap-2">
                <Button onClick={handleCopy} variant="outline" size="sm" className="rounded-xl border-neutral-200 text-neutral-600 gap-1.5" disabled={!outputText}>
                  <Copy size={14} /> Copy
                </Button>
                <Button onClick={handleDownload} variant="outline" size="sm" className="rounded-xl border-neutral-200 text-neutral-600 gap-1.5" disabled={!outputText}>
                  <Download size={14} /> Download TXT
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ─── History Sidebar ─── */}
        <Card className="rounded-xl border-neutral-200 lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-neutral-500" />
                <CardTitle className="text-black text-base">History</CardTitle>
              </div>
              {history.length > 0 && (
                <Button onClick={clearHistory} variant="ghost" size="sm" className="text-neutral-400 hover:text-red-500 h-7 text-xs gap-1">
                  <Trash2 size={12} /> Clear
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <p className="text-sm text-neutral-400 text-center py-8">No history yet.</p>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {history.map((entry) => (
                  <div key={entry.id} className="group relative rounded-lg border border-neutral-100 p-3 hover:border-neutral-200 transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <Badge variant="outline" className="border-neutral-200 text-neutral-500 text-[10px] px-1.5 py-0">
                        {entry.cipher}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-neutral-400 uppercase font-medium">
                          {entry.mode}
                        </span>
                        <button
                          onClick={() => deleteHistoryEntry(entry.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 text-neutral-300 hover:text-red-500"
                          aria-label="Delete"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    <p className="font-mono text-xs text-neutral-600 truncate">{entry.input}</p>
                    <p className="font-mono text-xs text-black truncate font-medium">→ {entry.output}</p>
                    <p className="text-[10px] text-neutral-300 mt-1">
                      {new Date(entry.timestamp).toLocaleString("id-ID")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
