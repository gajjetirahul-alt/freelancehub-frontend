import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { PlusCircle } from 'lucide-react';
import './CreateProject.css';

export default function CreateProject() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !budget) return toast.error('Please fill required fields');
    setLoading(true);
    try {
      const res = await API.post('/projects', {
        title,
        description,
        requiredSkills,
        budget: parseFloat(budget),
        deadline: deadline || null,
      });
      toast.success('Project created successfully!');
      navigate(`/projects/${res.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container create-project-page">
        <div className="glass-card create-project-card animate-fade-in-up">
          <h2><PlusCircle size={24} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} />Post a Project</h2>
          <p className="subtitle">Describe your project and find the perfect freelancer</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="project-title">Project Title *</label>
              <input id="project-title" type="text" className="form-input" placeholder="e.g. Build a React Dashboard" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div className="form-group">
              <label htmlFor="project-desc">Description *</label>
              <textarea id="project-desc" className="form-textarea" placeholder="Describe your project requirements in detail..." value={description} onChange={(e) => setDescription(e.target.value)} required style={{ minHeight: 180 }} />
            </div>

            <div className="form-group">
              <label htmlFor="project-skills">Required Skills</label>
              <input id="project-skills" type="text" className="form-input" placeholder="e.g. React, Node.js, PostgreSQL (comma separated)" value={requiredSkills} onChange={(e) => setRequiredSkills(e.target.value)} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="project-budget">Budget ($) *</label>
                <input id="project-budget" type="number" className="form-input" placeholder="e.g. 1000" value={budget} onChange={(e) => setBudget(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="project-deadline">Deadline</label>
                <input id="project-deadline" type="date" className="form-input" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Creating...' : 'Publish Project'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
