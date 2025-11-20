import React, { useEffect, useRef } from 'react';

function Calendly() {
const calendlyRef = useRef(null);

  useEffect(() => {
    // Load Calendly script if not already loaded
    const scriptId = 'calendly-widget-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div
      ref={calendlyRef}
      className="calendly-inline-widget"
      data-url="https://calendly.com/william-academyredbull/30min"
      style={{ minWidth: '320px', height: '700px' }}
    ></div>
  );
}

export default Calendly;