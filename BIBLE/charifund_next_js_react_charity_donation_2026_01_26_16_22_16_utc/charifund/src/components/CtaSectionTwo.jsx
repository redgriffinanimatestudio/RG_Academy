import Link from "next/link";

const CtaSectionTwo = () => {
  return (
    <section className='cta-section-two'>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-12 col-lg-7'>
            <div className='cta__section__content'>
              <div
                className='section__content text-center'
                data-aos='fade-up'
                data-aos-duration={1000}
              >
                <span className='sub-title'>
                  <i className='icon-donation' />
                  Start donating poor people
                </span>
                <h2 className='title-animation_inner'>
                  children need your help by donating today
                </h2>
                <div className='banner__content-cta cta'>
                  <Link
                    href='/our-causes'
                    aria-label='about us'
                    title='about us'
                    className='btn--tertiary'
                  >
                    Discover More <i className='fa-solid fa-arrow-right' />
                  </Link>
                  <Link
                    href='/contact-us'
                    aria-label='contact us'
                    title='contact us'
                    className='btn--primary'
                  >
                    Get A Quote <i className='fa-solid fa-arrow-right' />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='cta-bg'>
        <img
          src='assets/images/cta/cta-bg.png'
          alt='Image_inner'
          className='parallax-image'
        />
      </div>
      <div
        className='shape-left'
        data-aos='fade-right'
        data-aos-duration={1000}
        data-aos-delay={300}
      >
        <img src='assets/images/cta/shape-left.png' alt='Image_inner' />
      </div>
      <div className='shape'>
        <img src='assets/images/shape-two.png' alt='Image_inner' />
      </div>
    </section>
  );
};

export default CtaSectionTwo;
