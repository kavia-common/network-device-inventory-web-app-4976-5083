import React, { useEffect, useState } from 'react';

// Simple validators
const ipv4Regex =
  /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/;
const macRegex =
  /^([0-9A-Fa-f]{2}([:\-])){5}([0-9A-Fa-f]{2})$/;

const initialForm = {
  name: '',
  ip_address: '',
  mac_address: '',
  device_type: '',
  location: '',
};

// PUBLIC_INTERFACE
export default function DeviceForm({
  initialValues,
  onSubmit,
  onCancel,
  submitting = false,
}) {
  /** DeviceForm presents inputs and validates IP/MAC before submit. */
  const [values, setValues] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  useEffect(() => {
    if (initialValues) {
      setValues({ ...initialForm, ...initialValues });
    }
  }, [initialValues]);

  const validate = () => {
    const e = {};
    if (!values.name?.trim()) e.name = 'Name is required';
    if (!values.ip_address?.trim()) e.ip_address = 'IP address is required';
    else if (!ipv4Regex.test(values.ip_address.trim()))
      e.ip_address = 'Invalid IPv4 format';
    if (!values.mac_address?.trim()) e.mac_address = 'MAC address is required';
    else if (!macRegex.test(values.mac_address.trim()))
      e.mac_address = 'Invalid MAC format (e.g., 00:1A:2B:3C:4D:5E)';
    if (!values.device_type?.trim()) e.device_type = 'Type is required';
    if (!values.location?.trim()) e.location = 'Location is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    if (!validate()) return;
    try {
      await onSubmit(values);
    } catch (err) {
      setGeneralError(err?.message || 'Failed to submit form');
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit} aria-live="polite">
      <h3>{initialValues?.id ? 'Edit Device' : 'Add Device'}</h3>

      {generalError && (
        <div className="alert alert-error" role="alert" aria-live="assertive">
          {generalError}
        </div>
      )}

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            value={values.name}
            onChange={handleChange}
            placeholder="e.g., Core Router"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'err-name' : undefined}
          />
          {errors.name && (
            <div id="err-name" className="field-error">{errors.name}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="ip_address">IP Address</label>
          <input
            id="ip_address"
            name="ip_address"
            value={values.ip_address}
            onChange={handleChange}
            placeholder="e.g., 192.168.1.10"
            aria-invalid={!!errors.ip_address}
            aria-describedby={errors.ip_address ? 'err-ip' : undefined}
          />
          {errors.ip_address && (
            <div id="err-ip" className="field-error">{errors.ip_address}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="mac_address">MAC Address</label>
          <input
            id="mac_address"
            name="mac_address"
            value={values.mac_address}
            onChange={handleChange}
            placeholder="e.g., 00:1A:2B:3C:4D:5E"
            aria-invalid={!!errors.mac_address}
            aria-describedby={errors.mac_address ? 'err-mac' : undefined}
          />
          {errors.mac_address && (
            <div id="err-mac" className="field-error">{errors.mac_address}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="device_type">Type</label>
          <select
            id="device_type"
            name="device_type"
            value={values.device_type}
            onChange={handleChange}
            aria-invalid={!!errors.device_type}
            aria-describedby={errors.device_type ? 'err-type' : undefined}
          >
            <option value="">Select type</option>
            <option value="router">Router</option>
            <option value="switch">Switch</option>
            <option value="server">Server</option>
            <option value="firewall">Firewall</option>
            <option value="other">Other</option>
          </select>
          {errors.device_type && (
            <div id="err-type" className="field-error">{errors.device_type}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            name="location"
            value={values.location}
            onChange={handleChange}
            placeholder="e.g., Data Center A"
            aria-invalid={!!errors.location}
            aria-describedby={errors.location ? 'err-location' : undefined}
          />
          {errors.location && (
            <div id="err-location" className="field-error">{errors.location}</div>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save'}
        </button>
        <button
          className="btn btn-secondary"
          type="button"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
