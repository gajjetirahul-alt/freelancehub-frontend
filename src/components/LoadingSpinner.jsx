import './LoadingSpinner.css';

export default function LoadingSpinner({ size = 'default', fullPage = false }) {
  const cls = size === 'lg' ? 'spinner spinner-lg' : size === 'sm' ? 'spinner spinner-inline' : 'spinner';

  if (fullPage) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className={cls}></div>
      </div>
    );
  }

  return (
    <div className="spinner-overlay">
      <div className={cls}></div>
    </div>
  );
}
