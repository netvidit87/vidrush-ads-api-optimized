import { useParams, useSearchParams, Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { getVideoUrl } from '../config'

export default function VideoPlayer() {
  const { id: paramId } = useParams()
  const [searchParams] = useSearchParams()
  const id = paramId || searchParams.get('id') || searchParams.get('v') || ''
  const videoSrc = getVideoUrl(id)

  const videoRef = useRef(null)
  const adContainerRef = useRef(null)
  const [copied, setCopied] = useState(false)

  // Semua iklan hanya dari API (tidak ada hardcoded)
  useEffect(() => {
    if (!adContainerRef.current) return

    const getAdGroup = () => {
      try {
        let adGroup = localStorage.getItem('ad_group')
        if (!adGroup) {
          adGroup = String(Math.floor(Math.random() * 100) + 1)
          localStorage.setItem('ad_group', adGroup)
        }
        return parseInt(adGroup, 10)
      } catch {
        return Math.floor(Math.random() * 100) + 1
      }
    }

    const uploader = (() => {
      try {
        return localStorage.getItem('uploader') || 'false'
      } catch {
        return 'false'
      }
    })()

    const width = window.screen?.width || window.innerWidth || 360
    const adGroup = getAdGroup()
    const apiUrl = `/api/ad_type?uploader=${uploader}&width=${width}&ad_group=${adGroup}`

    const controller = new AbortController()

    fetch(apiUrl, {
      method: 'GET',
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    })
      .then((r) => {
        if (!r.ok) throw new Error('ad api failed')
        return r.json()
      })
      .then((data) => {
        if (!adContainerRef.current || !data) return

        // Bersihkan container
        adContainerRef.current.innerHTML = ''

        const banner =
          data.banner_300x250 ||
          data['300x250'] ||
          data.code ||
          ''

        if (!banner) return

        // Inject HTML + jalankan script dengan benar
        const wrapper = document.createElement('div')
        wrapper.innerHTML = banner

        // Script dari innerHTML tidak auto-execute → buat ulang
        const scripts = Array.from(wrapper.querySelectorAll('script'))
        scripts.forEach((oldScript) => {
          const newScript = document.createElement('script')

          // copy attributes
          Array.from(oldScript.attributes).forEach((attr) => {
            newScript.setAttribute(attr.name, attr.value)
          })

          if (oldScript.src) {
            newScript.src = oldScript.src
            newScript.async = true
          } else {
            newScript.textContent = oldScript.textContent
          }

          // ganti script lama dengan yang baru
          oldScript.parentNode?.replaceChild(newScript, oldScript)
        })

        adContainerRef.current.appendChild(wrapper)
      })
      .catch(() => {
        // silent fail – jangan ganggu pengalaman video
      })

    return () => controller.abort()
  }, [id])

  useEffect(() => {
    document.title = id ? `VidRush - ${id}` : 'VidRush'
  }, [id])

  useEffect(() => {
    const v = videoRef.current
    if (!v || !videoSrc) return
    v.play()?.catch(() => {})
  }, [videoSrc])

  const handleShare = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: 'VidRush', url })
      } else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {}
  }

  return (
    <div className="min-h-screen">
      <div className="min-h-screen flex flex-col">
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

        <div className="w-full max-w-[720px] mx-auto flex-grow px-0 md:px-4 md:mt-3">
          <div className="w-full flex justify-center">
            <div className="w-full">
              {videoSrc ? (
                <video
                  ref={videoRef}
                  key={videoSrc}
                  className="w-full md:rounded-[8px]"
                  style={{ maxHeight: '520px' }}
                  controls
                  autoPlay
                  playsInline
                  src={videoSrc}
                />
              ) : (
                <div className="w-full aspect-video bg-black md:rounded-[8px] flex items-center justify-center text-white text-sm">
                  Video not found
                </div>
              )}
            </div>
          </div>

          <div className="w-full flex flex-col items-center mt-4 mb-0">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center justify-center whitespace-nowrap text-sm transition-colors focus-visible:outline-none text-secondary-foreground shadow-sm h-9 py-2 rounded-full px-6 gap-2 bg-gray-100 hover:bg-gray-200 font-semibold"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
              {copied ? 'Copied!' : 'Share video'}
            </button>
          </div>

          {/* Container iklan – semua diisi dari /api/ad_type */}
          <div ref={adContainerRef} className="as mt-4 flex flex-col items-center" />
        </div>

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
      </div>
    </div>
  )
}
