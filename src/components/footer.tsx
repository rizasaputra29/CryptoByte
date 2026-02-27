export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-black">CryptoByte</span>
            <span className="text-neutral-300">·</span>
            <span className="text-sm text-neutral-500">Kriptografi Klasik</span>
          </div>
          <p className="text-sm text-neutral-400">
            Muhammad Riza Saputra - 21120123140117
          </p>
        </div>
      </div>
    </footer>
  );
}
