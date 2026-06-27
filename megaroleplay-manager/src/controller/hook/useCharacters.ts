import { useEffect, useState } from 'react'
import { getCharactersByOwner } from '../service/characterService'

export function useCharacters(ownerId?: string) {
  const [characters, setCharacters] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!ownerId) {
      setCharacters([])
      setLoading(false)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    getCharactersByOwner(ownerId)
      .then((data) => {
        setCharacters(data ?? [])
      })
      .catch((err) => {
        setError(err?.message || 'Failed to load characters.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [ownerId])

  return { characters, loading, error }
}
