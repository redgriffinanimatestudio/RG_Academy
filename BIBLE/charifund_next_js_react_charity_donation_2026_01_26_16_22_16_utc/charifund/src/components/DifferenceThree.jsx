import Link from "next/link";

const DifferenceThree = () => {
  return (
    <section className='difference-three'>
      <div className='container'>
        <div className='row align-items-center'>
          <div className='col-12 col-lg-5'>
            <div className='difference-three__thumb d-none d-lg-block'>
              <div className='difference-three__thumb-inner'>
                <div
                  className='thumb-lg'
                  data-aos='fade-right'
                  data-aos-duration={1000}
                >
                  <img
                    src='assets/images/difference/thumb-lg-two.png'
                    alt='Image_inner'
                  />
                </div>
                <div className='spade'>
                  <img
                    src='assets/images/difference/spade.png'
                    alt='Image_inner'
                    className='base-img'
                  />
                </div>
                <div
                  className='thumb-sm'
                  data-aos='fade-up'
                  data-aos-duration={1000}
                  data-aos-delay={300}
                >
                  <img
                    src='assets/images/difference/thub-sm-two.png'
                    alt='Image_inner'
                  />
                </div>
                <div className='line'>
                  <img
                    src='assets/images/difference/line.png'
                    alt='Image_inner'
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-lg-7'>
            <div className='difference-three__content'>
              <div className='section__content'>
                <span className='sub-title'>
                  <i className='icon-donation' />
                  Start donating poor people
                </span>
                <h2 className='title-animation_inner'>
                  Donate <span>Support</span> to giving Make a Difference
                </h2>
                <p>
                  Lorem Ipsum is simply dummy a of the printing and type setting
                  industry Loreaim Ipsum has been the industry's standard dummy
                </p>
              </div>
              <div className='differnce-quote'>
                <blockquote>
                  <q>
                    <span>Lorem ipsum dolor</span> sit amet consectetur
                    convallis ultrices sociis fermentum orci convallis
                  </q>
                </blockquote>
              </div>
              <div className='help__content-list'>
                <ul>
                  <li>
                    <i className='fa-regular fa-circle-check' /> Giving Hope,
                    Changing Lives
                  </li>
                  <li>
                    <i className='fa-regular fa-circle-check' /> Empower Through
                    Charity
                  </li>
                  <li>
                    <i className='fa-regular fa-circle-check' /> Together We Can
                  </li>
                  <li>
                    <i className='fa-regular fa-circle-check' /> Healing
                    Communities
                  </li>
                  <li>
                    <i className='fa-regular fa-circle-check' /> Every Act
                    Counts
                  </li>
                  <li>
                    <i className='fa-regular fa-circle-check' /> Compassion in
                    Action
                  </li>
                </ul>
              </div>
              <div className='difference-three-cta'>
                <Link
                  href='/about-us'
                  aria-label='about us'
                  title='about us'
                  className='btn--primary'
                >
                  About Us <i className='fa-solid fa-arrow-right' />
                </Link>
                <div className='author-info'>
                  <div className='author-thumb'>
                    <img src='assets/images/author-two.png' alt='Image_inner' />
                  </div>
                  <div className='author-content'>
                    <span>Software Engineer</span>
                    <h6>James Anderson</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DifferenceThree;
