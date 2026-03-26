import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({});
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-16">
      <div className="relative p-12 rounded-[3rem] overflow-hidden bg-stone-900 text-white mb-16 text-center">
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ 
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/leather.png")',
            backgroundRepeat: 'repeat'
          }}
        />
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <span className="text-amber-500 font-bold uppercase tracking-widest text-xs">GET IN TOUCH</span>
          <h1 className="text-5xl md:text-6xl font-serif font-bold tracking-tight">
            CONTACT <span className="italic font-light text-stone-400">US</span>
          </h1>
          <p className="text-stone-400 text-lg leading-relaxed">
            Have a question about our products or need assistance with your order? Our team is here to help you every step of the way.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact Info */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-stone-200 shadow-sm space-y-8">
            <h2 className="text-2xl font-serif font-bold text-stone-900">Contact Info</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="font-bold text-stone-900">Our Location</p>
                  <p className="text-stone-700 text-sm">123 Heritage Lane, Peshawar, Pakistan</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="font-bold text-stone-900">Phone Number</p>
                  <a href="tel:+923312865834" className="text-stone-700 text-sm hover:text-amber-700 transition-colors">+92 331 2865834</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="font-bold text-stone-900">Email Address</p>
                  <a href="mailto:info@pishawrichappalhouse.com" className="text-stone-700 text-sm hover:text-amber-700 transition-colors">info@pishawrichappalhouse.com</a>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-stone-100">
              <p className="font-bold text-stone-900 mb-4">Working Hours</p>
              <ul className="space-y-2 text-sm text-stone-700">
                <li className="flex justify-between"><span>Mon - Fri:</span> <span>9:00 AM - 6:00 PM</span></li>
                <li className="flex justify-between"><span>Saturday:</span> <span>10:00 AM - 4:00 PM</span></li>
                <li className="flex justify-between"><span>Sunday:</span> <span className="text-amber-700 font-bold">Closed</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-10 rounded-[2.5rem] border border-stone-200 shadow-xl space-y-8">
            <h2 className="text-2xl font-serif font-bold text-stone-900">Send a Message</h2>
            
            <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  className={`w-full px-6 py-4 bg-stone-50 border ${errors.name ? 'border-red-500' : 'border-stone-200'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 transition-all`}
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <p className="text-red-500 text-xs font-bold">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  className={`w-full px-6 py-4 bg-stone-50 border ${errors.email ? 'border-red-500' : 'border-stone-200'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 transition-all`}
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="text-red-500 text-xs font-bold">{errors.email}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Subject</label>
                <input 
                  type="text" 
                  name="subject"
                  className={`w-full px-6 py-4 bg-stone-50 border ${errors.subject ? 'border-red-500' : 'border-stone-200'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 transition-all`}
                  value={formData.subject}
                  onChange={handleChange}
                />
                {errors.subject && <p className="text-red-500 text-xs font-bold">{errors.subject}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Your Message</label>
                <textarea 
                  name="message"
                  rows={5}
                  className={`w-full px-6 py-4 bg-stone-50 border ${errors.message ? 'border-red-500' : 'border-stone-200'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 transition-all resize-none`}
                  value={formData.message}
                  onChange={handleChange}
                />
                {errors.message && <p className="text-red-500 text-xs font-bold">{errors.message}</p>}
              </div>

              <div className="md:col-span-2 pt-4">
                <button 
                  type="submit" 
                  className="w-full py-5 bg-stone-900 text-white font-bold rounded-2xl hover:bg-stone-800 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-stone-900/20"
                >
                  <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  SEND MESSAGE
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {isSubmitted && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-12 text-center space-y-8"
            >
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-serif font-bold text-stone-900">Message Sent!</h3>
                <p className="text-stone-700">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Contact;
