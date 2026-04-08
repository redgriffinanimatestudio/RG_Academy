import Link from "next/link";

const BannerFive = () => {
  return (
    <section
      className='banner-five commit'
      style={{
        backgroundImage: "url(/assets/images/f-banner.png)",
      }}
    >
      <div className='container'>
        <div className='row'>
          <div className='col-12'>
            <div className='banner-five__content'>
              <span className='text-xl sub-title'>for prevent proverties</span>
              <h1 className='title-animation_inner fw-7'>
                Support <span className='bottom-line'>Humanity</span>
              </h1>
              <p>
                Transmax is the world's driving worldwide coordinations supplier
                — we uphold industry and exchange the worldwide trade of mercha
              </p>
              <div className='mt-40'>
                <Link
                  href='/our-causes'
                  aria-label='our causes'
                  title='our causes'
                  className='btn--primary'
                >
                  Check Our Causes
                </Link>
              </div>
              <div className='commmit-tab-single mt-40'>
                <div className='commit-tab-inner'>
                  <div className='thumb'>
                    <i className='icon-donation' />
                  </div>
                  <div className='content'>
                    <p className='text-lg fw-7'>Trusted organization</p>
                    <p>Welcome to our Print 128 company that offers a</p>
                  </div>
                </div>
                <span className='divider d-none d-xxl-block' />
                <div className='commit-tab-inner'>
                  <div className='thumb'>
                    <i className='icon-award' />
                  </div>
                  <div className='content'>
                    <p className='text-lg fw-7'>Awarded services</p>
                    <p>Welcome to our Print 128 company that offers a</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='spade'>
        <img src='assets/images/spade-green-two.png' alt='Image_inner' />
      </div>
      <div className='shape'>
        <img src='assets/images/c-shape.png' alt='Image_inner' />
      </div>
    </section>
  );
};

export default BannerFive;
