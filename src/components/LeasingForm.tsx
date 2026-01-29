'use client'

import { useState } from 'react'

export function LeasingForm() {
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    businessType: '',
    spaceRequirements: '',
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
      const response = await fetch('/api/leasing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setStatus('success')
        setStatusMessage('Thank you for your interest! Our leasing team will contact you soon.')
        setFormData({
          businessName: '',
          contactName: '',
          email: '',
          phone: '',
          businessType: '',
          spaceRequirements: '',
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="businessName" className={labelClass}>
          Business Name
        </label>
        <input
          type="text"
          name="businessName"
          id="businessName"
          required
          value={formData.businessName}
          onChange={handleChange}
          className={inputClass}
          disabled={status === 'loading'}
        />
      </div>

      <div>
        <label htmlFor="contactName" className={labelClass}>
          Contact Name
        </label>
        <input
          type="text"
          name="contactName"
          id="contactName"
          required
          value={formData.contactName}
          onChange={handleChange}
          className={inputClass}
          disabled={status === 'loading'}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
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
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className={inputClass}
            disabled={status === 'loading'}
          />
        </div>
      </div>

      <div>
        <label htmlFor="businessType" className={labelClass}>
          Business Type
        </label>
        <select
          name="businessType"
          id="businessType"
          required
          value={formData.businessType}
          onChange={handleChange}
          className={inputClass}
          disabled={status === 'loading'}
        >
          <option value="">Select business type</option>
          <option value="restaurant">Restaurant</option>
          <option value="retail">Retail</option>
          <option value="service">Service</option>
          <option value="fitness">Fitness/Health</option>
          <option value="entertainment">Entertainment</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="spaceRequirements" className={labelClass}>
          Space Requirements (sq ft)
        </label>
        <input
          type="text"
          name="spaceRequirements"
          id="spaceRequirements"
          placeholder="e.g., 1,000-2,000"
          value={formData.spaceRequirements}
          onChange={handleChange}
          className={inputClass}
          disabled={status === 'loading'}
        />
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Additional Information
        </label>
        <textarea
          name="message"
          id="message"
          rows={4}
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
        {status === 'loading' ? 'Submitting...' : 'Submit Inquiry'}
      </button>
    </form>
  )
}
