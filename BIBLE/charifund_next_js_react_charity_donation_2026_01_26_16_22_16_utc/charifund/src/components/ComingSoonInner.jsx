"use client";
import Link from "next/link";
import React, { useEffect, useRef } from "react";

const ComingSoonInner = () => {
  const hourMarkersRef = useRef(null);
  const hourHandRef = useRef(null);
  const minuteHandRef = useRef(null);
  const secondHandRef = useRef(null);
  const dayRef = useRef(null);
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const secondRef = useRef(null);

  useEffect(() => {
    // Generate hour markers
    if (hourMarkersRef.current) {
      for (let i = 0; i < 12; i++) {
        const marker = document.createElement("div");
        marker.classList.add("hour-marker");

        const rotation = i * 30;
        marker.style.transform = `rotate(${rotation}deg) translateY(-216.25px)`;

        const hourText = document.createElement("span");
        hourText.textContent = i === 0 ? "12" : i;
        hourText.style.transform = `rotate(-${rotation}deg)`;

        marker.appendChild(hourText);
        hourMarkersRef.current.appendChild(marker);
      }
    }

    const setClock = () => {
      const now = new Date();
      const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
      const minutes = now.getMinutes() + seconds / 60;
      const hours = (now.getHours() % 12) + minutes / 60;

      const secondsDeg = (seconds / 60) * 360;
      const minutesDeg = (minutes / 60) * 360;
      const hoursDeg = (hours / 12) * 360;

      if (hourHandRef.current)
        hourHandRef.current.style.transform = `rotate(${hoursDeg}deg)`;
      if (minuteHandRef.current)
        minuteHandRef.current.style.transform = `rotate(${minutesDeg}deg)`;
      if (secondHandRef.current)
        secondHandRef.current.style.transform = `rotate(${secondsDeg}deg)`;
    };

    const clockInterval = setInterval(setClock, 50);
    setClock();

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 100);

    const updateCountdown = () => {
      const now = new Date();
      let timeRemaining = endDate - now;

      if (timeRemaining <= 0) {
        endDate.setDate(endDate.getDate() + 100);
        timeRemaining = endDate - now;
      }

      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      if (dayRef.current) dayRef.current.textContent = days;
      if (hourRef.current)
        hourRef.current.textContent = hours < 10 ? `0${hours}` : hours;
      if (minuteRef.current)
        minuteRef.current.textContent = minutes < 10 ? `0${minutes}` : minutes;
      if (secondRef.current)
        secondRef.current.textContent = seconds < 10 ? `0${seconds}` : seconds;
    };

    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => {
      clearInterval(clockInterval);
      clearInterval(countdownInterval);
    };
  }, []);
  return (
    <section className='soon'>
      <div className='container'>
        <div className='row'>
          <div className='col-12'>
            <div className='soon__inner'>
              <div className='soon__logo'>
                <Link href='/'>
                  <img src='assets/images/logo-light.png' alt='Image_inner' />
                </Link>
              </div>

              <div className='countdown-wrapper'>
                <div className='clock'>
                  <div className='hand hour-hand' ref={hourHandRef} />
                  <div className='hand minute-hand' ref={minuteHandRef} />
                  <div className='hand second-hand' ref={secondHandRef} />
                  <div className='center-dot' />
                  <div className='center-dot-orange' />
                  <div className='hour-markers' ref={hourMarkersRef} />
                  <div className='minute-markers' />
                </div>
                <div className='time-countdown'>
                  <div className='counter-column'>
                    <span className='count day' ref={dayRef}>
                      0
                    </span>
                    Days
                  </div>
                  <div className='counter-column'>
                    <span className='count hour' ref={hourRef}>
                      0
                    </span>
                    Hours
                  </div>
                  <div className='counter-column'>
                    <span className='count minute' ref={minuteRef}>
                      0
                    </span>
                    Minutes
                  </div>
                  <div className='counter-column'>
                    <span className='count second' ref={secondRef}>
                      0
                    </span>
                    Seconds
                  </div>
                </div>
              </div>
              <div className='content'>
                <h4 className='title-animation_inner'>
                  Something exciting is coming!
                </h4>
                <p>Exciting updates are on the way.</p>
                <p>Stay with us!</p>
                <form method='post' action='#'>
                  <div className='form-group'>
                    <input
                      type='email'
                      name='sub-email'
                      id='subEmail'
                      placeholder='Your Email'
                      required=''
                    />
                    <button
                      type='submit'
                      className='btn--primary'
                      aria-label='subscribe our newsletter'
                      title='subscribe our newsletter'
                    >
                      Subscribe
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='soon-bg'>
        <img
          src='assets/images/banner/banner-one-bg.png'
          alt='Image_inner'
          className='parallax-image'
        />
      </div>
    </section>
  );
};

export default ComingSoonInner;
