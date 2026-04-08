"use client";
import React, { useEffect, useRef, useState } from "react";

const ProgressBar = ({ percent = "0%" }) => {
  const wrapperRef = useRef(null);
  const barRef = useRef(null);
  const valueRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.5 }
    );

    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
    }

    return () => {
      if (wrapperRef.current) {
        observer.unobserve(wrapperRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (inView) {
      const target = parseInt(percent);
      let current = 0;

      const interval = setInterval(() => {
        if (current <= target) {
          barRef.current.style.width = `${current}%`;
          valueRef.current.textContent = `${current}%`;
          current++;
        } else {
          clearInterval(interval);
        }
      }, 15);
    }
  }, [inView, percent]);

  return (
    <>
      <div className='cause-progress__intro'>
        <p>
          <span>Donation</span>
          <span className='percent-value' ref={valueRef}></span>
        </p>
      </div>
      <div className='cause-progress__bar' ref={wrapperRef}>
        <div className='progress-bar'>
          <div className='progress-bar-percent' ref={barRef}></div>
        </div>
      </div>
    </>
  );
};

export default ProgressBar;
