'use client'

import { useState } from 'react'
import { Check, AlertCircle } from 'lucide-react'

interface NewsletterFormProps {
  variant?: 'light' | 'dark'
}

export function NewsletterForm({ variant = 'light' }: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setStatus('success')
        setMessage('Thank you for subscribing!')
        setEmail('')
      } else {
        const data = await response.json()
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  const isDark = variant === 'dark'

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full border-none text-xs py-3 px-4 focus:ring-1 focus:ring-[#a1413b] focus:outline-none ${
            isDark
              ? 'bg-zinc-900 text-white placeholder:text-gray-500'
              : 'bg-gray-100 text-gray-900 placeholder:text-gray-400'
          }`}
          placeholder="Email Address"
          disabled={status === 'loading' || status === 'success'}
        />
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="bg-[#a1413b] px-4 hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {status === 'loading' ? (
            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : status === 'success' ? (
            <Check className="w-4 h-4 text-white" />
          ) : (
            <span className="material-icons text-sm text-white">send</span>
          )}
        </button>
      </div>
      {message && (
        <div
          className={`mt-3 flex items-center gap-2 text-xs ${
            status === 'success'
              ? 'text-green-400'
              : 'text-red-400'
          }`}
        >
          {status === 'error' && <AlertCircle className="w-3 h-3" />}
          {status === 'success' && <Check className="w-3 h-3" />}
          {message}
        </div>
      )}
    </form>
  )
}
