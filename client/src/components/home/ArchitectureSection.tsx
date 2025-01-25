import './ArchitectureSection.css';

export default function ArchitectureSection() {
  return (
    <section className="architecture-section" id="architecture">
      <div className="container">
        <div className="row">
          <div className="col-xl-12">
            <div className="section-title wow fadeInUp delay-0-2s">
              <h2>System Architecture</h2>
            </div>
          </div>
        </div>
        
        <div className="architecture-container wow fadeInUp delay-0-4s">
          <div className="architecture-wrapper">
            <img 
              src="assets/images/architecture.jpg" 
              alt="Secure Sight System Architecture"
              className="architecture-image"
            />
            <div className="overlay"></div>
          </div>
          
          <div className="architecture-description">
            <p>
              Our system architecture ensures efficient data accumulation and processing through multiple workers, 
              making it ideal for scenarios where verification is necessary and for time-critical operations that require immediate action.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 