import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>

          <h1 className="text-6xl font-bold text-slate-900 mb-2">404</h1>
          <h2 className="text-xl font-semibold text-slate-700 mb-4">Page Not Found</h2>
          <p className="text-slate-600 mb-8">
            Looks like this flight path doesn&apos;t exist. The page you&apos;re looking for may have been moved or removed.
          </p>

          <div className="space-y-3 max-w-md mx-auto">
            <Link
              href="/"
              className="w-full h-12 bg-blue-600 text-white font-semibold rounded-lg
                         hover:bg-blue-700 active:bg-blue-800 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Go to Calculator
            </Link>
            <Link
              href="/airports"
              className="w-full h-11 bg-white text-slate-700 font-medium rounded-lg border border-slate-300
                         hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              Browse Airports
            </Link>
          </div>
        </div>

        {/* Popular Routes Suggestions */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <h3 className="font-semibold text-slate-900 mb-4">Popular Routes</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/distance/jfk-to-lhr" className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <span className="font-bold text-blue-600">JFK &rarr; LHR</span>
              <span className="text-sm text-slate-500">New York to London</span>
            </Link>
            <Link href="/distance/lax-to-nrt" className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <span className="font-bold text-blue-600">LAX &rarr; NRT</span>
              <span className="text-sm text-slate-500">Los Angeles to Tokyo</span>
            </Link>
            <Link href="/distance/sfo-to-sin" className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <span className="font-bold text-blue-600">SFO &rarr; SIN</span>
              <span className="text-sm text-slate-500">San Francisco to Singapore</span>
            </Link>
            <Link href="/distance/lhr-to-dxb" className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <span className="font-bold text-blue-600">LHR &rarr; DXB</span>
              <span className="text-sm text-slate-500">London to Dubai</span>
            </Link>
            <Link href="/distance/cdg-to-jfk" className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <span className="font-bold text-blue-600">CDG &rarr; JFK</span>
              <span className="text-sm text-slate-500">Paris to New York</span>
            </Link>
          </div>
        </div>

        {/* Popular Airports Suggestions */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <h3 className="font-semibold text-slate-900 mb-4">Popular Airports</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link href="/airport/jfk" className="text-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <div className="font-bold text-blue-600">JFK</div>
              <div className="text-xs text-slate-500">New York</div>
            </Link>
            <Link href="/airport/lhr" className="text-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <div className="font-bold text-blue-600">LHR</div>
              <div className="text-xs text-slate-500">London</div>
            </Link>
            <Link href="/airport/dxb" className="text-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <div className="font-bold text-blue-600">DXB</div>
              <div className="text-xs text-slate-500">Dubai</div>
            </Link>
            <Link href="/airport/nrt" className="text-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <div className="font-bold text-blue-600">NRT</div>
              <div className="text-xs text-slate-500">Tokyo</div>
            </Link>
          </div>
        </div>

        {/* Search Hint */}
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-5 text-center">
          <p className="text-slate-700 text-sm">
            Looking for a specific airport? <Link href="/airports" className="text-blue-600 hover:underline font-medium">Browse our airport directory</Link> to
            find airports by country or search by name, city, or IATA code on our <Link href="/" className="text-blue-600 hover:underline font-medium">homepage calculator</Link>.
          </p>
        </div>

        {/* Travel Planning Resources */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mt-6">
          <h3 className="font-semibold text-slate-900 mb-3">Travel Planning Resources</h3>
          <p className="text-sm text-slate-600 mb-4">While you&apos;re here, check out these useful travel resources:</p>
          <ul className="space-y-2">
            <li>
              <a href="https://www.google.com/travel/flights" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                <span className="font-medium">Google Flights</span>
                <span className="text-slate-500">&mdash; Search flight prices</span>
              </a>
            </li>
            <li>
              <a href="https://www.flightradar24.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                <span className="font-medium">Flightradar24</span>
                <span className="text-slate-500">&mdash; Track flights in real-time</span>
              </a>
            </li>
            <li>
              <a href="https://www.seatguru.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                <span className="font-medium">SeatGuru</span>
                <span className="text-slate-500">&mdash; Compare airline seats</span>
              </a>
            </li>
            <li>
              <a href="https://www.iata.org/en/publications/directories/code-search/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                <span className="font-medium">IATA Code Search</span>
                <span className="text-slate-500">&mdash; Look up airport codes</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Quick Distance Checks */}
        <div className="mt-6">
          <h3 className="font-semibold text-slate-900 mb-4">Quick Distance Checks</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/distance/lhr-to-jfk" className="bg-white rounded-xl border border-slate-200 p-4 hover:bg-slate-50 transition-colors">
              <p className="text-sm text-slate-700 mb-1">How far is London to New York?</p>
              <span className="text-xs font-bold text-blue-600">LHR &rarr; JFK</span>
            </Link>
            <Link href="/distance/nrt-to-lax" className="bg-white rounded-xl border border-slate-200 p-4 hover:bg-slate-50 transition-colors">
              <p className="text-sm text-slate-700 mb-1">How far is Tokyo to Los Angeles?</p>
              <span className="text-xs font-bold text-blue-600">NRT &rarr; LAX</span>
            </Link>
            <Link href="/distance/dxb-to-syd" className="bg-white rounded-xl border border-slate-200 p-4 hover:bg-slate-50 transition-colors">
              <p className="text-sm text-slate-700 mb-1">How far is Dubai to Sydney?</p>
              <span className="text-xs font-bold text-blue-600">DXB &rarr; SYD</span>
            </Link>
            <Link href="/distance/cdg-to-bkk" className="bg-white rounded-xl border border-slate-200 p-4 hover:bg-slate-50 transition-colors">
              <p className="text-sm text-slate-700 mb-1">How far is Paris to Bangkok?</p>
              <span className="text-xs font-bold text-blue-600">CDG &rarr; BKK</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
