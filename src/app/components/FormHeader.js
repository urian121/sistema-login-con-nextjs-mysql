export default function FormHeader({ icon, title, description }) {
  return (
    <div className="text-center mb-4">
      <div className="mb-3">
        {icon || (
          <svg 
            width="48" 
            height="48" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            className="mx-auto text-primary"
          >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
            <polyline points="10,17 15,12 10,7"/>
            <line x1="15" y1="12" x2="3" y2="12"/>
          </svg>
        )}
      </div>
      <h1 className="h3 fw-bold mb-2">{title}</h1>
      <p className="text-muted mb-0">{description}</p>
    </div>
  );
}