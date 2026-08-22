import React, { useEffect } from 'react';
import './LaunchIntro.css';

const INTRO_DURATION = 6200;

export default function LaunchIntro({ onComplete }) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, INTRO_DURATION);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="launch-intro" role="status" aria-label="Opening GlobeTrotter">
      <div className="launch-intro-surface">
        <img src="/loading.gif" alt="" aria-hidden="true" className="launch-gif" />
        <div className="launch-intro-caption">
          <img src="/logo.svg" alt="GlobeTrotter" className="launch-intro-logo" />
          <span>Preparing your travel workspace</span>
        </div>
      </div>
    </div>
  );
}
