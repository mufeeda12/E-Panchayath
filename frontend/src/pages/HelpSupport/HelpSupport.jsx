// pages/HelpSupport/HelpSupport.jsx
import React, { useState } from "react";
import "./HelpSupport.css";

const faqs = [
  { question: "How do I register a new complaint?", answer: "You can register a complaint from the 'My Complaints' page by filling out the form." },
  { question: "How long does it take to resolve a complaint?", answer: "Resolution time varies, but most complaints are addressed within 7–14 working days." },
  { question: "Can I upload photos with my complaint?", answer: "Yes, you can attach photos or documents when submitting your complaint." },
  { question: "How do I track my complaint status?", answer: "You can track your complaint status in the 'My Complaints' section after logging in." },
  { question: "What if my complaint is not resolved?", answer: "If unresolved, you can escalate the complaint through the portal or contact the Panchayat office directly." },
];

const HelpSupport = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="help-container">
      <header className="help-header">
        <h2><i className="fas fa-hands-helping"></i> Help & Support</h2>
        <p>We're here to assist you</p>
      </header>

      <section className="faq-section">
        <h3><i className="fas fa-question-circle"></i> Frequently Asked Questions</h3>
        <ul>
          {faqs.map((faq, index) => (
            <li key={index} className="faq-item">
              <button className="faq-question" onClick={() => toggleFAQ(index)}>
                {faq.question}
                <span className="faq-toggle">
                  {openIndex === index ? <i className="fas fa-minus"></i> : <i className="fas fa-plus"></i>}
                </span>
              </button>
              {openIndex === index && (
                <p className="faq-answer"><i className="fas fa-angle-right"></i> {faq.answer}</p>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="contact-section">
        <h3><i className="fas fa-phone-alt"></i> Contact Panchayat Office</h3>
        <div className="contact-box">
          <p><i className="fas fa-headset"></i> <strong>Helpline (Toll Free)</strong> 1800-XXX-XXXX</p>
          <p><i className="fas fa-envelope"></i> <strong>Email</strong> e-panchayat@gov.in</p>
          <p><i className="fas fa-map-marker-alt"></i> <strong>Office Address</strong> Gram Panchayat Office, Main Road, Alappuzha, Kerala</p>
        </div>
      </section>
    </div>
  );
};

export default HelpSupport;