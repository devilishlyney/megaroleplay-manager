export default function AppearanceBuilder({ onNext, onBack }: { onNext: (data: any) => void; onBack: () => void }) {
    return (
        <div>
            <p>wip</p>
            <div>
                <button onClick={() => onBack()}>Back</button>
                <button onClick={() => onNext({})}>Next: Summary</button>
            </div>
        </div>
    )
}