export default function FormLayout({ children }) {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card border-0 shadow-lg">
              <div className="card-body p-5">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}