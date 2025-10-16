import React, { useMemo, useState } from 'react';

// PUBLIC_INTERFACE
export default function DeviceTable({
  devices,
  onEdit,
  onDelete,
  onPing,
}) {
  /** Renders devices in a sortable, searchable table with row actions. */
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [query, setQuery] = useState('');

  const sorted = useMemo(() => {
    const list = Array.isArray(devices) ? [...devices] : [];
    const q = query.trim().toLowerCase();
    const filtered = q
      ? list.filter((d) =>
          [d.name, d.ip_address, d.mac_address, d.device_type, d.location]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(q))
        )
      : list;

    const compare = (a, b) => {
      const av = a?.[sortBy] ?? '';
      const bv = b?.[sortBy] ?? '';
      if (av === bv) return 0;
      if (sortDir === 'asc') return av > bv ? 1 : -1;
      return av < bv ? 1 : -1;
    };
    filtered.sort(compare);
    return filtered;
  }, [devices, sortBy, sortDir, query]);

  const toggleSort = (col) => {
    if (sortBy === col) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(col);
      setSortDir('asc');
    }
  };

  return (
    <div className="card">
      <div className="table-actions">
        <input
          className="search-input"
          placeholder="Search name, IP, MAC, type, location..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search devices"
        />
      </div>
      <div className="table-responsive">
        <table className="table" role="table">
          <thead>
            <tr>
              <Th label="Name" col="name" sortBy={sortBy} sortDir={sortDir} onClick={toggleSort} />
              <Th label="IP" col="ip_address" sortBy={sortBy} sortDir={sortDir} onClick={toggleSort} />
              <Th label="MAC" col="mac_address" sortBy={sortBy} sortDir={sortDir} onClick={toggleSort} />
              <Th label="Type" col="device_type" sortBy={sortBy} sortDir={sortDir} onClick={toggleSort} />
              <Th label="Location" col="location" sortBy={sortBy} sortDir={sortDir} onClick={toggleSort} />
              <Th label="Status" col="status" sortBy={sortBy} sortDir={sortDir} onClick={toggleSort} />
              <Th label="Last Ping" col="last_ping" sortBy={sortBy} sortDir={sortDir} onClick={toggleSort} />
              <th aria-label="Actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((d) => (
              <tr key={d.id || `${d.ip_address}-${d.mac_address}`}>
                <td>{d.name}</td>
                <td>{d.ip_address}</td>
                <td className="mono">{d.mac_address}</td>
                <td><span className="badge">{d.device_type}</span></td>
                <td>{d.location}</td>
                <td>
                  <span className={`status ${d.status || 'unknown'}`}>
                    {d.status || 'unknown'}
                  </span>
                </td>
                <td>{d.last_ping ? new Date(d.last_ping).toLocaleString() : '-'}</td>
                <td className="row-actions">
                  <button className="btn btn-small" onClick={() => onEdit(d)}>Edit</button>
                  <button className="btn btn-small btn-danger" onClick={() => onDelete(d)}>Delete</button>
                  <button className="btn btn-small btn-secondary" onClick={() => onPing(d)}>Ping</button>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={8} className="muted">No devices found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ label, col, sortBy, sortDir, onClick }) {
  const active = sortBy === col;
  const dir = active ? (sortDir === 'asc' ? '▲' : '▼') : '';
  return (
    <th role="columnheader">
      <button className="th-btn" onClick={() => onClick(col)} aria-sort={active ? sortDir : 'none'}>
        {label} {dir}
      </button>
    </th>
  );
}
