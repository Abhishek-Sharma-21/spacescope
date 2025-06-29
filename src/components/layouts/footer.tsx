'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="w-full py-8 px-4 bg-black border-t border-gray-800 text-center text-gray-400 text-sm mt-16">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          © {new Date().getFullYear()} SPACESCOPE. All rights reserved.
        </div>
        <div>
          Powered by public data from{' '}
          <Link
            href="https://api.nasa.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            NASA Open APIs
          </Link>
        </div>
      </div>
    </footer>
  )
}