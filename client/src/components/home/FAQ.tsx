import React from 'react';

const FAQ = () => {
  return (
    <div className="faq-section">
      <h2 className="faq-title">
        <a href="#report" style={{ textDecoration: 'none', color: 'inherit' }}>
          FREQUENTLY ASKED QUESTIONS
        </a>
      </h2>

      <div className="faq-container">
        {faqItems.map((item, index) => (
          <div key={index} className="faq-item testimonial-item">
            <h3 className="faq-question">
              {item.question}
            </h3>
            <p className="faq-answer">
              {item.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const faqItems = [
  {
    question: "What is Secure Sight and how does it work?",
    answer: "Secure Sight is an advanced AI-powered security platform that combines threat detection, analysis, and response capabilities to protect your digital assets."
  },
  {
    question: "How does the AI model improve security detection?",
    answer: "Our AI model continuously learns from new threat patterns and user behavior to provide real-time threat detection and automated response mechanisms."
  },
  {
    question: "What types of threats can Secure Sight detect?",
    answer: "Secure Sight can detect various threats including malware, phishing attempts, unauthorized access, suspicious network activity, and potential data breaches."
  },
  {
    question: "How frequently is the system updated?",
    answer: "Our system receives continuous updates to stay ahead of emerging threats. The AI model is retrained regularly with new security data and threat patterns."
  },
  {
    question: "What support options are available?",
    answer: "We offer 24/7 technical support, detailed documentation, regular training sessions, and dedicated account managers for enterprise clients."
  }
];

export default FAQ; 