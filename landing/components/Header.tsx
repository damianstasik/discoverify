export function Header() {
  return (
    <header>
        <div className="max-w-5xl mx-auto flex p-5 items-center justify-between">
          <a
            href="/"
            className="flex title-font font-medium items-center text-white"
          >
            <span className="w-12 h-12 p-2 rounded-full">
              <svg viewBox="0 0 24 24" className="text-emerald-400">
                <path
                  fill="currentColor"
                  d="M12 3V13.55C11.41 13.21 10.73 13 10 13C7.79 13 6 14.79 6 17S7.79 21 10 21 14 19.21 14 17V7H18V3H12Z"
                />
              </svg>
            </span>
            <span className="text-2xl">Discoverify</span>
          </a>
          <a
            href="https://go.discoverify.app"
            className="text-slate-900 inline-flex items-center bg-emerald-500 hover:bg-emerald-700 border-0 py-2 px-5 rounded text-base"
          >
            Login
            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-4 h-4 ml-1"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </header>
  );
}