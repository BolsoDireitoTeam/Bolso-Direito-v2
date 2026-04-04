function PageHeader({ greeting, title, dateBadge, children }) {
  return (
    <div className="page-header d-flex align-items-start justify-content-between flex-wrap gap-2 mb-4">
      <div>
        <p className="greeting">{greeting}</p>
        <h1>{title}</h1>
        <span className="date-badge">
          <i className="bi bi-calendar3 me-1"></i>
          {dateBadge}
        </span>
      </div>
      {children}
    </div>
  )
}

export default PageHeader
