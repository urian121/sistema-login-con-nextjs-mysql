export default function SubmitButton({ isSubmitting, loadingText, children }) {
  return (
    <div className="d-grid mb-4">
      <button
        type="submit"
        className="btn btn-dark btn-lg text-white"
        disabled={isSubmitting}
        style={{
          backgroundColor: '#0f172a',
          border: 'none',
          borderRadius: '6px',
          fontWeight: '500'
        }}
      >
        {isSubmitting ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            {loadingText}
          </>
        ) : (
          children
        )}
      </button>
    </div>
  );
}