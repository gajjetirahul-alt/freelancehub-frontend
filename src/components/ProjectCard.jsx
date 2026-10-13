import { useNavigate } from 'react-router-dom';
import { DollarSign, Calendar, Clock } from 'lucide-react';
import './ProjectCard.css';

const statusBadge = {
  OPEN: 'badge-emerald',
  IN_PROGRESS: 'badge-amber',
  COMPLETED: 'badge-blue',
  CANCELLED: 'badge-rose',
};

export default function ProjectCard({ project, style }) {
  const navigate = useNavigate();

  const skills = project.requiredSkills
    ? project.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div
      className="glass-card project-card animate-fade-in-up"
      style={style}
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      <div className="project-card-header">
        <h3 className="project-card-title">{project.title}</h3>
        <span className={`badge ${statusBadge[project.status] || 'badge-gray'}`}>
          {project.status?.replace('_', ' ')}
        </span>
      </div>

      <p className="project-card-desc">{project.description}</p>

      {skills.length > 0 && (
        <div className="skill-tags" style={{ marginBottom: 'var(--sp-4)' }}>
          {skills.slice(0, 5).map((skill) => (
            <span key={skill} className="skill-tag">{skill}</span>
          ))}
          {skills.length > 5 && <span className="skill-tag">+{skills.length - 5}</span>}
        </div>
      )}

      <div className="project-card-meta">
        <div className="project-card-meta-item">
          <DollarSign size={14} />
          <span className="meta-value">${Number(project.budget).toLocaleString()}</span>
        </div>
        {project.deadline && (
          <div className="project-card-meta-item">
            <Calendar size={14} />
            <span className="meta-value">{project.deadline}</span>
          </div>
        )}
        {project.createdAt && (
          <div className="project-card-meta-item">
            <Clock size={14} />
            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      <div className="project-card-footer">
        <div className="project-card-client">
          {project.client && (
            <>
              <div className="project-card-client-avatar">
                {project.client.name?.charAt(0).toUpperCase()}
              </div>
              <span>{project.client.name}</span>
            </>
          )}
        </div>
        <span className="btn btn-sm btn-outline" onClick={(e) => { e.stopPropagation(); navigate(`/projects/${project.id}`); }}>
          View Details →
        </span>
      </div>
    </div>
  );
}
