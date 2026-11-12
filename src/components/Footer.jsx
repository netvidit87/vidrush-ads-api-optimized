import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="pb-6">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-center space-x-8">
          <Link
            to="/terms-of-service"
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Terms of Service
          </Link>
          <Link
            to="/report"
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Report Abuse
          </Link>
        </div>
      </div>
    </footer>
  )
}
