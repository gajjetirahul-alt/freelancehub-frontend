import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { FolderOpen, Send, CheckCircle, Clock, DollarSign, PlusCircle, Briefcase } from 'lucide-react';
import './Dashboard.css';

const statusBadge = {
  OPEN: 'badge-emerald',
  IN_PROGRESS: 'badge-amber',
  COMPLETED: 'badge-blue',
  CANCELLED: 'badge-rose',
  PENDING: 'badge-amber',
  ACCEPTED: 'badge-emerald',
  REJECTED: 'badge-rose',
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      if (user.role === 'CLIENT') {
        const res = await API.get('/projects/mine', { params: { page: 0, size: 50 } });
        setProjects(res.data.content || []);
      } else {
        const res = await API.get('/proposals/mine');
        setProposals(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="page-wrapper"><LoadingSpinner /></div>;

  const isClient = user.role === 'CLIENT';

  // Client stats
  const totalProjects = projects.length;
  const openProjects = projects.filter((p) => p.status === 'OPEN').length;
  const activeProjects = projects.filter((p) => p.status === 'IN_PROGRESS').length;
  const completedProjects = projects.filter((p) => p.status === 'COMPLETED').length;

  // Freelancer stats
  const totalProposals = proposals.length;
  const pendingProposals = proposals.filter((p) => p.status === 'PENDING').length;
  const acceptedProposals = proposals.filter((p) => p.status === 'ACCEPTED').length;
  const totalEarnings = proposals.filter((p) => p.status === 'ACCEPTED').reduce((sum, p) => sum + Number(p.bidAmount || 0), 0);

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <h1>{isClient ? 'Client Dashboard' : 'Freelancer Dashboard'}</h1>
          <p>Welcome back, {user.name}!</p>
        </div>

        {/* Stats */}
        <div className="dashboard-stats">
          {isClient ? (
            <>
              <div className="glass-card stat-card-dash animate-fade-in-up stagger-1">
                <div className="stat-icon stat-icon-blue"><FolderOpen size={24} /></div>
                <div className="stat-content">
                  <span className="stat-num">{totalProjects}</span>
                  <span className="stat-lbl">Total Projects</span>
                </div>
              </div>
              <div className="glass-card stat-card-dash animate-fade-in-up stagger-2">
                <div className="stat-icon stat-icon-emerald"><CheckCircle size={24} /></div>
                <div className="stat-content">
                  <span className="stat-num">{openProjects}</span>
                  <span className="stat-lbl">Open</span>
                </div>
              </div>
              <div className="glass-card stat-card-dash animate-fade-in-up stagger-3">
                <div className="stat-icon stat-icon-amber"><Clock size={24} /></div>
                <div className="stat-content">
                  <span className="stat-num">{activeProjects}</span>
                  <span className="stat-lbl">In Progress</span>
                </div>
              </div>
              <div className="glass-card stat-card-dash animate-fade-in-up stagger-4">
                <div className="stat-icon stat-icon-purple"><Briefcase size={24} /></div>
                <div className="stat-content">
                  <span className="stat-num">{completedProjects}</span>
                  <span className="stat-lbl">Completed</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="glass-card stat-card-dash animate-fade-in-up stagger-1">
                <div className="stat-icon stat-icon-blue"><Send size={24} /></div>
                <div className="stat-content">
                  <span className="stat-num">{totalProposals}</span>
                  <span className="stat-lbl">Total Proposals</span>
                </div>
              </div>
              <div className="glass-card stat-card-dash animate-fade-in-up stagger-2">
                <div className="stat-icon stat-icon-amber"><Clock size={24} /></div>
                <div className="stat-content">
                  <span className="stat-num">{pendingProposals}</span>
                  <span className="stat-lbl">Pending</span>
                </div>
              </div>
              <div className="glass-card stat-card-dash animate-fade-in-up stagger-3">
                <div className="stat-icon stat-icon-emerald"><CheckCircle size={24} /></div>
                <div className="stat-content">
                  <span className="stat-num">{acceptedProposals}</span>
                  <span className="stat-lbl">Accepted</span>
                </div>
              </div>
              <div className="glass-card stat-card-dash animate-fade-in-up stagger-4">
                <div className="stat-icon stat-icon-purple"><DollarSign size={24} /></div>
                <div className="stat-content">
                  <span className="stat-num">${totalEarnings.toLocaleString()}</span>
                  <span className="stat-lbl">Earnings</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Content */}
        {isClient ? (
          <div className="dashboard-section">
            <div className="dashboard-section-header">
              <h2>My Projects</h2>
              <Link to="/projects/new" className="btn btn-primary btn-sm">
                <PlusCircle size={14} /> New Project
              </Link>
            </div>
            {projects.length === 0 ? (
              <div className="glass-card empty-state">
                <p>You haven't posted any projects yet.</p>
                <Link to="/projects/new" className="btn btn-primary">Post Your First Project</Link>
              </div>
            ) : (
              <div className="dashboard-list">
                {projects.map((p) => (
                  <div key={p.id} className="glass-card dashboard-list-item" onClick={() => navigate(`/projects/${p.id}`)}>
                    <div className="dash-item-info">
                      <div className="dash-item-title">{p.title}</div>
                      <div className="dash-item-meta">
                        <span><DollarSign size={12} style={{ verticalAlign: 'middle' }} /> ${Number(p.budget).toLocaleString()}</span>
                        {p.deadline && <span>Due: {p.deadline}</span>}
                      </div>
                    </div>
                    <div className="dash-item-right">
                      <span className={`badge ${statusBadge[p.status] || 'badge-gray'}`}>
                        {p.status?.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="dashboard-section">
            <div className="dashboard-section-header">
              <h2>My Proposals</h2>
              <Link to="/projects" className="btn btn-primary btn-sm">
                <FolderOpen size={14} /> Browse Projects
              </Link>
            </div>
            {proposals.length === 0 ? (
              <div className="glass-card empty-state">
                <p>You haven't submitted any proposals yet.</p>
                <Link to="/projects" className="btn btn-primary">Find Projects</Link>
              </div>
            ) : (
              <div className="dashboard-list">
                {proposals.map((p) => (
                  <div key={p.id} className="glass-card dashboard-list-item" onClick={() => navigate(`/projects/${p.project?.id}`)}>
                    <div className="dash-item-info">
                      <div className="dash-item-title">{p.project?.title || 'Untitled Project'}</div>
                      <div className="dash-item-meta">
                        <span>Bid: ${Number(p.bidAmount).toLocaleString()}</span>
                        <span>{p.estimatedTime}</span>
                      </div>
                    </div>
                    <div className="dash-item-right">
                      <span className={`badge ${statusBadge[p.status] || 'badge-gray'}`}>
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
