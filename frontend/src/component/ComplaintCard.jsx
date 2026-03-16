import './ComplaintCard.css';

const STATUS_MAP = {
  Pending: { className: 'status-pending', label: 'Pending' },
  'In Progress': { className: 'status-inprogress', label: 'In Progress' },
  Resolved: { className: 'status-resolved', label: 'Resolved' },
};

export default function ComplaintCard({ complaint }) {
  const { id, category, categoryIcon, categoryColor, categoryBg, description, date, location, status } = complaint;
  const statusInfo = STATUS_MAP[status] || STATUS_MAP['Pending'];

  return (
    <div className="complaint-card">
      <div className="card-top">
        {/* Category Icon */}
        <div className="card-icon" style={{ background: categoryBg, color: categoryColor }}>
          <span>{categoryIcon}</span>
        </div>

        {/* Title & ID */}
        <div className="card-info">
          <div className="card-title-row">
            <div>
              <h3 className="card-category">{category}</h3>
              <p className="card-id">{id}</p>
            </div>
            <span className={`status-badge ${statusInfo.className}`}>{statusInfo.label}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="card-description">{description}</p>

      {/* Meta */}
      <div className="card-meta">
        <span className="meta-item">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {date}
        </span>
        <span className="meta-item">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {location}
        </span>
      </div>
    </div>
  );
}
