import Link from "next/link";

const EventInner = () => {
  return (
    <section className='event event-alt'>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-12 col-md-8 col-xl-7'>
            <div
              className='section__header text-center'
              data-aos='fade-up'
              data-aos-duration={1000}
            >
              <span className='sub-title'>
                <i className='icon-donation' />
                Start donating poor people
              </span>
              <h2 className='title-animation_inner'>
                Checkout our upcoming full <span>event</span> list
              </h2>
            </div>
          </div>
        </div>
        <div className='row gutter-30'>
          <div className='col-12 col-lg-6 col-xl-7'>
            <div
              className='event__single-wrapper'
              data-aos='fade-up'
              data-aos-duration={1000}
            >
              <div className='event__single van-tilt'>
                <div className='event__single-thumb'>
                  <img src='assets/images/event/one.png' alt='Image_inner' />
                </div>
                <div className='event__content'>
                  <span>October 19, 2025</span>
                  <h4>
                    <Link href='/event-details'>
                      Transforming Lives Charity Golf Tournam Entdges Charity
                      Networking Event
                    </Link>
                  </h4>
                  <p>
                    <i className='fa-solid fa-location-dot' /> 135 W, 46nd
                    Street, New York
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-lg-6 col-xl-5'>
            <div
              className='event__single-wrapper'
              data-aos='fade-left'
              data-aos-duration={1000}
            >
              <div className='event__single event-single-alt van-tilt'>
                <div className='event__single-thumb'>
                  <img src='assets/images/event/two.png' alt='Image_inner' />
                </div>
                <div className='event__content'>
                  <span>October 19, 2025</span>
                  <h4>
                    <Link href='/event-details'>
                      Unity in Giving Community Charity Event
                    </Link>
                  </h4>
                  <p>
                    <i className='fa-solid fa-location-dot' /> 135 W, 46nd
                    Street, New York
                  </p>
                </div>
              </div>
            </div>
            <div
              className='event__single-wrapper'
              data-aos='fade-left'
              data-aos-duration={1000}
              data-aos-delay={300}
            >
              <div className='event__single  event-single-alt van-tilt'>
                <div className='event__single-thumb'>
                  <img src='assets/images/event/three.png' alt='Image_inner' />
                </div>
                <div className='event__content'>
                  <span>October 19, 2025</span>
                  <h4>
                    <Link href='/event-details'>
                      Unity in Giving Community Charity Event
                    </Link>
                  </h4>
                  <p>
                    <i className='fa-solid fa-location-dot' /> 135 W, 46nd
                    Street, New York
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-12'>
            <div
              className='pagination-wrapper'
              data-aos='fade-up'
              data-aos-duration={1000}
            >
              <ul className='pagination main-pagination'>
                <li>
                  <button>
                    <i className='fa-solid fa-angles-left' />
                  </button>
                </li>
                <li>
                  <Link href='/blog-list'>1</Link>
                </li>
                <li>
                  <Link href='/blog-list' className='active'>
                    2
                  </Link>
                </li>
                <li>
                  <Link href='/blog-list'>3</Link>
                </li>
                <li>
                  <button>
                    <i className='fa-solid fa-angles-right' />
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className='spade'>
        <img
          src='assets/images/blog/spade-base.png'
          alt='Image_inner'
          className='base-img'
        />
      </div>
    </section>
  );
};

export default EventInner;
