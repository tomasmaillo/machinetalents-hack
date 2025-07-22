'use client'
import { useState } from 'react'

export default function Home() {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [researchQuery, setResearchQuery] = useState('')
  const [researchResult, setResearchResult] = useState('')
  const [researching, setResearching] = useState(false)
  const [researchError, setResearchError] = useState<string | null>(null)

  const handleResearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setResearching(true)
    setResearchError(null)
    setResearchResult('')

    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: researchQuery }),
      })

      if (!response.ok) {
        throw new Error('Research failed')
      }

      const data = await response.json()
      setResearchResult(data.content)
      setMessage(data.content)
    } catch (err) {
      setResearchError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      )
    } finally {
      setResearching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email: 'tomasroma64@gmail.com',
          message,
        }),
      })

      if (!response.ok) {
        throw new Error('Something went wrong')
      }

      setSuccess(true)
      setName('')
      setMessage('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white">
      <div className="z-10 w-full max-w-md items-center justify-between font-mono text-sm lg:flex flex-col">
        <h1 className="text-4xl font-bold mb-8">Research & Email</h1>

        <div className="w-full mb-8">
          <h2 className="text-2xl font-bold mb-4">
            What do you want to research?
          </h2>
          <form onSubmit={handleResearch} className="w-full">
            <div className="mb-4">
              <input
                type="text"
                value={researchQuery}
                onChange={(e) => setResearchQuery(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="e.g., Lady Gaga concert last night"
                required
              />
            </div>
            <button
              type="submit"
              className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
              disabled={researching}>
              {researching ? 'Researching...' : 'Research'}
            </button>
          </form>
          {researchError && (
            <p className="text-red-500 mt-4">{researchError}</p>
          )}
          {researchResult && (
            <div className="mt-4 p-4 bg-gray-800 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Research Results</h3>
              <pre className="text-white whitespace-pre-wrap font-sans">
                {researchResult}
              </pre>
            </div>
          )}
        </div>

        <h2 className="text-2xl font-bold mb-4">Send an Email</h2>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 text-sm font-medium">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="message" className="block mb-2 text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="block p-2.5 w-full text-sm text-white bg-gray-800 rounded-lg border border-gray-700 focus:ring-blue-500 focus:border-blue-500"
              required></textarea>
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            disabled={submitting}>
            {submitting ? 'Sending...' : 'Send Email'}
          </button>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && (
          <p className="text-green-500 mt-4">Email sent successfully!</p>
        )}
      </div>
    </main>
  )
}
