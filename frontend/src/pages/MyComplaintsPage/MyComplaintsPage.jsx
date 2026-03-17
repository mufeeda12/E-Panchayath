import { useState, useEffect } from 'react';
import ComplaintCard from "../../component/ComplaintCard";
import './MyComplaintsPage.css';

const FILTERS = ['All', 'Pending', 'In Progress', 'Resolved'];

export default function MyComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false); // set false until API is ready
  const [activeFilter, setActiveFilter] = useState('All');
  const [error] = useState(''); // no setter needed until API is connected

  useEffect(() => {
    // TODO: Uncomment when API is ready:
    // setLoading(true);
    // fetchUserComplaints()
    //   .then(setComplaints)
    //   .catch(() => setError('Failed to load complaints. Please try again.'))
    //   .finally(() => setLoading(false));
  }, []);

  const filtered = activeFilter === 'All'
    ? complaints
    : complaints.filter((c) => c.status === activeFilter);

  const countFor = (filter) =>
    filter === 'All'
      ? complaints.length
      : complaints.filter((c) => c.status === filter).length;

  return (
    <div className="complaints-page">
      <main className="complaints-main">
        <div className="complaints-container">

          {/* Page Title */}
          <div className="page-title-row">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <h1 className="page-title">My Complaints</h1>
          </div>
          <p className="page-subtitle">Track and manage all your submitted complaints</p>

          {/* Filter Tabs */}
          <div className="filter-tabs">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                className={`filter-tab ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter} ({countFor(filter)})
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div className="state-center">
              <div className="spinner" />
              <p>Loading your complaints...</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="state-error">
              <p>{error}</p>
              <button className="btn-retry" onClick={() => window.location.reload()}>Retry</button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && filtered.length === 0 && (
            <div className="state-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <p className="empty-text">
                No {activeFilter !== 'All' ? activeFilter.toLowerCase() + ' ' : ''}complaints found.
              </p>
            </div>
          )}

          {/* List */}
          {!loading && !error && filtered.length > 0 && (
            <div className="complaints-list">
              {filtered.map((complaint) => (
                <ComplaintCard key={complaint.id} complaint={complaint} />
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}