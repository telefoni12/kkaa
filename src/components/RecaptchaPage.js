import React, { useEffect, useState } from "react";

export default function RecaptchaPage() {
  const [isLocalhost, setIsLocalhost] = useState(false);

  useEffect(() => {
    // Check if running on localhost
    const hostname = window.location.hostname;
    const isLocal = hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
    setIsLocalhost(isLocal);

    // Only load reCAPTCHA if not on localhost
    if (!isLocal) {
      // Load the reCAPTCHA script dynamically
      const script = document.createElement("script");
      script.src = "https://www.google.com/recaptcha/api.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      // Cleanup when component unmounts
      return () => {
        const existingScript = document.querySelector('script[src="https://www.google.com/recaptcha/api.js"]');
        if (existingScript) {
          document.body.removeChild(existingScript);
        }
      };
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Skip captcha verification on localhost
    if (isLocalhost) {
      const btn = document.getElementById("submit-btn");
      if (btn) btn.disabled = true;
      window.location.href = "/booking-form";
      return;
    }

    const token = window.grecaptcha?.getResponse();

    if (!token || token.length === 0) {
      alert("Please complete the reCAPTCHA.");
      return;
    }

    // Disable button and redirect
    const btn = document.getElementById("submit-btn");
    if (btn) btn.disabled = true;

    console.log("reCAPTCHA token:", token);
    window.location.href = "/booking-form";
  };

  return (
    <div className="recaptcha-page" style={{ overflowY: "auto" }}>
      <div className="greyBg"></div>
      <div className="dzSNzg">
        <div className="jKExlm">
          <form onSubmit={handleSubmit}>
            <div className="fBJhQh">
              <div className="hGbcNq">Security Check</div>
              {!isLocalhost && (
                <div className="captcha">
                  <div
                    className="g-recaptcha"
                    data-sitekey="6Ldy0vQrAAAAAM2wD4p_0XP9nc-q5IRcFiCyt0Nu"
                  ></div>
                </div>
              )}
              {isLocalhost && (
                <div className="captcha" style={{ color: "#4a4a4a", fontSize: "14px", padding: "1rem" }}>
                  Running on localhost - captcha verification skipped
                </div>
              )}

              <p className="eqZafL">
                This helps us to combat harmful conduct, detect and prevent spam,
                and maintain the integrity of our products.
              </p>
              <p className="eqZafL">
                We've used Google’s reCAPTCHA Enterprise product to provide this
                security check. Use of reCAPTCHA is subject to the Google Privacy
                Policy and Terms of Use.
              </p>
              <p className="eqZafL">
                reCAPTCHA Enterprise collects hardware and software information
                such as device and application data, and sends it to Google to
                provide, maintain, and improve reCAPTCHA Enterprise and for
                general security purposes. This information is not used by Google
                for personalized advertising.
              </p>

              <div className="pt-4">
                <button
                  id="submit-btn"
                  type="submit"
                  className="dZasNV"
                  style={{
                    backgroundColor: "rgb(0, 100, 224)",
                    color: "white",
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Inline CSS (you can move this to a .css file) */}
      <style>{`
        .greyBg {
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background-color: #f1f2f7;
          z-index: -1;
        }
        .dzSNzg {
          height: 100dvh;
          width: 100%;
          display: grid;
          place-items: center;
        }
        .jKExlm {
          background: white;
          border: 1px solid rgb(189,189,189);
          border-radius: 0.5rem;
          max-width: 500px;
          width: calc(100% - 2rem);
          margin: auto;
        }
        .fBJhQh {
          padding: 1rem;
          background-color: #fff;
          border-radius: 0.5rem;
        }
        .hGbcNq {
          margin-bottom: 10px;
          font-size: 30px;
          font-weight: 500;
          color: rgb(74, 74, 74);
        }
        .eqZafL {
          margin-top: 10px;
          font-size: 14px;
          font-weight: 500;
          color: rgb(74, 74, 74);
        }
        .dZasNV {
          border: none;
          font-size: 13px;
          font-weight: 500;
          padding: 11px 14px;
          width: 100%;
          border-radius: 8px;
          line-height: 1;
        }
        .captcha {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 74px;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
}
