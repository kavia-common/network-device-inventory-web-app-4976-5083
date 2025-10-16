import React, { useCallback, useEffect, useMemo, useState } from 'react';
import DeviceTable from '../components/DeviceTable';
import DeviceForm from '../components/DeviceForm';
import Pagination from '../components/Pagination';
import {
  listDevices,
  createDevice,
  updateDevice,
  deleteDevice as apiDeleteDevice,
  pingDevice,
} from '../api/devices';

const PER_PAGE = 10;

// PUBLIC_INTERFACE
export default function DevicesPage() {
  /** DevicesPage is the main screen for the device inventory. */
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setAlert({ type: '', message: '' });
    try {
      const { items, total } = await listDevices({
        page,
        per_page: PER_PAGE,
        type: typeFilter,
      });
      setItems(items);
      setTotal(total);
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to load devices' });
    } finally {
      setLoading(false);
    }
  }, [page, typeFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const startAdd = () => {
    setEditing(null);
    setShowForm(true);
  };

  const startEdit = (d) => {
    setEditing(d);
    setShowForm(true);
    // Optionally scroll to form
    setTimeout(() => {
      const el = document.getElementById('device-form-anchor');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditing(null);
  };

  const handleSubmit = async (vals) => {
    setSubmitting(true);
    setAlert({ type: '', message: '' });
    try {
      if (editing?.id) {
        await updateDevice(editing.id, vals);
        setAlert({ type: 'success', message: 'Device updated successfully' });
      } else {
        await createDevice(vals);
        setAlert({ type: 'success', message: 'Device created successfully' });
      }
      setShowForm(false);
      setEditing(null);
      // Reload first page after create to make it visible, keep current page on edit
      setPage((p) => (editing ? p : 1));
      await load();
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to save device' });
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (d) => {
    if (!window.confirm(`Delete device "${d.name}"?`)) return;
    setAlert({ type: '', message: '' });
    try {
      await apiDeleteDevice(d.id);
      setAlert({ type: 'success', message: 'Device deleted' });
      // If removing last item on page, go back one page if possible
      const remaining = items.length - 1;
      if (remaining === 0 && page > 1) {
        setPage(page - 1);
      } else {
        await load();
      }
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to delete device' });
    }
  };

  const handlePing = async (d) => {
    setAlert({ type: '', message: '' });
    try {
      const res = await pingDevice(d.id);
      setAlert({
        type: 'info',
        message: `Ping ${d.name}: ${res.status}${res.response_time_ms ? ` (${res.response_time_ms}ms)` : ''}`,
      });
      // Refresh the list to reflect updated status/last_ping if backend updates it
      await load();
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Ping failed' });
    }
  };

  const headerSubtitle = useMemo(() => {
    const base = `${total} device${total === 1 ? '' : 's'}`;
    return typeFilter ? `${base} (filtered by "${typeFilter}")` : base;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, typeFilter]);

  return (
    <div className="container">
      <header className="page-header">
        <div>
          <h1 className="title">Network Devices</h1>
          <p className="subtitle">{headerSubtitle}</p>
        </div>
        <div className="header-actions">
          <select
            value={typeFilter}
            onChange={(e) => {
              setPage(1);
              setTypeFilter(e.target.value);
            }}
            aria-label="Filter by type"
          >
            <option value="">All types</option>
            <option value="router">Router</option>
            <option value="switch">Switch</option>
            <option value="server">Server</option>
            <option value="firewall">Firewall</option>
            <option value="other">Other</option>
          </select>
          <button className="btn" onClick={startAdd}>+ Add Device</button>
        </div>
      </header>

      {alert.message && (
        <div
          className={`alert ${alert.type === 'error' ? 'alert-error' : alert.type === 'success' ? 'alert-success' : 'alert-info'}`}
          role="status"
          aria-live="polite"
        >
          {alert.message}
        </div>
      )}

      {loading ? (
        <div className="card">
          <p>Loading devices...</p>
        </div>
      ) : (
        <>
          <DeviceTable
            devices={items}
            onEdit={startEdit}
            onDelete={handleDelete}
            onPing={handlePing}
          />
          <Pagination
            page={page}
            perPage={PER_PAGE}
            total={total}
            onPageChange={(p) => {
              setPage(p);
            }}
          />
        </>
      )}

      <div id="device-form-anchor" />
      {showForm && (
        <DeviceForm
          initialValues={editing || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitting={submitting}
        />
      )}
    </div>
  );
}
