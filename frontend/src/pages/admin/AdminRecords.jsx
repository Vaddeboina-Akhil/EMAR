import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { api } from '../../services/api';

const AdminRecords = () => {
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchRecords();
  }, [filter]);

  const fetchRecords = async () => {
    try {
      const url = filter ? `/admin/records?status=${filter}` : '/admin/records';
      const data = await api.get(url);
      setRecords(data.records || []);
      setStats(data.stats);
    } catch (err) {
      console.error('Failed to fetch records:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFreeze = async (recordId) => {
    try {
      await api.put(`/admin/records/${recordId}/freeze`, { reason: 'Frozen by admin for review' });
      fetchRecords();
    } catch (err) {
      console.error('Failed to freeze record:', err);
    }
  };

  const handleUnfreeze = async (recordId) => {
    try {
      await api.put(`/admin/records/${recordId}/unfreeze`);
      fetchRecords();
    } catch (err) {
      console.error('Failed to unfreeze record:', err);
    }
  };

  const StatusBadge = ({ status, isFrozen }) => {
    let colors = {
      draft: '#64748B',
      pending: '#F59E0B',
      approved: '#10B981',
      rejected: '#EF4444'
    };
    
    if (isFrozen) colors.frozen = '#1F2937';
    
    return (
      <span style={{
        display: 'inline-block',
        padding: '4px 12px',
        backgroundColor: isFrozen ? '#1F2937' : colors[status] || '#666',
        color: 'white',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600'
      }}>
        {isFrozen ? '❄️ Frozen' : status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <AdminLayout title={`Records (${records.length})`}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '30px' }}>
          <div style={{ backgroundColor: '#1a1a1a', borderLeft: '4px solid #F59E0B', padding: '20px', borderRadius: '8px' }}>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>Total</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#F59E0B' }}>{stats?.total || 0}</div>
          </div>
          <div style={{ backgroundColor: '#1a1a1a', borderLeft: '4px solid #10B981', padding: '20px', borderRadius: '8px' }}>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>Approved</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#10B981' }}>{stats?.approved || 0}</div>
          </div>
          <div style={{ backgroundColor: '#1a1a1a', borderLeft: '4px solid #DC2626', padding: '20px', borderRadius: '8px' }}>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>Flagged</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#DC2626' }}>{stats?.flagged || 0}</div>
          </div>
          <div style={{ backgroundColor: '#1a1a1a', borderLeft: '4px solid #64748B', padding: '20px', borderRadius: '8px' }}>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>Frozen</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#64748B' }}>{stats?.frozen || 0}</div>
          </div>
        </div>

        {/* Filter */}
        <div style={{ marginBottom: '30px', display: 'flex', gap: '12px' }}>
          {['', 'draft', 'pending', 'approved', 'rejected'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                padding: '8px 16px',
                backgroundColor: filter === status ? '#3B82F6' : '#2a2a2a',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px'
              }}
            >
              {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'All'}
            </button>
          ))}
        </div>

        {/* Records Table */}
        <div style={{ backgroundColor: '#1a1a1a', borderRadius: '8px', borderLeft: '4px solid #F59E0B', overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #2a2a2a' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>📋 Medical Records</h2>
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Loading...</div>
          ) : records.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>No records found</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#111111', borderBottom: '1px solid #2a2a2a' }}>
                    <th style={{ padding: '16px', textAlign: 'left', color: '#888' }}>Patient</th>
                    <th style={{ padding: '16px', textAlign: 'left', color: '#888' }}>Type</th>
                    <th style={{ padding: '16px', textAlign: 'left', color: '#888' }}>Hospital</th>
                    <th style={{ padding: '16px', textAlign: 'left', color: '#888' }}>Status</th>
                    <th style={{ padding: '16px', textAlign: 'left', color: '#888' }}>Date</th>
                    <th style={{ padding: '16px', textAlign: 'left', color: '#888' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((rec) => (
                    <tr key={rec._id} style={{ borderBottom: '1px solid #2a2a2a' }}>
                      <td style={{ padding: '16px', color: '#fff', fontWeight: '600' }}>{rec.patientName || 'Unknown'}</td>
                      <td style={{ padding: '16px', color: '#999' }}>{rec.recordType || '—'}</td>
                      <td style={{ padding: '16px', color: '#999' }}>{rec.hospitalName || '—'}</td>
                      <td style={{ padding: '16px' }}>
                        <StatusBadge status={rec.status} isFrozen={rec.isFrozen} />
                      </td>
                      <td style={{ padding: '16px', color: '#999' }}>
                        {rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {rec.isFrozen ? (
                            <button
                              onClick={() => handleUnfreeze(rec._id)}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: '#10B981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: '600'
                              }}
                            >
                              Unfreeze
                            </button>
                          ) : (
                            <button
                              onClick={() => handleFreeze(rec._id)}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: '#64748B',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: '600'
                              }}
                            >
                              Freeze
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminRecords;
