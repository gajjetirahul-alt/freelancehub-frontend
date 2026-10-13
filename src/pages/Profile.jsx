import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { User, Edit3, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import './Profile.css';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await API.get(`/users/${user.id}/profile`);
      setProfile(res.data);
      setForm(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await API.patch('/users/me', {
        name: form.name,
        title: form.title,
        bio: form.bio,
        skills: form.skills,
        experience: form.experience,
        hourlyRate: form.hourlyRate ? parseFloat(form.hourlyRate) : null,
      });
      toast.success('Profile updated!');
      setEditing(false);
      loadProfile();
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  if (loading) return <div className="page-wrapper"><LoadingSpinner /></div>;

  const isFreelancer = user.role === 'FREELANCER';

  return (
    <div className="page-wrapper">
      <div className="container profile-page">
        {/* Header */}
        <div className="glass-card profile-header-card animate-fade-in-up">
          <div className="profile-avatar-lg">
            {profile?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-header-info">
            {editing ? (
              <input type="text" className="form-input" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ fontSize: 'var(--font-xl)', fontWeight: 700, marginBottom: 4 }} />
            ) : (
              <h2>{profile?.name}</h2>
            )}
            <p className="profile-email">{user.email}</p>
            <span className={`badge ${user.role === 'CLIENT' ? 'badge-blue' : 'badge-purple'}`}>
              {user.role}
            </span>
          </div>
          <div>
            {!editing ? (
              <button className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}>
                <Edit3 size={14} /> Edit
              </button>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-success btn-sm" onClick={handleSave}><Save size={14} /> Save</button>
                <button className="btn btn-secondary btn-sm" onClick={() => { setEditing(false); setForm(profile); }}><X size={14} /></button>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="glass-card profile-details-card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h3><User size={18} /> Profile Details</h3>

          {editing ? (
            <>
              <div className="form-group">
                <label>Title / Headline</label>
                <input type="text" className="form-input" placeholder="e.g. Full Stack Developer" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea className="form-textarea" placeholder="Tell us about yourself..." value={form.bio || ''} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
              </div>
              {isFreelancer && (
                <>
                  <div className="form-group">
                    <label>Skills (comma separated)</label>
                    <input type="text" className="form-input" placeholder="React, Node.js, Python" value={form.skills || ''} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Experience</label>
                    <input type="text" className="form-input" placeholder="e.g. 5 years" value={form.experience || ''} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Hourly Rate ($)</label>
                    <input type="number" className="form-input" placeholder="e.g. 50" value={form.hourlyRate || ''} onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })} />
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <div className="profile-field">
                <div className="profile-field-label">Title</div>
                <div className={`profile-field-value ${!profile?.title ? 'empty' : ''}`}>
                  {profile?.title || 'Not set'}
                </div>
              </div>
              <div className="profile-field">
                <div className="profile-field-label">Bio</div>
                <div className={`profile-field-value ${!profile?.bio ? 'empty' : ''}`}>
                  {profile?.bio || 'Not set'}
                </div>
              </div>
              {isFreelancer && (
                <>
                  <div className="profile-field">
                    <div className="profile-field-label">Skills</div>
                    {profile?.skills ? (
                      <div className="skill-tags">
                        {profile.skills.split(',').map((s) => s.trim()).filter(Boolean).map((s) => (
                          <span key={s} className="skill-tag">{s}</span>
                        ))}
                      </div>
                    ) : (
                      <div className="profile-field-value empty">Not set</div>
                    )}
                  </div>
                  <div className="profile-field">
                    <div className="profile-field-label">Experience</div>
                    <div className={`profile-field-value ${!profile?.experience ? 'empty' : ''}`}>
                      {profile?.experience || 'Not set'}
                    </div>
                  </div>
                  <div className="profile-field">
                    <div className="profile-field-label">Hourly Rate</div>
                    <div className={`profile-field-value ${!profile?.hourlyRate ? 'empty' : ''}`}>
                      {profile?.hourlyRate ? `$${profile.hourlyRate}/hr` : 'Not set'}
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
