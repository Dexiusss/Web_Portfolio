"use client";

import { useState, useEffect } from 'react';

export default function SettingsManager() {
  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  
  const [whoamiText, setWhoamiText] = useState('');
  const [whatidoText1, setWhatidoText1] = useState('');
  const [whatidoText2, setWhatidoText2] = useState('');
  const [image3, setImage3] = useState('');

  // Expertise Images
  const [expImg1, setExpImg1] = useState('');
  const [expImg2, setExpImg2] = useState('');
  const [expImg3, setExpImg3] = useState('');
  const [expImg4, setExpImg4] = useState('');
  
  const [uploadType1, setUploadType1] = useState('url');
  const [imageFile1, setImageFile1] = useState(null);
  
  const [uploadType2, setUploadType2] = useState('url');
  const [imageFile2, setImageFile2] = useState(null);
  
  const [uploadType3, setUploadType3] = useState('url');
  const [imageFile3, setImageFile3] = useState(null);

  // Upload types & files for expertise images
  const [expUploadType1, setExpUploadType1] = useState('url');
  const [expFile1, setExpFile1] = useState(null);

  const [expUploadType2, setExpUploadType2] = useState('url');
  const [expFile2, setExpFile2] = useState(null);

  const [expUploadType3, setExpUploadType3] = useState('url');
  const [expFile3, setExpFile3] = useState(null);

  const [expUploadType4, setExpUploadType4] = useState('url');
  const [expFile4, setExpFile4] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const res = await fetch('/api/settings');
    const json = await res.json();
    if (json.data) {
      setImage1(json.data.whoami_image_1 || '');
      setImage2(json.data.whoami_image_2 || '');
      setImage3(json.data.whatido_image || '');
      setWhoamiText(json.data.whoami_text || '');
      setWhatidoText1(json.data.whatido_text_1 || '');
      setWhatidoText2(json.data.whatido_text_2 || '');

      setExpImg1(json.data.expertise_image_1 || '');
      setExpImg2(json.data.expertise_image_2 || '');
      setExpImg3(json.data.expertise_image_3 || '');
      setExpImg4(json.data.expertise_image_4 || '');
    }
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

  const handleSave = async (key, value) => {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value })
    });
    if (!res.ok) throw new Error('Failed to save');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      let finalImg1 = image1;
      if (uploadType1 === 'file' && imageFile1) {
        finalImg1 = await uploadFile(imageFile1);
      }
      
      let finalImg2 = image2;
      if (uploadType2 === 'file' && imageFile2) {
        finalImg2 = await uploadFile(imageFile2);
      }

      let finalImg3 = image3;
      if (uploadType3 === 'file' && imageFile3) {
        finalImg3 = await uploadFile(imageFile3);
      }

      // Process Expertise Images
      let finalExp1 = expImg1;
      if (expUploadType1 === 'file' && expFile1) finalExp1 = await uploadFile(expFile1);

      let finalExp2 = expImg2;
      if (expUploadType2 === 'file' && expFile2) finalExp2 = await uploadFile(expFile2);

      let finalExp3 = expImg3;
      if (expUploadType3 === 'file' && expFile3) finalExp3 = await uploadFile(expFile3);

      let finalExp4 = expImg4;
      if (expUploadType4 === 'file' && expFile4) finalExp4 = await uploadFile(expFile4);

      if (finalImg1) await handleSave('whoami_image_1', finalImg1);
      if (finalImg2) await handleSave('whoami_image_2', finalImg2);
      if (finalImg3) await handleSave('whatido_image', finalImg3);
      
      if (finalExp1) await handleSave('expertise_image_1', finalExp1);
      if (finalExp2) await handleSave('expertise_image_2', finalExp2);
      if (finalExp3) await handleSave('expertise_image_3', finalExp3);
      if (finalExp4) await handleSave('expertise_image_4', finalExp4);

      await handleSave('whoami_text', whoamiText);
      await handleSave('whatido_text_1', whatidoText1);
      await handleSave('whatido_text_2', whatidoText2);
      
      if (finalImg1) setImage1(finalImg1);
      if (finalImg2) setImage2(finalImg2);
      if (finalImg3) setImage3(finalImg3);

      if (finalExp1) setExpImg1(finalExp1);
      if (finalExp2) setExpImg2(finalExp2);
      if (finalExp3) setExpImg3(finalExp3);
      if (finalExp4) setExpImg4(finalExp4);

      setSuccess('Settings saved successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem' }}>Manage Settings</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ background: 'var(--color-card-bg)', padding: '2rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid var(--color-border)' }}>
          
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Who Am I Settings</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontWeight: 600 }}>Who Am I - Image 1 (Homepage & About Page)</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <label style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <input type="radio" checked={uploadType1 === 'file'} onChange={() => setUploadType1('file')} /> Upload File
                </label>
                <label style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <input type="radio" checked={uploadType1 === 'url'} onChange={() => setUploadType1('url')} /> Image URL
                </label>
              </div>
            </div>
            {uploadType1 === 'file' ? (
              <input key="file1" type="file" accept="image/*" onChange={(e) => setImageFile1(e.target.files[0])} style={{ padding: '1rem', borderRadius: '12px', border: '1px dashed var(--color-border)' }} />
            ) : (
              <input key="url1" type="url" value={image1} onChange={(e) => setImage1(e.target.value)} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--color-border)' }} placeholder="e.g. https://.../image1.jpg" />
            )}
            {image1 && uploadType1 === 'url' && (
               <img src={image1} alt="Preview 1" style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '12px', marginTop: '1rem' }} />
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontWeight: 600 }}>Who Am I - Image 2 (Homepage & About Page)</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <label style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <input type="radio" checked={uploadType2 === 'file'} onChange={() => setUploadType2('file')} /> Upload File
                </label>
                <label style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <input type="radio" checked={uploadType2 === 'url'} onChange={() => setUploadType2('url')} /> Image URL
                </label>
              </div>
            </div>
            {uploadType2 === 'file' ? (
              <input key="file2" type="file" accept="image/*" onChange={(e) => setImageFile2(e.target.files[0])} style={{ padding: '1rem', borderRadius: '12px', border: '1px dashed var(--color-border)' }} />
            ) : (
              <input key="url2" type="url" value={image2} onChange={(e) => setImage2(e.target.value)} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--color-border)' }} placeholder="e.g. https://.../image2.jpg" />
            )}
            {image2 && uploadType2 === 'url' && (
               <img src={image2} alt="Preview 2" style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '12px', marginTop: '1rem' }} />
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600 }}>Who Am I - Text (Homepage & About Page)</label>
            <textarea value={whoamiText} onChange={(e) => setWhoamiText(e.target.value)} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--color-border)', minHeight: '100px' }} placeholder="I am a Data Science graduate..." />
          </div>

          <hr style={{ margin: '1rem 0', borderColor: '#eee' }} />

          <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>My Expertise - Flowing Menu Images</h3>

          {/* Expertise Image 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontWeight: 600 }}>1. Graphic Design Image</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <label style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <input type="radio" checked={expUploadType1 === 'file'} onChange={() => setExpUploadType1('file')} /> Upload File
                </label>
                <label style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <input type="radio" checked={expUploadType1 === 'url'} onChange={() => setExpUploadType1('url')} /> Image URL
                </label>
              </div>
            </div>
            {expUploadType1 === 'file' ? (
              <input type="file" accept="image/*" onChange={(e) => setExpFile1(e.target.files[0])} style={{ padding: '1rem', borderRadius: '12px', border: '1px dashed var(--color-border)' }} />
            ) : (
              <input type="url" value={expImg1} onChange={(e) => setExpImg1(e.target.value)} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--color-border)' }} placeholder="https://..." />
            )}
            {expImg1 && expUploadType1 === 'url' && (
              <img src={expImg1} alt="Graphic Design Preview" style={{ width: '180px', height: '60px', objectFit: 'cover', borderRadius: '9999px', marginTop: '0.5rem' }} />
            )}
          </div>

          {/* Expertise Image 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontWeight: 600 }}>2. UI/UX Design Image</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <label style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <input type="radio" checked={expUploadType2 === 'file'} onChange={() => setExpUploadType2('file')} /> Upload File
                </label>
                <label style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <input type="radio" checked={expUploadType2 === 'url'} onChange={() => setExpUploadType2('url')} /> Image URL
                </label>
              </div>
            </div>
            {expUploadType2 === 'file' ? (
              <input type="file" accept="image/*" onChange={(e) => setExpFile2(e.target.files[0])} style={{ padding: '1rem', borderRadius: '12px', border: '1px dashed var(--color-border)' }} />
            ) : (
              <input type="url" value={expImg2} onChange={(e) => setExpImg2(e.target.value)} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--color-border)' }} placeholder="https://..." />
            )}
            {expImg2 && expUploadType2 === 'url' && (
              <img src={expImg2} alt="UI/UX Design Preview" style={{ width: '180px', height: '60px', objectFit: 'cover', borderRadius: '9999px', marginTop: '0.5rem' }} />
            )}
          </div>

          {/* Expertise Image 3 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontWeight: 600 }}>3. Data Science Image</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <label style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <input type="radio" checked={expUploadType3 === 'file'} onChange={() => setExpUploadType3('file')} /> Upload File
                </label>
                <label style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <input type="radio" checked={expUploadType3 === 'url'} onChange={() => setExpUploadType3('url')} /> Image URL
                </label>
              </div>
            </div>
            {expUploadType3 === 'file' ? (
              <input type="file" accept="image/*" onChange={(e) => setExpFile3(e.target.files[0])} style={{ padding: '1rem', borderRadius: '12px', border: '1px dashed var(--color-border)' }} />
            ) : (
              <input type="url" value={expImg3} onChange={(e) => setExpImg3(e.target.value)} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--color-border)' }} placeholder="https://..." />
            )}
            {expImg3 && expUploadType3 === 'url' && (
              <img src={expImg3} alt="Data Science Preview" style={{ width: '180px', height: '60px', objectFit: 'cover', borderRadius: '9999px', marginTop: '0.5rem' }} />
            )}
          </div>

          {/* Expertise Image 4 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontWeight: 600 }}>4. Business Intelligence Image</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <label style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <input type="radio" checked={expUploadType4 === 'file'} onChange={() => setExpUploadType4('file')} /> Upload File
                </label>
                <label style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <input type="radio" checked={expUploadType4 === 'url'} onChange={() => setExpUploadType4('url')} /> Image URL
                </label>
              </div>
            </div>
            {expUploadType4 === 'file' ? (
              <input type="file" accept="image/*" onChange={(e) => setExpFile4(e.target.files[0])} style={{ padding: '1rem', borderRadius: '12px', border: '1px dashed var(--color-border)' }} />
            ) : (
              <input type="url" value={expImg4} onChange={(e) => setExpImg4(e.target.value)} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--color-border)' }} placeholder="https://..." />
            )}
            {expImg4 && expUploadType4 === 'url' && (
              <img src={expImg4} alt="Business Intelligence Preview" style={{ width: '180px', height: '60px', objectFit: 'cover', borderRadius: '9999px', marginTop: '0.5rem' }} />
            )}
          </div>

          <hr style={{ margin: '1rem 0', borderColor: '#eee' }} />

          <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>What I Do Settings (About Page)</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontWeight: 600 }}>What I Do - Image (About Page)</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <label style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <input type="radio" checked={uploadType3 === 'file'} onChange={() => setUploadType3('file')} /> Upload File
                </label>
                <label style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <input type="radio" checked={uploadType3 === 'url'} onChange={() => setUploadType3('url')} /> Image URL
                </label>
              </div>
            </div>
            {uploadType3 === 'file' ? (
              <input key="file3" type="file" accept="image/*" onChange={(e) => setImageFile3(e.target.files[0])} style={{ padding: '1rem', borderRadius: '12px', border: '1px dashed var(--color-border)' }} />
            ) : (
              <input key="url3" type="url" value={image3} onChange={(e) => setImage3(e.target.value)} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--color-border)' }} placeholder="e.g. https://.../image3.jpg" />
            )}
            {image3 && uploadType3 === 'url' && (
               <img src={image3} alt="Preview 3" style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '12px', marginTop: '1rem' }} />
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600 }}>What I Do - Paragraph 1 (About Page)</label>
            <textarea value={whatidoText1} onChange={(e) => setWhatidoText1(e.target.value)} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--color-border)', minHeight: '100px' }} placeholder="Alongside my analytical background..." />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600 }}>What I Do - Paragraph 2 (About Page)</label>
            <textarea value={whatidoText2} onChange={(e) => setWhatidoText2(e.target.value)} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--color-border)', minHeight: '100px' }} placeholder="My technical toolkit includes..." />
          </div>

        </div>

        {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}
        {success && <p style={{ color: 'green', fontSize: '0.9rem', fontWeight: 600 }}>{success}</p>}
        
        <button type="submit" disabled={loading} className="pill-button pill-button-primary" style={{ padding: '1.5rem', fontSize: '1.2rem', maxWidth: '300px' }}>
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
