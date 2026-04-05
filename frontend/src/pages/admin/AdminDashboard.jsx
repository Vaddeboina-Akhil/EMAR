import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../../utils/auth';
import { api } from '../../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [stats, setStats] = useState({ doctors: 0, patients: 0, staff: 0 });
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const dashboardRes = await api.get('/admin/dashboard');
      setStats(dashboardRes.stats);

      const doctorsRes = await api.get('/admin/doctors');
      setDoctors(doctorsRes.doctors);

      const patientsRes = await api.get('/admin/patients');
      setPatients(patientsRes.patients);
    } catch (err) {
      console.error('Failed to fetch data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('emar_user');
    localStorage.removeItem('emar_token');
    navigate('/admin/login');
  };

  return (
    <div style={{
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#1a237e',
        color: 'white',
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ fontSize: '28px', fontWeight: '900' }}>EMAR Admin</div>
          <div style={{ fontSize: '14px', opacity: 0.8 }}>Logged in as: {user?.name}</div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '20px',
        padding: '20px',
        backgroundColor: 'white',
        borderBottom: '1px solid #ddd',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {['overview', 'doctors', 'patients'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === tab ? '#1a237e' : 'transparent',
              color: activeTab === tab ? 'white' : '#333',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              textTransform: 'capitalize'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', fontSize: '18px', color: '#666' }}>
            Loading...
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '20px'
              }}>
                {[
                  { label: 'Total Doctors', value: stats.doctors, icon: '👨‍⚕️', color: '#2979FF' },
                  { label: 'Total Patients', value: stats.patients, icon: '👤', color: '#2ECC71' },
                  { label: 'Total Staff', value: stats.staff, icon: '👔', color: '#F39C12' }
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      padding: '20px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      borderLeft: `4px solid ${item.color}`
                    }}
                  >
                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>{item.icon}</div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#333' }}>
                      {item.value}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'doctors' && (
              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px' }}>
                <h2 style={{ marginTop: 0 }}>Doctors ({doctors.length})</h2>
                {doctors.length === 0 ? (
                  <div style={{ color: '#666' }}>No doctors found</div>
                ) : (
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '14px'
                  }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #ddd', backgroundColor: '#f5f5f5' }}>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>License ID</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Specialization</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Hospital</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctors.map((doc, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '12px' }}>{doc.name}</td>
                          <td style={{ padding: '12px' }}>{doc.licenseId}</td>
                          <td style={{ padding: '12px' }}>{doc.specialization || '—'}</td>
                          <td style={{ padding: '12px' }}>{doc.hospitalName || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === 'patients' && (
              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px' }}>
                <h2 style={{ marginTop: 0 }}>Patients ({patients.length})</h2>
                {patients.length === 0 ? (
                  <div style={{ color: '#666' }}>No patients found</div>
                ) : (
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '14px'
                  }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #ddd', backgroundColor: '#f5f5f5' }}>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Patient ID</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Aadhaar ID</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Phone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.map((pat, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '12px' }}>{pat.name}</td>
                          <td style={{ padding: '12px' }}>{pat.patientId}</td>
                          <td style={{ padding: '12px' }}>{pat.aadhaarId}</td>
                          <td style={{ padding: '12px' }}>{pat.phone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
