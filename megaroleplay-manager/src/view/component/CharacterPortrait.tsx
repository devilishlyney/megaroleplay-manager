import { AppearanceSelection } from '../../model/character'

export default function CharacterPortrait({ appearance }: { appearance?: AppearanceSelection }) {
  if (!appearance) return null

  return ( // mini character portrait as a component
    <div className="character-portrait">
      <img src={`/appearance/base/${appearance.base}.png`} alt="Body" />
      <img src={`/appearance/eyes/${appearance.eyes}.png`} alt="Eyes" />
      <img src={`/appearance/mouth/${appearance.mouth}.png`} alt="Mouth" />
      <img src={`/appearance/hair/${appearance.hair}.png`} alt="Hair" />
      <img src={`/appearance/ears/${appearance.ears}.png`} alt="Ears" />
      <img src={`/appearance/bangs/${appearance.bangs}.png`} alt="Bangs" />
      <div className="appearance-preview-overlay"></div>
    </div>
  )
}
