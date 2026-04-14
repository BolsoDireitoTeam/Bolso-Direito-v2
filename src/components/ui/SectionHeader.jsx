import { useNavigate } from 'react-router-dom'

function SectionHeader({ title, linkText, linkIcon = '', onLinkClick, linkHref }) {
  const navigate = useNavigate()

  const handleClick = (e) => {
    if (onLinkClick) {
      e.preventDefault()
      onLinkClick()
    } else if (linkHref && !linkHref.startsWith('#') && !linkHref.startsWith('http')) {
      e.preventDefault()
      navigate(linkHref)
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-between mb-3">
      <span className="section-title">{title}</span>
      {linkText && (
        <a href={linkHref || '#'} className="section-link" onClick={handleClick}>
          {linkText} {linkIcon && <i className={`bi ${linkIcon}`}></i>}
        </a>
      )}
    </div>
  )
}

export default SectionHeader
