import { useEffect } from 'react';
import './NavigationBoxes.css';

export default function NavigationBoxes() {
  const handleScroll = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      const yOffset = -80; // Adjust this value based on your header height
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  };

  // Add click event listeners after component mounts
  useEffect(() => {
    const boxes = document.querySelectorAll('.nav-box');
    boxes.forEach(box => {
      box.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = box.getAttribute('data-target');
        if (targetId) {
          handleScroll(targetId);
        }
      });
    });
  }, []);

  return (
    <section className="navigation-boxes">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-6">
            <div 
              className="nav-box wow fadeInUp delay-0-2s"
              data-target="model-test"
              style={{ cursor: 'pointer' }}
            >
              <div className="nav-box-inner">
                <div className="icon-wrapper">
                  <i className="ri-ai-generate"></i>
                </div>
                <h3>Test Our AI Model</h3>
                <p>Upload a video to test our threat detection system in action</p>
                <div className="hover-content">
                  <span className="arrow">
                    <i className="ri-arrow-right-line"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div 
              className="nav-box wow fadeInUp delay-0-4s"
              data-target="report"
              style={{ cursor: 'pointer' }}
            >
              <div className="nav-box-inner">
                <div className="icon-wrapper">
                  <i className="ri-alert-line"></i>
                </div>
                <h3>Report an Incident</h3>
                <p>Report suspicious activities or security concerns immediately</p>
                <div className="hover-content">
                  <span className="arrow">
                    <i className="ri-arrow-right-line"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div 
              className="nav-box wow fadeInUp delay-0-6s"
              data-target="lost-vehicle"
              style={{ cursor: 'pointer' }}
            >
              <div className="nav-box-inner">
                <div className="icon-wrapper">
                  <i className="ri-car-line"></i>
                </div>
                <h3>Report Lost Vehicle</h3>
                <p>File a report for your lost or stolen vehicle</p>
                <div className="hover-content">
                  <span className="arrow">
                    <i className="ri-arrow-right-line"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 