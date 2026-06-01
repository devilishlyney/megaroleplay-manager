export default function Summary({ onConfirm, onBack }: { onConfirm: () => void; onBack: () => void }) {
    return (
        <div>
            <p>wip</p>
            <div>
                <button onClick={() => onBack()}>Back</button>
                <button onClick={() => onConfirm()}>Confirm</button>
            </div>
        </div>
    )
}