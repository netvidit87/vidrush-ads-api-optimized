import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="pt-3 pb-3 lg:pt-4 lg:pb-4">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className="font-semibold text-[26px] tracking-[-2px] text-gray-900">
              vidrush
            </span>
          </Link>
          <Link
            to="/"
            className="flex items-center space-x-2 px-4 py-1.5 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-colors text-[15px]"
          >
            <span>Upload</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
