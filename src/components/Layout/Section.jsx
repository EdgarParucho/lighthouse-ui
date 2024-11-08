import './section.css'

const Section = ({ children, modifiers }) => {
  const className = modifiers ? `section section_${modifiers.join(' section_')}` : 'section'

  return <section className={className}>{children}</section>
}

export default Section
