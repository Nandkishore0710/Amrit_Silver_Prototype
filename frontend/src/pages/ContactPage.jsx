import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate sending message
    setTimeout(() => {
      toast.success('Your message has been sent successfully. Our team will contact you shortly.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - AMRIT SILVER</title>
        <meta name="description" content="Get in touch with Amrit Silver for any inquiries regarding our premium silver phone covers." />
      </Helmet>

      {/* Header */}
      <section className="bg-black py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white font-serif mb-4">Contact Us</h1>
        <p className="text-gray-300 text-lg uppercase tracking-widest">We're here to help</p>
      </section>

      <section className="py-16 bg-[#fcfcfc]">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Contact Info */}
            <div className="w-full lg:w-1/3">
              <h2 className="text-2xl font-bold text-[#1F1F1F] mb-8">Get In Touch</h2>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white border border-[#E9E9E9] rounded-full flex items-center justify-center text-[#c8a97e] shrink-0 shadow-sm">
                    <FiMapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1F1F1F] text-lg mb-1">Our Workshop</h3>
                    <p className="text-[#696C70]">123 Silver Market, Johari Bazaar<br />Jaipur, Rajasthan 302003<br />India</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white border border-[#E9E9E9] rounded-full flex items-center justify-center text-[#c8a97e] shrink-0 shadow-sm">
                    <FiPhone size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1F1F1F] text-lg mb-1">Phone / WhatsApp</h3>
                    <p className="text-[#696C70]">+91 98765 43210</p>
                    <p className="text-[#696C70]">+91 12345 67890</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white border border-[#E9E9E9] rounded-full flex items-center justify-center text-[#c8a97e] shrink-0 shadow-sm">
                    <FiMail size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1F1F1F] text-lg mb-1">Email</h3>
                    <p className="text-[#696C70]">support@amritsilver.in</p>
                    <p className="text-[#696C70]">sales@amritsilver.in</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white border border-[#E9E9E9] rounded-full flex items-center justify-center text-[#c8a97e] shrink-0 shadow-sm">
                    <FiClock size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1F1F1F] text-lg mb-1">Business Hours</h3>
                    <p className="text-[#696C70]">Monday - Saturday<br />10:00 AM - 7:00 PM (IST)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="w-full lg:w-2/3 bg-white p-8 md:p-10 border border-[#E9E9E9] rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold text-[#1F1F1F] mb-6">Send Us a Message</h2>
              <p className="text-[#696C70] mb-8">Have a question about a custom order or an existing purchase? Drop us a line and we'll get back to you within 24 hours.</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-[#1F1F1F] mb-2 uppercase tracking-wide">Full Name *</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:border-[#c8a97e] focus:ring-1 focus:ring-[#c8a97e] transition-colors bg-[#FAFAFA]"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#1F1F1F] mb-2 uppercase tracking-wide">Email Address *</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:border-[#c8a97e] focus:ring-1 focus:ring-[#c8a97e] transition-colors bg-[#FAFAFA]"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-[#1F1F1F] mb-2 uppercase tracking-wide">Subject</label>
                  <input 
                    type="text" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:border-[#c8a97e] focus:ring-1 focus:ring-[#c8a97e] transition-colors bg-[#FAFAFA]"
                    placeholder="e.g. Custom Order Inquiry"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-[#1F1F1F] mb-2 uppercase tracking-wide">Message *</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:border-[#c8a97e] focus:ring-1 focus:ring-[#c8a97e] transition-colors bg-[#FAFAFA]"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full md:w-auto bg-black text-white px-10 py-4 rounded font-bold uppercase tracking-wider hover:bg-[#c8a97e] transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
            
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
