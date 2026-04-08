import Link from "next/link";

const AwardOne = () => {
  return (
    <section className='award'>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-12 col-lg-10 col-xl-8'>
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
                Our Global Awards <span>Winning</span>
                Photo Gallery
              </h2>
            </div>
          </div>
        </div>
        <div className='row gutter-24'>
          <div className='col-12 col-lg-8'>
            <div
              className='award__single'
              data-aos='fade-up'
              data-aos-duration={1000}
            >
              <div className='thumb'>
                <Link href='/event-details'>
                  <img src='/assets/images/award/one.png' alt='Image_inner' />
                </Link>
              </div>
              <div className='content'>
                <div className='award__content'>
                  <h5>
                    <Link href='/event-details'>Child trouble &amp; care</Link>
                  </h5>
                  <p>Demostic &amp; Transportation</p>
                </div>
                <div className='award__thumb'>
                  <Link href='/event-details'>
                    <i className='fa-solid fa-arrow-right' />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-lg-4'>
            <div
              className='award__single'
              data-aos='fade-up'
              data-aos-duration={1000}
              data-aos-delay={200}
            >
              <div className='thumb'>
                <Link href='/event-details'>
                  <img src='/assets/images/award/four.png' alt='Image_inner' />
                </Link>
              </div>
              <div className='content'>
                <div className='award__content'>
                  <h5>
                    <Link href='/event-details'>Child trouble &amp; care</Link>
                  </h5>
                  <p>Demostic &amp; Transportation</p>
                </div>
                <div className='award__thumb'>
                  <Link href='/event-details'>
                    <i className='fa-solid fa-arrow-right' />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-lg-5'>
            <div
              className='award__single'
              data-aos='fade-up'
              data-aos-duration={1000}
              data-aos-delay={100}
            >
              <div className='thumb'>
                <Link href='/event-details'>
                  <img src='/assets/images/award/two.png' alt='Image_inner' />
                </Link>
              </div>
              <div className='content'>
                <div className='award__content'>
                  <h5>
                    <Link href='/event-details'>Child trouble &amp; care</Link>
                  </h5>
                  <p>Demostic &amp; Transportation</p>
                </div>
                <div className='award__thumb'>
                  <Link href='/event-details'>
                    <i className='fa-solid fa-arrow-right' />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-lg-7'>
            <div
              className='award__single'
              data-aos='fade-up'
              data-aos-duration={1000}
              data-aos-delay={300}
            >
              <div className='thumb'>
                <Link href='/event-details'>
                  <img src='/assets/images/award/three.png' alt='Image_inner' />
                </Link>
              </div>
              <div className='content'>
                <div className='award__content'>
                  <h5>
                    <Link href='/event-details'>Child trouble &amp; care</Link>
                  </h5>
                  <p>Demostic &amp; Transportation</p>
                </div>
                <div className='award__thumb'>
                  <Link href='/event-details'>
                    <i className='fa-solid fa-arrow-right' />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-12'>
            <div className='section__cta cta text-center'>
              <Link
                href='/events'
                aria-label='our events'
                title='our events'
                className='btn--primary'
              >
                View All <i className='fa-solid fa-arrow-right' />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className='spade'>
        <img
          src='/assets/images/community/spade.png'
          alt='Image_inner'
          className='base-img'
        />
      </div>
    </section>
  );
};

export default AwardOne;
