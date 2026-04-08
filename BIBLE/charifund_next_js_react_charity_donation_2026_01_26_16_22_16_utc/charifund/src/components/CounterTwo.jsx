"use client";
import TrackVisibility from "react-on-screen";
import CountUp from "react-countup";
import Link from "next/link";
const CounterTwo = () => {
  return (
    <section className='counter-four pt-120 pb-120'>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-12 col-lg-10 col-xl-9'>
            <div
              className='section__header text-center'
              data-aos='fade-up'
              data-aos-duration={1000}
            >
              <span className='sub-title'>We are always open for children</span>
              <h3 className='title-animation_inner fw-5'>
                Join Our Community of Donors and Volunteers: Be Part of Positive
                Change in the World
              </h3>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-12'>
            <div className='counter-four__content text-center'>
              <h2 className='hb'>
                <TrackVisibility once>
                  {({ isVisible }) =>
                    isVisible && (
                      <span className='odometer fw-8'>
                        <CountUp delay={0} start={0} end={154859} />
                        <span className='prefix'>+</span>
                      </span>
                    )
                  }
                </TrackVisibility>
              </h2>
              <p className='text-xl'>
                Join the Many Who Already Support Our Mission
              </p>
              <div className='cta'>
                <Link
                  href='/become-volunteer'
                  aria-label='join our community'
                  title='join our community'
                  className='btn--primary'
                >
                  Join Our Community
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='fc-one'>
        <img src='assets/images/fc-five.png' alt='Image_inner' />
      </div>
      <div className='fc-two'>
        <img src='assets/images/fc-nine.png' alt='Image_inner' />
      </div>
      <div className='fc-three'>
        <img src='assets/images/fc-ten.png' alt='Image_inner' />
      </div>
      <div className='fc-four'>
        <img src='assets/images/fc-two.png' alt='Image_inner' />
      </div>
    </section>
  );
};

export default CounterTwo;
