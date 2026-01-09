import React, { useState, useEffect } from 'react';
import { Mail, Phone, User, MessageSquare, Trash2, CheckCircle } from 'lucide-react';

// Mock Backend API (Simulating Express + MongoDB)
// In a real MERN app, these would be actual API calls to your Express server
const API = {
  contacts: [],
  
  async createContact(contactData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newContact = {
      _id: Date.now().toString(),
      ...contactData,
      createdAt: new Date().toISOString()
    };
    
    this.contacts.push(newContact);
    return { success: true, data: newContact };
  },
  
  async getContacts() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true, data: [...this.contacts].reverse() };
  },
  
  async deleteContact(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    this.contacts = this.contacts.filter(c => c._id !== id);
    return { success: true };
  }
};

function ContactManagementApp() {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  // Validation errors
  const [errors, setErrors] = useState({});
  
  // UI state
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Fetch contacts on mount
  useEffect(() => {
    fetchContacts();
  }, []);
  
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await API.getContacts();
      if (response.success) {
        setContacts(response.data);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validatePhone = (phone) => {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone);
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (at least 10 digits)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Real-time validation on blur
  const handleBlur = (field) => {
    const newErrors = { ...errors };
    
    if (field === 'name') {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      } else if (formData.name.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      } else {
        delete newErrors.name;
      }
    }
    
    if (field === 'email') {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      } else {
        delete newErrors.email;
      }
    }
    
    if (field === 'phone') {
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!validatePhone(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number (at least 10 digits)';
      } else {
        delete newErrors.phone;
      }
    }
    
    setErrors(newErrors);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      const response = await API.createContact(formData);
      
      if (response.success) {
        // Add new contact to list without page reload
        setContacts(prev => [response.data, ...prev]);
        
        // Reset form
        setFormData({ name: '', email: '', phone: '', message: '' });
        setErrors({});
        
        // Show success message
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error submitting contact:', error);
      alert('Failed to submit contact. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleDelete = async (id) => {
    try {
      await API.deleteContact(id);
      setContacts(prev => prev.filter(c => c._id !== id));
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };
  
  const isFormValid = formData.name.trim() && 
                      validateEmail(formData.email) && 
                      validatePhone(formData.phone) &&
                      Object.keys(errors).length === 0;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Contact Management</h1>
          <p className="text-gray-600">MERN Stack Demo Application</p>
        </div>
        
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 animate-pulse">
            <CheckCircle className="text-green-600" size={24} />
            <span className="text-green-800 font-medium">Contact added successfully!</span>
          </div>
        )}
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Contact</h2>
            
            <div className="space-y-5">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={() => handleBlur('name')}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
              
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur('email')}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="john@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              
              {/* Phone Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={() => handleBlur('phone')}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
              
              {/* Message Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message <span className="text-gray-400">(Optional)</span>
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 text-gray-400" size={20} />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                    placeholder="Your message here..."
                  />
                </div>
              </div>
              
              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!isFormValid || submitting}
                className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
                  !isFormValid || submitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                }`}
              >
                {submitting ? 'Submitting...' : 'Add Contact'}
              </button>
            </div>
          </div>
          
          {/* Contacts List */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Contacts List ({contacts.length})
            </h2>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading contacts...</p>
              </div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-12">
                <User className="mx-auto text-gray-300 mb-4" size={64} />
                <p className="text-gray-500">No contacts yet. Add your first contact!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {contacts.map((contact) => (
                  <div
                    key={contact._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">{contact.name}</h3>
                      <button
                        onClick={() => handleDelete(contact._id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Delete contact"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail size={16} />
                        <span className="text-sm">{contact.email}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone size={16} />
                        <span className="text-sm">{contact.phone}</span>
                      </div>
                      
                      {contact.message && (
                        <div className="flex items-start gap-2 text-gray-600 mt-3 pt-3 border-t border-gray-200">
                          <MessageSquare size={16} className="mt-1 flex-shrink-0" />
                          <span className="text-sm">{contact.message}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3 text-xs text-gray-400">
                      Added: {new Date(contact.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Tech Stack Info */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">MERN Stack Implementation</h3>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">MongoDB</h4>
              <p className="text-gray-600">Contact schema with validation</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Express.js</h4>
              <p className="text-gray-600">REST API (GET, POST, DELETE)</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">React.js</h4>
              <p className="text-gray-600">useState hooks, real-time updates</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Node.js</h4>
              <p className="text-gray-600">Runtime environment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactManagementApp;