import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { DollarSign, Calendar, Clock, User, Send, CheckCircle, XCircle, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import './ProjectDetail.css';

const statusBadge = {
  OPEN: 'badge-emerald',
  IN_PROGRESS: 'badge-amber',
  COMPLETED: 'badge-blue',
  CANCELLED: 'badge-rose',
};

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/projects/${id}`);
      setProject(res.data);
      if (user) {
        try {
          const pRes = await API.get(`/projects/${id}/proposals`);
          setProposals(pRes.data);
          if (user.role === 'FREELANCER') {
            setHasApplied(pRes.data.some((p) => p.freelancer?.id === user.id));
          }
        } catch {}
      }
    } catch (err) {
      toast.error('Project not found');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const submitProposal = async (e) => {
    e.preventDefault();
    if (!bidAmount || !estimatedTime || !message) return toast.error('Fill in all fields');
    setSubmitting(true);
    try {
      await API.post(`/projects/${id}/proposals`, {
        bidAmount: parseFloat(bidAmount),
        estimatedTime,
        message,
      });
      toast.success('Proposal submitted!');
      setHasApplied(true);
      loadProject();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit proposal');
    } finally {
      setSubmitting(false);
    }
  };

  const acceptProposal = async (proposalId) => {
    try {
      await API.patch(`/proposals/${proposalId}/accept`);
      toast.success('Proposal accepted!');
      loadProject();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept');
    }
  };

  if (loading) return <div className="page-wrapper"><LoadingSpinner /></div>;
  if (!project) return null;

  const isOwner = user && project.client?.id === user.id;
  const isFreelancer = user?.role === 'FREELANCER';
  const skills = project.requiredSkills ? project.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean) : [];

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="project-detail animate-fade-in">
          {/* Main */}
          <div className="project-detail-main">
            <div className="glass-card project-detail-card">
              <div className="project-detail-status">
                <span className={`badge ${statusBadge[project.status] || 'badge-gray'}`}>
                  {project.status?.replace('_', ' ')}
                </span>
              </div>
              <h1 className="project-detail-title">{project.title}</h1>

              <div className="project-detail-meta">
                <div className="detail-meta-item">
                  <span className="detail-meta-label">Budget</span>
                  <span className="detail-meta-value">
                    <DollarSign size={16} style={{ display: 'inline', verticalAlign: 'middle' }} />
                    {Number(project.budget).toLocaleString()}
                  </span>
                </div>
                {project.deadline && (
                  <div className="detail-meta-item">
                    <span className="detail-meta-label">Deadline</span>
                    <span className="detail-meta-value">{project.deadline}</span>
                  </div>
                )}
                <div className="detail-meta-item">
                  <span className="detail-meta-label">Posted</span>
                  <span className="detail-meta-value">
                    {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="detail-meta-item">
                  <span className="detail-meta-label">Proposals</span>
                  <span className="detail-meta-value">{proposals.length}</span>
                </div>
              </div>

              {skills.length > 0 && (
                <div style={{ marginBottom: 'var(--sp-6)' }}>
                  <h3 style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 'var(--sp-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Required Skills
                  </h3>
                  <div className="skill-tags">
                    {skills.map((s) => <span key={s} className="skill-tag">{s}</span>)}
                  </div>
                </div>
              )}

              <div className="project-detail-description">
                <h3>Project Description</h3>
                <p>{project.description}</p>
              </div>
            </div>

            {/* Proposals list (visible to project owner) */}
            {isOwner && proposals.length > 0 && (
              <div className="glass-card project-detail-card">
                <h3 style={{ fontSize: 'var(--font-xl)', fontWeight: 700, marginBottom: 'var(--sp-6)' }}>
                  Proposals ({proposals.length})
                </h3>
                <div className="proposals-list">
                  {proposals.map((p) => (
                    <div key={p.id} className="proposal-item">
                      <div className="proposal-item-header">
                        <div className="proposal-freelancer">
                          <div className="proposal-freelancer-avatar">
                            {p.freelancer?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="proposal-freelancer-name">{p.freelancer?.name}</div>
                            <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                              {p.estimatedTime}
                            </div>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div className="proposal-bid">${Number(p.bidAmount).toLocaleString()}</div>
                          <span className={`badge ${p.status === 'ACCEPTED' ? 'badge-emerald' : p.status === 'REJECTED' ? 'badge-rose' : 'badge-amber'}`}>
                            {p.status}
                          </span>
                        </div>
                      </div>
                      <p className="proposal-message">{p.message}</p>
                      {p.status === 'PENDING' && project.status === 'OPEN' && (
                        <div className="proposal-actions">
                          <button className="btn btn-success btn-sm" onClick={() => acceptProposal(p.id)}>
                            <CheckCircle size={14} /> Accept
                          </button>
                          <button className="btn btn-sm btn-secondary" onClick={() => navigate(`/messages?to=${p.freelancer?.id}`)}>
                            <MessageCircle size={14} /> Message
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="project-detail-sidebar">
            {/* Client card */}
            <div className="glass-card sidebar-card">
              <h3><User size={16} /> About the Client</h3>
              <div className="client-info">
                <div className="client-info-avatar">
                  {project.client?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="client-info-details">
                  <span className="client-info-name">{project.client?.name}</span>
                  <span className="client-info-role">Client</span>
                </div>
              </div>
              {user && !isOwner && (
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', marginTop: 'var(--sp-4)' }}
                  onClick={() => navigate(`/messages?to=${project.client?.id}`)}
                >
                  <MessageCircle size={14} /> Message Client
                </button>
              )}
            </div>

            {/* Proposal form (freelancer only, OPEN projects, not yet applied) */}
            {isFreelancer && project.status === 'OPEN' && !hasApplied && (
              <div className="glass-card sidebar-card">
                <h3><Send size={16} /> Submit Proposal</h3>
                <form className="proposal-form" onSubmit={submitProposal}>
                  <div className="form-group" style={{ marginBottom: 'var(--sp-4)' }}>
                    <label>Bid Amount ($)</label>
                    <input type="number" className="form-input" placeholder="e.g. 500" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} required />
                  </div>
                  <div className="form-group" style={{ marginBottom: 'var(--sp-4)' }}>
                    <label>Estimated Time</label>
                    <input type="text" className="form-input" placeholder="e.g. 2 weeks" value={estimatedTime} onChange={(e) => setEstimatedTime(e.target.value)} required />
                  </div>
                  <div className="form-group" style={{ marginBottom: 'var(--sp-4)' }}>
                    <label>Cover Letter</label>
                    <textarea className="form-textarea" placeholder="Why are you the best fit?" value={message} onChange={(e) => setMessage(e.target.value)} required />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Proposal'}
                  </button>
                </form>
              </div>
            )}

            {isFreelancer && hasApplied && (
              <div className="glass-card sidebar-card" style={{ textAlign: 'center' }}>
                <CheckCircle size={32} color="var(--accent-emerald)" style={{ marginBottom: 'var(--sp-3)' }} />
                <p style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>Proposal Submitted</p>
                <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginTop: 'var(--sp-2)' }}>
                  You've already applied to this project
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
