import { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import API from '../api/axios';
import ProjectCard from '../components/ProjectCard';
import LoadingSpinner from '../components/LoadingSpinner';
import './Projects.css';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const fetchProjects = async (p = 0) => {
    setLoading(true);
    try {
      const params = { page: p, size: 9 };
      if (status) params.status = status;
      if (keyword.trim()) params.keyword = keyword.trim();
      const res = await API.get('/projects', { params });
      setProjects(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
      setPage(p);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(0);
  }, [status]);

  useEffect(() => {
    if (searchTimeout) clearTimeout(searchTimeout);
    const t = setTimeout(() => fetchProjects(0), 400);
    setSearchTimeout(t);
    return () => clearTimeout(t);
  }, [keyword]);

  return (
    <div className="page-wrapper projects-page">
      <div className="container">
        <div className="page-header">
          <h1>Browse Projects</h1>
          <p>Find your next opportunity from our marketplace</p>
        </div>

        <div className="projects-toolbar">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              className="form-input"
              placeholder="Search projects by keyword..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <select
            className="form-select filter-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : projects.length === 0 ? (
          <div className="projects-empty glass-card">
            <h3>No projects found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="projects-grid">
              {projects.map((project, i) => (
                <ProjectCard key={project.id} project={project} style={{ animationDelay: `${i * 0.05}s` }} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button className="btn btn-secondary btn-sm" disabled={page === 0} onClick={() => fetchProjects(page - 1)}>
                  <ChevronLeft size={16} /> Prev
                </button>
                <span className="pagination-info">
                  Page {page + 1} of {totalPages}
                </span>
                <button className="btn btn-secondary btn-sm" disabled={page >= totalPages - 1} onClick={() => fetchProjects(page + 1)}>
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
