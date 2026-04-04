function SectionHeader({ title, linkText, linkHref = '#', linkIcon = '' }) {
  return (
    <div className="d-flex align-items-center justify-content-between mb-3">
      <span className="section-title">{title}</span>
      {linkText && (
        <a href={linkHref} className="section-link">
          {linkText} {linkIcon && <i className={`bi ${linkIcon}`}></i>}
        </a>
      )}
    </div>
  )
}

export default SectionHeader
