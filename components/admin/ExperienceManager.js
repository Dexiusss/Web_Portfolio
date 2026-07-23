"use client";

import { useState, useEffect } from 'react';
import { Plus, Trash2, Pencil, Eye, EyeOff } from 'lucide-react';

export default function ExperienceManager() {
  const [experiences, setExperiences] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'add', 'edit'
  const [editingId, setEditingId] = useState(null);
  
  // Experience form state
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Work Experience'); // 'Work Experience' or 'Organization and Volunteer'
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    const res = await fetch('/api/experiences');
    const json = await res.json();
    if (json.data) setExperiences(json.data);
  };

  const resetForm = () => {
    setRole('');
    setCompany('');
    setStartDate('');
    setEndDate('');
    setDescription('');
    setCategory('Work Experience');
    setError('');
  };

  const handleEdit = (exp) => {
    setEditingId(exp.id);
    setRole(exp.role || '');
    setCompany(exp.company || '');
    let parsedStart = '';
    let parsedEnd = '';
    const rawDur = exp.duration || exp.start_date || '';
    if (rawDur) {
      const parts = rawDur.split('-');
      if (parts.length >= 1) {
        const d1 = new Date(parts[0].trim());
        if (!isNaN(d1.getTime())) parsedStart = `${d1.getFullYear()}-${String(d1.getMonth() + 1).padStart(2, '0')}`;
      }
      if (parts.length >= 2) {
        if (parts[1].trim().toLowerCase() !== 'present') {
           const d2 = new Date(parts[1].trim());
           if (!isNaN(d2.getTime())) parsedEnd = `${d2.getFullYear()}-${String(d2.getMonth() + 1).padStart(2, '0')}`;
        }
      }
    }
    setStartDate(parsedStart);
    setEndDate(parsedEnd);
    setDescription(exp.description || '');
    setCategory(exp.category || 'Work Experience');
    setViewMode('edit');
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;
    try {
      const res = await fetch(`/api/experiences?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setExperiences(experiences.filter(e => e.id !== id));
      } else {
        alert('Failed to delete experience');
      }
    } catch (err) {
      alert('Error deleting experience');
    }
  };

  const handleToggleArchive = async (exp) => {
    const newArchivedState = !exp.is_archived;
    // Optimistic UI update
    setExperiences(experiences.map(e => e.id === exp.id ? { ...e, is_archived: newArchivedState } : e));
    
    try {
      const res = await fetch('/api/experiences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: exp.id, is_archived: newArchivedState })
      });
      if (!res.ok) {
        throw new Error('Failed to update archive status');
      }
    } catch (err) {
      alert('Error updating visibility');
      fetchExperiences(); // revert optimistic update
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const payload = { 
        role, 
        company, 
        duration: `${startDate ? new Date(startDate.split('-')[0], startDate.split('-')[1] - 1).toLocaleString('en-US', { month: 'short', year: 'numeric' }) : ''} - ${endDate ? new Date(endDate.split('-')[0], endDate.split('-')[1] - 1).toLocaleString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}`,
        description,
        category
      };

      if (viewMode === 'edit') payload.id = editingId;

      const res = await fetch('/api/experiences', {
        method: viewMode === 'edit' ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        alert(`Experience ${viewMode === 'edit' ? 'updated' : 'added'} successfully!`);
        await fetchExperiences();
        setViewMode('list');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save experience');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  if (viewMode === 'list') {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Manage Timeline Experiences</h2>
          <button onClick={() => { resetForm(); setViewMode('add'); }} className="pill-button pill-button-primary" style={{ gap: '0.5rem' }}>
            <Plus size={18} /> Add New Experience
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {experiences.length === 0 ? <p>No experiences found.</p> : experiences.map(exp => (
            <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-card-bg)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-dark)' }}>{exp.role} @ {exp.company}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{exp.category} &bull; {exp.duration}</p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button onClick={() => handleToggleArchive(exp)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: exp.is_archived ? '#999' : 'var(--color-nav-text)' }} title={exp.is_archived ? "Unhide" : "Hide"}>
                  {exp.is_archived ? <EyeOff size={20}/> : <Eye size={20}/>}
                </button>
                <button onClick={() => handleEdit(exp)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-nav-text)' }} title="Edit"><Pencil size={20}/></button>
                <button onClick={() => handleDelete(exp.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'red' }} title="Delete"><Trash2 size={20}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{viewMode === 'edit' ? 'Edit Experience' : 'Add New Experience'}</h2>
        <button onClick={() => setViewMode('list')} className="pill-button" style={{ background: '#eee', color: '#333' }}>Cancel</button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ background: 'var(--color-card-bg)', padding: '2rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid var(--color-border)' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600 }}>Role / Title</label>
            <input type="text" value={role} onChange={(e) => setRole(e.target.value)} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--color-border)' }} placeholder="e.g. Graphic Designer" required />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600 }}>Company / Organization</label>
            <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--color-border)' }} placeholder="e.g. Laborless Digital" required />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600 }}>Duration / Dates</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input type="month" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--color-border)', flex: 1 }} required />
              <span>to</span>
              <input type="month" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--color-border)', flex: 1 }} />
            </div>
            <p style={{ fontSize: '0.8rem', color: '#666' }}>Leave end date blank for "Present"</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600 }}>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
              <option value="Work Experience">Work Experience</option>
              <option value="Organization and Volunteer">Organization and Volunteer</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600 }}>Description</label>
            <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--color-border)', resize: 'vertical' }} required />
          </div>
        </div>

        {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}
        <button type="submit" disabled={loading} className="pill-button pill-button-primary" style={{ padding: '1.5rem', fontSize: '1.2rem' }}>
          {loading ? 'Saving...' : 'Save Experience'}
        </button>
      </form>
    </div>
  );
}
