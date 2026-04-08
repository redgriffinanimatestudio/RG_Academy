import Link from "next/link";

const BlogThree = () => {
  return (
    <section className='blog fc-blog'>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-12 col-md-8 col-xl-7'>
            <div
              className='section__header text-center'
              data-aos='fade-up'
              data-aos-duration={1000}
            >
              <span className='sub-title'>We are always open for children</span>
              <h2 className='title-animation_inner mt-0'>
                Our Latest News &amp; Articles you like
              </h2>
            </div>
          </div>
        </div>
        <div className='row gutter-40'>
          <div className='col-12 col-lg-6 col-xl-4'>
            <div
              className='blog__single-wrapper'
              data-aos='fade-up'
              data-aos-duration={1000}
            >
              <div className='blog__single van-tilt'>
                <div className='blog__single-thumb'>
                  <Link href='/blog-details'>
                    <img src='assets/images/blog/one.png' alt='Image_inner' />
                  </Link>
                  <div className='tag'>
                    <span>25</span>
                    <span>Sep</span>
                  </div>
                </div>
                <div className='blog__single-inner'>
                  <div className='blog__single-content'>
                    <span className='e-tag'>e-Learning</span>
                    <h6>
                      <Link href='/blog-details'>
                        IT Service Case Studies Accelerate Business Fly Success
                        Tech
                      </Link>
                    </h6>
                  </div>
                  <div className='blog__single-meta mb-0'>
                    <p>
                      <i className='icon-user' />
                      Robert Fox
                    </p>
                    <p>
                      <i className='icon-message' />
                      Comments (03)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-lg-6 col-xl-4'>
            <div
              className='blog__single-wrapper'
              data-aos='fade-up'
              data-aos-duration={1000}
            >
              <div className='blog__single van-tilt'>
                <div className='blog__single-thumb'>
                  <Link href='/blog-details'>
                    <img src='assets/images/blog/two.png' alt='Image_inner' />
                  </Link>
                  <div className='tag'>
                    <span>25</span>
                    <span>Sep</span>
                  </div>
                </div>
                <div className='blog__single-inner'>
                  <div className='blog__single-content'>
                    <span className='e-tag'>e-Learning</span>
                    <h6>
                      <Link href='/blog-details'>
                        IT Service Case Studies Accelerate Business Fly Success
                        Tech
                      </Link>
                    </h6>
                  </div>
                  <div className='blog__single-meta mb-0'>
                    <p>
                      <i className='icon-user' />
                      Robert Fox
                    </p>
                    <p>
                      <i className='icon-message' />
                      Comments (03)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-lg-6 col-xl-4'>
            <div
              className='blog__single-wrapper'
              data-aos='fade-up'
              data-aos-duration={1000}
            >
              <div className='blog__single van-tilt'>
                <div className='blog__single-thumb'>
                  <Link href='/blog-details'>
                    <img src='assets/images/blog/three.png' alt='Image_inner' />
                  </Link>
                  <div className='tag'>
                    <span>25</span>
                    <span>Sep</span>
                  </div>
                </div>
                <div className='blog__single-inner'>
                  <div className='blog__single-content'>
                    <span className='e-tag'>e-Learning</span>
                    <h6>
                      <Link href='/blog-details'>
                        IT Service Case Studies Accelerate Business Fly Success
                        Tech
                      </Link>
                    </h6>
                  </div>
                  <div className='blog__single-meta mb-0'>
                    <p>
                      <i className='icon-user' />
                      Robert Fox
                    </p>
                    <p>
                      <i className='icon-message' />
                      Comments (03)
                    </p>
                  </div>
                </div>
              </div>
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

export default BlogThree;
