"use client";

import { useState } from 'react';
import ProjectManager from '@/components/admin/ProjectManager';
import ExperienceManager from '@/components/admin/ExperienceManager';

import SoftwareManager from '@/components/admin/SoftwareManager';
import SettingsManager from '@/components/admin/SettingsManager';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('projects');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (res.ok) {
        setIsLoggedIn(true);
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="container" style={{ padding: '8rem 0', maxWidth: '400px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem', textAlign: 'center' }}>Are You Me?</h1>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="password"
            placeholder="Unless...."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '1rem', borderRadius: '12px', border: '1px solid #ccc' }}
            required
          />
          {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}
          <button type="submit" className="pill-button pill-button-primary">Login</button>
        </form>
      </div>
    );
  }

  const TabButton = ({ tabId, label }) => (
    <button
      onClick={() => setActiveTab(tabId)}
      style={{
        background: activeTab === tabId ? 'linear-gradient(90deg, var(--color-pink), var(--color-purple))' : 'transparent',
        color: activeTab === tabId ? 'white' : 'var(--color-nav-text)',
        border: activeTab === tabId ? 'none' : '2px solid var(--color-nav-text)',
        padding: '0.8rem 2rem',
        borderRadius: '9999px',
        fontSize: '1.1rem',
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
    >
      {label}
    </button>
  );

  return (
    <div className="container" style={{ padding: '4rem 0', maxWidth: '1000px' }}>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '4rem' }}>
        <TabButton tabId="projects" label="Manage Projects" />
        <TabButton tabId="experiences" label="Manage Experiences" />
        <TabButton tabId="software" label="Manage Software" />
        <TabButton tabId="settings" label="Settings" />
      </div>

      {activeTab === 'projects' && <ProjectManager />}
      {activeTab === 'experiences' && <ExperienceManager />}
      {activeTab === 'software' && <SoftwareManager />}
      {activeTab === 'settings' && <SettingsManager />}

    </div>
  );
}
