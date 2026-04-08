const BreadcrumbOne = ({ title }) => {
  return (
    <section className='common-banner'>
      <div className='container'>
        <div className='row'>
          <div className='common-banner__content text-center'>
            <span className='sub-title'>
              <i className='icon-donation' />
              Start donating poor people
            </span>
            <h2 className='title-animation_inner'>{title}</h2>
          </div>
        </div>
      </div>
      <div className='banner-bg'>
        <img src='assets/images/banner/banner-bg.png' alt='Image_inner' />
      </div>
      <div className='shape'>
        <img src='assets/images/shape.png' alt='Image_inner' />
      </div>
      <div className='sprade' data-aos='zoom-in' data-aos-duration={1000}>
        <img
          src='assets/images/sprade-base.png'
          alt='Image_inner'
          className='base-img'
        />
      </div>
    </section>
  );
};

export default BreadcrumbOne;
