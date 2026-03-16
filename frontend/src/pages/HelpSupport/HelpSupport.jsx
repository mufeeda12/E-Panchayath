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
        <h2>Help & Support</h2>
        <p>We're here to assist you</p>
      </header>

      <section className="faq-section">
        <h3>Frequently Asked Questions</h3>
        <ul>
          {faqs.map((faq, index) => (
            <li key={index} className="faq-item">
              <button className="faq-question" onClick={() => toggleFAQ(index)}>
                {faq.question}
                <span className="faq-toggle">{openIndex === index ? "-" : "+"}</span>
              </button>
              {openIndex === index && (
                <p className="faq-answer">{faq.answer}</p>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="contact-section">
        <h3>Contact Panchayat Office</h3>
        <div className="contact-box">
          <p><strong>Helpline (Toll Free):</strong><br/> 1800-XXX-XXXX</p>
          <p><strong>Email:</strong><br/> grampanchayat.khandala@gov.in</p>
          <p><strong>Office Address:</strong><br/> Gram Panchayat Office, Main Road, Khandala, Pune</p>
        </div>
      </section>
    </div>
  );
};

export default HelpSupport;