import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../controller/context/AuthContext'
import { useCharacters } from '../../controller/hook/useCharacters'
import CharacterPortrait from '../component/CharacterPortrait'
import ShareCharacterModal from '../component/ShareCharacterModal'
import { deleteCharacter } from '../../controller/service/characterService'
import { useState } from 'react'

export default function UserCharacters() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const { characters, loading: charactersLoading, error } = useCharacters(user?.id)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [sharingCharacterId, setSharingCharacterId] = useState<string | null>(null)
  const [sharingCharacterName, setSharingCharacterName] = useState<string | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)

  // Character deletion
  const handleDelete = async (characterId?: string, characterName?: string) => {
    if (!characterId) return

    // Confirm character deletion
    const confirmed = window.confirm(`Are you sure you want to delete ${characterName || 'this character'}?`)
    if (!confirmed) return

    setDeletingId(characterId)
    setDeleteError(null)

    try {
      await deleteCharacter(characterId)
      window.location.reload()
    } catch (err: any) {
      setDeleteError(err?.message || 'Failed to delete character.')
    } finally {
      setDeletingId(null)
    }
  }

  if (authLoading) {
    return <div>Loading your profile...</div>
  }

  if (!user) {
    return <div>Please sign in to view your characters.</div>
  }

  if (charactersLoading) {
    return <div>Loading your characters...</div>
  }

  return ( // Page layout
    <main className="container">
      <div className="card-large">
        <h2>Your Characters</h2>

        <button onClick={() => navigate('/create')}><span className="material-symbols-outlined">
        add
        </span></button>
        {error ? (
          <div className="error">Error loading characters: {error}</div>
        ) : deleteError ? (
          <div className="error">{deleteError}</div>
        ) : characters.length > 0 ? (
          <table className="character-list">
            <tr>
                <th>Portrait</th>
                <th>Name</th>
                <th>Pronouns</th>
                <th>Level</th>
                <th>Race</th>
                <th>Class</th>
                <th>Lore</th>
                <th>Actions</th>
            </tr>
            {characters.map((character) => (
              <tr key={character.id ?? `${character.name}-${character.race}-${character.class}-${character.level}`} className="character-entry">
                <td>
                  <CharacterPortrait appearance={character.appearance} />
                </td>
                <td>{character.name}</td>
                <td>{character.pronouns || 'N/A'}</td>
                <td>{character.level}</td>
                <td>{character.race}</td>
                <td>{character.class}</td>
                <td>{character.lore || 'No backstory has been added.'}</td>
                <td>
                    <button
                      onClick={() => {
                        setSharingCharacterId(character.id ?? null)
                        setSharingCharacterName(character.name)
                        setShowShareModal(true)
                      }}
                      className="action"
                    >
                      <span className="material-symbols-outlined">
                      share
                      </span>
                    </button>
                    <button onClick={() => navigate(`/characters/${character.id}/edit`)} className="action"><span className="material-symbols-outlined">
                    edit
                    </span></button>
                    <button
                      onClick={() => handleDelete(character.id, character.name)}
                      disabled={deletingId === character.id}
                      className="action danger"
                    >
                      <span className="material-symbols-outlined">
                      delete
                      </span>
                    </button>
                    
                </td>
              </tr>
            ))}
          </table>
        ) : (
          <p>No saved characters yet.</p>
        )}

        <button onClick={() => navigate("/shared")}>Shared characters</button>
      </div>

      {showShareModal && sharingCharacterId && sharingCharacterName && (
        <div className="modal-overlay">
          <ShareCharacterModal
            characterId={sharingCharacterId}
            characterName={sharingCharacterName}
            onClose={() => setShowShareModal(false)}
          />
        </div>
      )}
    </main>
  )
}
