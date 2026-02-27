import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { PageTransition } from "@/components/PageTransition";

const SECTIONS = [
  { id: "vigenere", title: "1. Vigenere Cipher" },
  { id: "affine", title: "2. Affine Cipher" },
  { id: "playfair", title: "3. Playfair Cipher" },
  { id: "hill", title: "4. Hill Cipher" },
  { id: "enigma", title: "5. Enigma Cipher" },
];

export default function DocumentationPage() {
  return (
    <PageTransition className="pt-16 md:pt-20 pb-12">
      {/* Header */}
      <div className="mb-12 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-bold font-sans text-black mb-4">
          Dokumentasi
        </h1>
        <p className="text-neutral-500 text-lg">
          Teori, rumus, dan contoh manual untuk setiap algoritma kriptografi klasik yang diimplementasikan pada CryptoByte.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Navigation Sidebar */}
        <nav className="w-full lg:w-64 shrink-0 lg:sticky lg:top-32 order-last lg:order-first border-t lg:border-t-0 lg:border-r border-neutral-200 pt-8 lg:pt-0 lg:pr-8">
          <p className="font-semibold text-black mb-4 text-sm uppercase tracking-wider">Daftar Isi</p>
          <ul className="space-y-3">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <Link
                  href={`#${s.id}`}
                  className="text-neutral-500 hover:text-black transition-colors text-sm font-medium block"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <article className="prose max-w-none prose-neutral prose-headings:text-black prose-p:text-neutral-600 prose-strong:text-black prose-code:text-black prose-code:bg-neutral-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none prose-table:border-collapse prose-th:border prose-th:border-neutral-200 prose-th:p-2 prose-th:bg-neutral-50 prose-td:border prose-td:border-neutral-200 prose-td:p-2">

            {/* ─── Vigenere ─── */}
            <section id="vigenere" className="mb-16 scroll-mt-32">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <h2 className="mb-0! mt-0!">1. Vigenere Cipher</h2>
                <Badge variant="outline" className="border-neutral-300 text-neutral-500">Substitution</Badge>
              </div>

              <h3>Teori</h3>
              <p>
                Vigenere Cipher adalah cipher substitusi polialfabetik yang menggunakan sebuah kata kunci
                untuk menggeser setiap huruf plaintext dengan jumlah yang berbeda-beda. Setiap huruf pada
                kata kunci menentukan besar pergeseran untuk huruf plaintext pada posisi yang bersesuaian.
              </p>

              <h3>Rumus</h3>
              <ul>
                <li><strong>Enkripsi:</strong> <code>Ci = (Pi + Ki) mod 26</code></li>
                <li><strong>Dekripsi:</strong> <code>Pi = (Ci - Ki + 26) mod 26</code></li>
              </ul>
              <p className="text-sm">Dimana <code>Pi</code> adalah huruf plaintext, <code>Ki</code> adalah huruf kunci pada posisi <code>i mod panjang_kunci</code>, dan <code>Ci</code> adalah huruf ciphertext.</p>

              <h3>Contoh Manual</h3>
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 my-6">
                <p className="mb-4 mt-0"><strong>Plaintext:</strong> HELLO &nbsp;&nbsp;|&nbsp;&nbsp; <strong>Key:</strong> KEY</p>
                <div className="overflow-x-auto">
                  <table className="mt-0 mb-0 min-w-full text-sm">
                    <thead>
                      <tr><th>Plaintext</th><th>H</th><th>E</th><th>L</th><th>L</th><th>O</th></tr>
                    </thead>
                    <tbody>
                      <tr><td>Nilai P</td><td>7</td><td>4</td><td>11</td><td>11</td><td>14</td></tr>
                      <tr><td>Key</td><td>K</td><td>E</td><td>Y</td><td>K</td><td>E</td></tr>
                      <tr><td>Nilai K</td><td>10</td><td>4</td><td>24</td><td>10</td><td>4</td></tr>
                      <tr><td>(P+K) mod 26</td><td>17</td><td>8</td><td>9</td><td>21</td><td>18</td></tr>
                      <tr><td>Ciphertext</td><td>R</td><td>I</td><td>J</td><td>V</td><td>S</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 mb-0"><strong>Hasil:</strong> <code>HELLO</code> → <code>RIJVS</code></p>
              </div>
            </section>

            <hr className="border-neutral-200 my-12" />

            {/* ─── Affine ─── */}
            <section id="affine" className="mb-16 scroll-mt-32">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <h2 className="mb-0! mt-0!">2. Affine Cipher</h2>
                <Badge variant="outline" className="border-neutral-300 text-neutral-500">Mathematical</Badge>
              </div>

              <h3>Teori</h3>
              <p>
                Affine Cipher adalah cipher substitusi monoalfabetik yang menggunakan fungsi matematika
                linear untuk mengenkripsi setiap huruf. Kunci terdiri dari dua bilangan bulat <code>a</code> dan <code>b</code>,
                dimana <code>a</code> harus coprime (relatif prima) terhadap 26.
              </p>

              <h3>Rumus</h3>
              <ul>
                <li><strong>Enkripsi:</strong> <code>E(x) = (a·x + b) mod 26</code></li>
                <li><strong>Dekripsi:</strong> <code>D(y) = a⁻¹·(y - b) mod 26</code></li>
              </ul>
              <p className="text-sm">Nilai <code>a</code> yang valid (coprime dengan 26): 1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25.</p>

              <h3>Contoh Manual</h3>
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 my-6">
                <p className="mb-4 mt-0"><strong>Plaintext:</strong> HELLO &nbsp;&nbsp;|&nbsp;&nbsp; <strong>a = 5, b = 8</strong></p>
                <div className="overflow-x-auto">
                  <table className="mt-0 mb-0 min-w-full text-sm">
                    <thead>
                      <tr><th>Huruf</th><th>x</th><th>(5x + 8) mod 26</th><th>Ciphertext</th></tr>
                    </thead>
                    <tbody>
                      <tr><td>H</td><td>7</td><td>(35 + 8) mod 26 = 17</td><td>R</td></tr>
                      <tr><td>E</td><td>4</td><td>(20 + 8) mod 26 = 2</td><td>C</td></tr>
                      <tr><td>L</td><td>11</td><td>(55 + 8) mod 26 = 11</td><td>L</td></tr>
                      <tr><td>L</td><td>11</td><td>(55 + 8) mod 26 = 11</td><td>L</td></tr>
                      <tr><td>O</td><td>14</td><td>(70 + 8) mod 26 = 0</td><td>A</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 mb-0"><strong>Hasil:</strong> <code>HELLO</code> → <code>RCLLA</code></p>
              </div>
            </section>

            <hr className="border-neutral-200 my-12" />

            {/* ─── Playfair ─── */}
            <section id="playfair" className="mb-16 scroll-mt-32">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <h2 className="mb-0! mt-0!">3. Playfair Cipher</h2>
                <Badge variant="outline" className="border-neutral-300 text-neutral-500">Digraph</Badge>
              </div>

              <h3>Teori</h3>
              <p>
                Playfair Cipher mengenkripsi pasangan huruf (digraph) menggunakan matriks kunci 5×5.
                Huruf <strong>J</strong> gabungkan dengan <strong>I</strong>. Plaintext dipisahkan menjadi pasangan-pasangan, dan jika
                dua huruf yang sama berdampingan, huruf <strong>X</strong> disisipkan sebagai pemisah.
              </p>

              <h3>Aturan Enkripsi</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Same row:</strong> Ganti setiap huruf dengan huruf di kanannya (wrapping).</li>
                <li><strong>Same column:</strong> Ganti setiap huruf dengan huruf di bawahnya (wrapping).</li>
                <li><strong>Rectangle:</strong> Ganti setiap huruf dengan huruf di baris yang sama, tetapi di kolom pasangannya.</li>
              </ul>

              <h3>Contoh Manual</h3>
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 my-6">
                <p className="mb-4 mt-0"><strong>Plaintext:</strong> HELLO &nbsp;&nbsp;|&nbsp;&nbsp; <strong>Key:</strong> KEYWORD</p>
                <p className="text-sm font-semibold mb-2 mt-0">Matriks 5×5:</p>
                <div className="overflow-x-auto mb-4">
                  <table className="mt-0 mb-0 border-none">
                    <tbody className="font-mono text-center">
                      <tr><td>K</td><td>E</td><td>Y</td><td>W</td><td>O</td></tr>
                      <tr><td>R</td><td>D</td><td>A</td><td>B</td><td>C</td></tr>
                      <tr><td>F</td><td>G</td><td>H</td><td>I</td><td>L</td></tr>
                      <tr><td>M</td><td>N</td><td>P</td><td>Q</td><td>S</td></tr>
                      <tr><td>T</td><td>U</td><td>V</td><td>X</td><td>Z</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm">Digraphs: <code>HE</code> <code>LX</code> <code>LO</code> → Dieksekusi berdasarkan posisi matriks.</p>
              </div>
            </section>

            <hr className="border-neutral-200 my-12" />

            {/* ─── Hill ─── */}
            <section id="hill" className="mb-16 scroll-mt-32">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <h2 className="mb-0! mt-0!">4. Hill Cipher</h2>
                <Badge variant="outline" className="border-neutral-300 text-neutral-500">Matrix</Badge>
              </div>

              <h3>Teori</h3>
              <p>
                Hill Cipher adalah cipher poligrafik yang menggunakan aljabar linear. Setiap blok huruf
                plaintext direpresentasikan sebagai vektor dan dikalikan dengan matriks kunci mod 26.
                Matriks kunci harus invertible (memiliki invers) dalam modular 26.
              </p>

              <h3>Rumus</h3>
              <ul>
                <li><strong>Enkripsi:</strong> <code>C = K × P mod 26</code></li>
                <li><strong>Dekripsi:</strong> <code>P = K⁻¹ × C mod 26</code></li>
              </ul>
              <p className="text-sm text-red-600">Catatan: Determinan matriks harus coprime dengan 26 agar matriks bisa diinverskan.</p>

              <h3>Contoh Manual (2×2)</h3>
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 my-6">
                <p className="mb-4 mt-0"><strong>Plaintext:</strong> HELP &nbsp;&nbsp;|&nbsp;&nbsp; <strong>Key Matrix:</strong> [[3, 3], [2, 5]]</p>
                
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="font-semibold mb-1">Blok 1: HE → [7, 4]</p>
                    <ul className="list-inside list-disc mt-0 text-neutral-600">
                      <li>(3×7 + 3×4) mod 26 = 33 mod 26 = 7 → <strong>H</strong></li>
                      <li>(2×7 + 5×4) mod 26 = 34 mod 26 = 8 → <strong>I</strong></li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-1 mt-0">Blok 2: LP → [11, 15]</p>
                    <ul className="list-inside list-disc mt-0 text-neutral-600">
                      <li>(3×11 + 3×15) mod 26 = 78 mod 26 = 0 → <strong>A</strong></li>
                      <li>(2×11 + 5×15) mod 26 = 97 mod 26 = 19 → <strong>T</strong></li>
                    </ul>
                  </div>
                </div>
                <p className="mt-4 mb-0"><strong>Hasil:</strong> <code>HELP</code> → <code>HIAT</code></p>
              </div>
            </section>

            <hr className="border-neutral-200 my-12" />

            {/* ─── Enigma ─── */}
            <section id="enigma" className="mb-16 scroll-mt-32">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <h2 className="mb-0! mt-0!">5. Enigma Cipher</h2>
                <Badge variant="outline" className="border-neutral-300 text-neutral-500">Machine</Badge>
              </div>

              <h3>Teori</h3>
              <p>
                Mesin Enigma adalah mesin cipher elektromekanis yang digunakan Jerman pada Perang Dunia II.
                KriptoCalc mensimulasikan versi sederhana dengan 3 rotor (I, II, III), Reflektor B,
                dan mekanisme double-stepping historis.
              </p>

              <h3>Komponen & Proses</h3>
              <ul className="space-y-2">
                <li><strong>Rotor:</strong> 3 piringan berputar dengan kabel internal bersilang yang menggantikan substitusi statis.</li>
                <li><strong>Reflector:</strong> Mengirim sinyal kembali melalui rotor, menjamin prosesnya <em>self-reciprocal</em>.</li>
                <li><strong>Stepping:</strong> Rotor berputar sebelum setiap huruf, mengubah jalur sirkuit secara geometris untuk setiap karakter baru.</li>
              </ul>

              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 my-6">
                <p className="font-semibold text-black mb-2 mt-0">Properti Self-Reciprocal</p>
                <p className="text-sm m-0">
                  Karena keberadaan reflektor (Reflector B), fungsi mesin bersifat simetris. Mengenkripsi <code>A</code> 
                  menghasilkan <code>X</code>, dan dengan setelan rotor yang identik, mengenkripsi <code>X</code> 
                  akan menghasilkan <code>A</code>. Proses dekripsi sepenuhnya identik dengan proses enkripsi.
                </p>
              </div>
            </section>
          </article>
        </div>
      </div>
    </PageTransition>
  );
}
