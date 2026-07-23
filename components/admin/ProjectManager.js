"use client";

import { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Image as ImageIcon, Type, LayoutTemplate, Pencil, Eye, EyeOff, Crop, CheckCircle } from 'lucide-react';
import ImageCropperModal from './ImageCropperModal';

export default function ProjectManager() {
  const [projects, setProjects] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'add', 'edit'
  const [editingId, setEditingId] = useState(null);
  
  // Project form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Graphic Design Work');
  const [uploadType, setUploadType] = useState('file');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [cropSource, setCropSource] = useState('');
  const [description, setDescription] = useState('');
  const [contentBlocks, setContentBlocks] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await fetch('/api/projects');
    const json = await res.json();
    if (json.data) setProjects(json.data);
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
    setTitle('');
    setCategory('Graphic Design Work');
    setUploadType('file');
    setImageUrl('');
    setImageFile(null);
    setThumbnailUrl('');
    setThumbnailFile(null);
    setDescription('');
    setContentBlocks([]);
    setError('');
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
    setTitle(project.title);
    setCategory(project.category);
    setUploadType('url');
    setImageUrl(project.image_url || '');
    setImageFile(null);
    const metaBlock = Array.isArray(project.content_blocks) ? project.content_blocks.find(b => b.type === '_meta') : null;
    const existingThumb = project.thumbnail_url || (metaBlock ? metaBlock.thumbnail_url : '') || '';
    setThumbnailUrl(existingThumb);
    setThumbnailFile(null);
    setDescription(project.description);
    setContentBlocks(project.content_blocks || []);
    setViewMode('edit');
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects(projects.filter(p => p.id !== id));
      } else {
        alert('Failed to delete project');
      }
    } catch (err) {
      alert('Error deleting project');
    }
  };

  const handleToggleArchive = async (project) => {
    const newArchivedState = !project.is_archived;
    // Optimistic UI update
    setProjects(projects.map(p => p.id === project.id ? { ...p, is_archived: newArchivedState } : p));
    
    try {
      const res = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: project.id, is_archived: newArchivedState })
      });
      if (!res.ok) {
        throw new Error('Failed to update archive status');
      }
    } catch (err) {
      alert('Error updating visibility');
      fetchProjects(); // revert optimistic update
    }
  };

  const handleReorder = async (index, direction) => {
    if (direction === -1 && index === 0) return;
    if (direction === 1 && index === projects.length - 1) return;

    const currentProject = projects[index];
    const targetProject = projects[index + direction];

    // Swap their created_at timestamps
    const updates = [
      { id: currentProject.id, created_at: targetProject.created_at },
      { id: targetProject.id, created_at: currentProject.created_at }
    ];

    // Optimistic UI update
    const newProjects = [...projects];
    newProjects[index] = { ...targetProject, created_at: currentProject.created_at };
    newProjects[index + direction] = { ...currentProject, created_at: targetProject.created_at };
    setProjects(newProjects);

    try {
      const res = await fetch('/api/projects/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      });

      if (!res.ok) {
        throw new Error('Failed to reorder');
      }
      
      // Fetch fresh data just in case
      fetchProjects();
    } catch (err) {
      alert('Error reordering projects');
      fetchProjects(); // revert optimistic update
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
        throw new Error('Hero image is required');
      }

      const processedBlocks = await Promise.all(contentBlocks.map(async (block) => {
        let newBlock = { ...block };
        if (newBlock.content?.imageFile) {
          newBlock.content.imageUrl = await uploadFile(newBlock.content.imageFile);
          delete newBlock.content.imageFile;
        }
        if (newBlock.content?.imageFile2) {
          newBlock.content.imageUrl2 = await uploadFile(newBlock.content.imageFile2);
          delete newBlock.content.imageFile2;
        }
        return newBlock;
      }));

      let finalThumbnailUrl = thumbnailUrl;
      if (thumbnailFile) {
        finalThumbnailUrl = await uploadFile(thumbnailFile);
      }

      let blocks = [...processedBlocks];
      if (finalThumbnailUrl) {
        blocks = blocks.filter(b => b.type !== '_meta');
        blocks.unshift({ type: '_meta', thumbnail_url: finalThumbnailUrl });
      }

      const payload = { 
        title, 
        category, 
        description,
        image_url: finalImageUrl,
        thumbnail_url: finalThumbnailUrl || finalImageUrl,
        content_blocks: blocks
      };

      if (viewMode === 'edit') payload.id = editingId;

      const res = await fetch('/api/projects', {
        method: viewMode === 'edit' ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        alert(`Project ${viewMode === 'edit' ? 'updated' : 'added'} successfully!`);
        await fetchProjects();
        setViewMode('list');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save project');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  const addBlock = (type) => setContentBlocks([...contentBlocks, { id: Date.now(), type, content: {} }]);
  const removeBlock = (id) => setContentBlocks(contentBlocks.filter(b => b.id !== id));
  
  const moveBlock = (index, direction) => {
    if (direction === -1 && index === 0) return;
    if (direction === 1 && index === contentBlocks.length - 1) return;
    const newBlocks = [...contentBlocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[index + direction];
    newBlocks[index + direction] = temp;
    setContentBlocks(newBlocks);
  };

  const updateBlockContent = (id, field, value) => {
    setContentBlocks(contentBlocks.map(b => b.id === id ? { ...b, content: { ...(b.content || {}), [field]: value } } : b));
  };

  if (viewMode === 'list') {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Manage Projects</h2>
          <button onClick={() => { resetForm(); setViewMode('add'); }} className="pill-button pill-button-primary" style={{ gap: '0.5rem' }}>
            <Plus size={18} /> Add New Project
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {projects.length === 0 ? <p>No projects found.</p> : projects.map((proj, index) => (
            <div key={proj.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-card-bg)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-dark)' }}>{proj.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{proj.category}</p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginRight: '1rem' }}>
                  <button onClick={() => handleReorder(index, -1)} disabled={index === 0} style={{ background: 'none', border: 'none', cursor: index === 0 ? 'default' : 'pointer', color: index === 0 ? '#ccc' : 'var(--color-dark)', padding: '0.2rem' }} title="Move Up"><ArrowUp size={20}/></button>
                  <button onClick={() => handleReorder(index, 1)} disabled={index === projects.length - 1} style={{ background: 'none', border: 'none', cursor: index === projects.length - 1 ? 'default' : 'pointer', color: index === projects.length - 1 ? '#ccc' : 'var(--color-dark)', padding: '0.2rem' }} title="Move Down"><ArrowDown size={20}/></button>
                </div>
                <button onClick={() => handleToggleArchive(proj)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: proj.is_archived ? '#999' : 'var(--color-nav-text)' }} title={proj.is_archived ? "Unhide" : "Hide"}>
                  {proj.is_archived ? <EyeOff size={20}/> : <Eye size={20}/>}
                </button>
                <button onClick={() => handleEdit(proj)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-nav-text)' }} title="Edit"><Pencil size={20}/></button>
                <button onClick={() => handleDelete(proj.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'red' }} title="Delete"><Trash2 size={20}/></button>
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
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{viewMode === 'edit' ? 'Edit Project' : 'Add New Project'}</h2>
        <button onClick={() => setViewMode('list')} className="pill-button" style={{ background: '#eee', color: '#333' }}>Cancel</button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ background: 'var(--color-card-bg)', padding: '2rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid var(--color-border)' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Basic Info</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600 }}>Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--color-border)' }} required />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600 }}>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
              <option value="Graphic Design Work">Graphic Design Work</option>
              <option value="UI/UX Work">UI/UX Work</option>
              <option value="Data Analysis Work">Data Analysis Work</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontWeight: 600 }}>Hero Image Source</label>
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

          {/* Thumbnail Cropper Section */}
          <div style={{
            background: 'rgba(0,0,0,0.02)',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px dashed var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <label style={{ fontWeight: 600, display: 'block' }}>Thumbnail (Circular Gallery & Experiences)</label>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Freely crop how this project appears in the Circular Gallery & Experiences cards.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  let source = '';
                  if (imageFile) {
                    source = URL.createObjectURL(imageFile);
                  } else if (imageUrl) {
                    source = imageUrl;
                  }
                  if (!source) {
                    alert('Please select or enter a Hero Image first.');
                    return;
                  }
                  setCropSource(source);
                  setShowCropper(true);
                }}
                className="pill-button"
                style={{ background: 'var(--color-pink)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.9rem', cursor: 'pointer' }}
              >
                <Crop size={16} /> Crop Thumbnail
              </button>
            </div>

            {(thumbnailUrl || thumbnailFile) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                <img
                  src={thumbnailFile ? URL.createObjectURL(thumbnailFile) : thumbnailUrl}
                  alt="Thumbnail Preview"
                  style={{ width: '90px', height: '120px', objectFit: 'cover', borderRadius: '12px', border: '2px solid var(--color-pink)' }}
                />
                <div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: 'green', fontWeight: 600 }}>
                    <CheckCircle size={16} /> Custom Cropped Thumbnail Active
                  </span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                    This cropped view will be saved for Circular Gallery & Experiences.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600 }}>Short Description (Overview)</label>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--color-border)', resize: 'vertical' }} required />
          </div>
        </div>

        <div style={{ background: 'var(--color-card-bg)', padding: '2rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid var(--color-border)' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Detailed Content Builder</h2>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button type="button" onClick={() => addBlock('text')} className="pill-button" style={{ background: 'white', color: 'var(--color-dark)', padding: '0.5rem 1rem', fontSize: '0.9rem', border: '1px solid #ddd' }}><Type size={16}/> Add Text</button>
            <button type="button" onClick={() => addBlock('image')} className="pill-button" style={{ background: 'white', color: 'var(--color-dark)', padding: '0.5rem 1rem', fontSize: '0.9rem', border: '1px solid #ddd' }}><ImageIcon size={16}/> Add Full Image</button>
            <button type="button" onClick={() => addBlock('grid-text-image')} className="pill-button" style={{ background: 'white', color: 'var(--color-dark)', padding: '0.5rem 1rem', fontSize: '0.9rem', border: '1px solid #ddd' }}><LayoutTemplate size={16}/> Text + Image</button>
            <button type="button" onClick={() => addBlock('grid-image-text')} className="pill-button" style={{ background: 'white', color: 'var(--color-dark)', padding: '0.5rem 1rem', fontSize: '0.9rem', border: '1px solid #ddd' }}><LayoutTemplate size={16}/> Image + Text</button>
            <button type="button" onClick={() => addBlock('grid-images-2')} className="pill-button" style={{ background: 'white', color: 'var(--color-dark)', padding: '0.5rem 1rem', fontSize: '0.9rem', border: '1px solid #ddd' }}><ImageIcon size={16}/> Two Images</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
            {contentBlocks.filter(b => b.type !== '_meta').map((block, index) => (
              <div key={block.id || index} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #ddd', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-purple)' }}>{block.type}</span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="button" onClick={() => moveBlock(index, -1)} disabled={index === 0} style={{ padding: '0.3rem', cursor: 'pointer', background: 'transparent', border: 'none' }}><ArrowUp size={18}/></button>
                    <button type="button" onClick={() => moveBlock(index, 1)} disabled={index === contentBlocks.length - 1} style={{ padding: '0.3rem', cursor: 'pointer', background: 'transparent', border: 'none' }}><ArrowDown size={18}/></button>
                    <button type="button" onClick={() => removeBlock(block.id)} style={{ padding: '0.3rem', cursor: 'pointer', background: 'transparent', border: 'none', color: 'red' }}><Trash2 size={18}/></button>
                  </div>
                </div>

                {(block.type === 'text' || block.type === 'grid-text-image' || block.type === 'grid-image-text') && (
                  <textarea placeholder="Enter text..." rows={4} value={block.content?.text || ''} onChange={(e) => updateBlockContent(block.id, 'text', e.target.value)} style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-border)', marginBottom: '1rem', resize: 'vertical' }} />
                )}
                
                {(block.type === 'image' || block.type === 'grid-text-image' || block.type === 'grid-image-text' || block.type === 'grid-images-2') && (
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Image 1</label>
                    <input type="file" accept="image/*" onChange={(e) => updateBlockContent(block.id, 'imageFile', e.target.files[0])} style={{ width: '100%' }} />
                    {block.content?.imageUrl && <img src={block.content.imageUrl} style={{ height: '40px', marginTop: '0.5rem', display: 'block' }} />}
                  </div>
                )}

                {block.type === 'grid-images-2' && (
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Image 2</label>
                    <input type="file" accept="image/*" onChange={(e) => updateBlockContent(block.id, 'imageFile2', e.target.files[0])} style={{ width: '100%' }} />
                    {block.content?.imageUrl2 && <img src={block.content.imageUrl2} style={{ height: '40px', marginTop: '0.5rem', display: 'block' }} />}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}
        <button type="submit" disabled={loading} className="pill-button pill-button-primary" style={{ padding: '1.5rem', fontSize: '1.2rem' }}>
          {loading ? 'Saving...' : 'Save Project'}
        </button>
      </form>

      {showCropper && (
        <ImageCropperModal
          imageSrc={cropSource}
          onClose={() => setShowCropper(false)}
          onCropComplete={(file, previewUrl) => {
            setThumbnailFile(file);
            setThumbnailUrl(previewUrl);
          }}
        />
      )}
    </div>
  );
}
