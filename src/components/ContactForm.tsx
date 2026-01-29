'use client'

import { useState } from 'react'

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setStatus('success')
        setStatusMessage('Thank you for your message! We will get back to you soon.')
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        })
      } else {
        setStatus('error')
        setStatusMessage('Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setStatusMessage('Something went wrong. Please try again.')
    }
  }

  const inputClass = "mt-1 block w-full border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-3 text-sm focus:border-[#a1413b] focus:outline-none focus:ring-1 focus:ring-[#a1413b] disabled:opacity-50"
  const labelClass = "block text-xs uppercase tracking-[0.2em] font-semibold text-gray-500 dark:text-gray-400"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className={labelClass}>
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          value={formData.name}
          onChange={handleChange}
          className={inputClass}
          disabled={status === 'loading'}
        />
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          required
          value={formData.email}
          onChange={handleChange}
          className={inputClass}
          disabled={status === 'loading'}
        />
      </div>

      <div>
        <label htmlFor="phone" className={labelClass}>
          Phone (optional)
        </label>
        <input
          type="tel"
          name="phone"
          id="phone"
          value={formData.phone}
          onChange={handleChange}
          className={inputClass}
          disabled={status === 'loading'}
        />
      </div>

      <div>
        <label htmlFor="subject" className={labelClass}>
          Subject
        </label>
        <select
          name="subject"
          id="subject"
          required
          value={formData.subject}
          onChange={handleChange}
          className={inputClass}
          disabled={status === 'loading'}
        >
          <option value="">Select a subject</option>
          <option value="general">General Inquiry</option>
          <option value="tenant">Tenant Question</option>
          <option value="event">Event Inquiry</option>
          <option value="leasing">Leasing Information</option>
          <option value="feedback">Feedback</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Message
        </label>
        <textarea
          name="message"
          id="message"
          rows={5}
          required
          value={formData.message}
          onChange={handleChange}
          className={inputClass}
          disabled={status === 'loading'}
        />
      </div>

      {statusMessage && (
        <div
          className={`p-4 text-xs ${
            status === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800'
          }`}
        >
          {statusMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-primary w-full"
      >
        {status === 'loading' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}
