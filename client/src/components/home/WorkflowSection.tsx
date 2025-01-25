import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './WorkflowSection.css';

const workflowSteps = [
  {
    icon: "ri-camera-line",
    title: "Camera Input",
    description: "Real-time video feeds through cameras serve as the primary data source",
    delay: "0.2s",
    link: "#model-test"
  },
  {
    icon: "ri-brain-line",
    title: "ML Model",
    description: "Advanced AI algorithms process and analyze the footage for threats",
    delay: "0.4s",
    link: "#model-test"
  },
  {
    icon: "ri-database-2-line",
    title: "S3 Storage",
    description: "Processed data is securely stored for future reference",
    delay: "0.6s",
    link: "#model-test"
  },
  {
    icon: "ri-notification-3-line",
    title: "Alert System",
    description: "Instant notifications are sent when threats are detected",
    delay: "0.8s",
    link: "#report"
  }
];

export default function WorkflowSection() {
  return (
    <section className="workflow-section">
      <div className="container">
        <div className="row">
          <div className="col-xl-12">
            <div className="section-title wow fadeInUp delay-0-2s">
              <h2>How It Works ?</h2>
            </div>
          </div>
        </div>
        
        <div className="workflow-container">
          {workflowSteps.map((step, index) => (
            <Link to={step.link} key={index} className="workflow-step wow fadeInUp" data-wow-delay={step.delay}>
              <div className="step-content">
                <div className="icon-box">
                  <i className={step.icon}></i>
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
              {index < workflowSteps.length - 1 && (
                <div className="connector">
                  <i className="ri-arrow-right-line"></i>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
} 