"use client";

import { useState, useEffect } from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';

export default function SoftwareManager() {
  const [software, setSoftware] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'add', 'edit'
  const [editingId, setEditingId] = useState(null);
  
  // Software form state
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [uploadType, setUploadType] = useState('file');
  const [orderIndex, setOrderIndex] = useState(0);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSoftware();
  }, []);

  const fetchSoftware = async () => {
    const res = await fetch('/api/software');
    const json = await res.json();
    if (json.data) setSoftware(json.data);
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data.url;
  };

  const resetForm = () => {
    setName('');
    setImageUrl('');
    setImageFile(null);
    setUploadType('file');
    setOrderIndex(software.length);
    setError('');
  };

  const handleEdit = (sw) => {
    setEditingId(sw.id);
    setName(sw.name || '');
    setImageUrl(sw.image_url || '');
    setImageFile(null);
    setUploadType('url');
    setOrderIndex(sw.order_index || 0);
    setViewMode('edit');
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this software?')) return;
    try {
      const res = await fetch(`/api/software?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSoftware(software.filter(s => s.id !== id));
      } else {
        alert('Failed to delete software');
      }
    } catch (err) {
      alert('Error deleting software');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      let finalImageUrl = imageUrl;
      if (uploadType === 'file' && imageFile) {
        finalImageUrl = await uploadFile(imageFile);
      } else if (!finalImageUrl) {
        throw new Error('Image is required');
      }

      const payload = { 
        name, 
        image_url: finalImageUrl,
        order_index: parseInt(orderIndex, 10) || 0
      };

      if (viewMode === 'edit') payload.id = editingId;

      const res = await fetch('/api/software', {
        method: viewMode === 'edit' ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        alert(`Software ${viewMode === 'edit' ? 'updated' : 'added'} successfully!`);
        await fetchSoftware();
        setViewMode('list');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save software');
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
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Manage Software Logos</h2>
          <button onClick={() => { resetForm(); setViewMode('add'); }} className="pill-button pill-button-primary" style={{ gap: '0.5rem' }}>
            <Plus size={18} /> Add New Software
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {software.length === 0 ? <p>No software added yet.</p> : software.map(sw => (
            <div key={sw.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-card-bg)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ width: '40px', height: '40px', background: 'var(--color-bg-base)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {sw.image_url ? (
                    <img src={sw.image_url} alt={sw.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <span style={{ color: 'var(--color-border)', fontSize: '0.8rem' }}>No Img</span>
                  )}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-dark)' }}>{sw.name}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Order: {sw.order_index}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={() => handleEdit(sw)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-nav-text)' }}><Pencil size={20}/></button>
                <button onClick={() => handleDelete(sw.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'red' }}><Trash2 size={20}/></button>
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
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{viewMode === 'edit' ? 'Edit Software' : 'Add New Software'}</h2>
        <button onClick={() => setViewMode('list')} className="pill-button" style={{ background: '#eee', color: '#333' }}>Cancel</button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ background: 'var(--color-card-bg)', padding: '2rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid var(--color-border)' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600 }}>Software Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--color-border)' }} placeholder="e.g. Figma" required />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontWeight: 600 }}>Software Image</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <label style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <input type="radio" checked={uploadType === 'file'} onChange={() => setUploadType('file')} /> Upload File
                </label>
                <label style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <input type="radio" checked={uploadType === 'url'} onChange={() => setUploadType('url')} /> Image URL
                </label>
              </div>
            </div>
            {uploadType === 'file' ? (
              <input key="file-upload" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} style={{ padding: '1rem', borderRadius: '12px', border: '1px dashed var(--color-border)' }} required={uploadType === 'file'} />
            ) : (
              <input key="url-upload" type="url" placeholder="https://..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--color-border)' }} required={uploadType === 'url'} />
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600 }}>Order Index</label>
            <input type="number" value={orderIndex} onChange={(e) => setOrderIndex(e.target.value)} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--color-border)' }} placeholder="e.g. 1" required />
          </div>

        </div>

        {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}
        <button type="submit" disabled={loading} className="pill-button pill-button-primary" style={{ padding: '1.5rem', fontSize: '1.2rem' }}>
          {loading ? 'Saving...' : 'Save Software'}
        </button>
      </form>
    </div>
  );
}
