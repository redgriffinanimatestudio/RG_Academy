import Link from "next/link";

const BlogListInner = () => {
  return (
    <section className='blog-main cm-details'>
      <div className='container'>
        <div className='row gutter-60'>
          <div className='col-12 col-xl-8'>
            <div
              className='blog__single'
              data-aos='fade-up'
              data-aos-duration={1000}
              data-aos-delay={100}
            >
              <div className='blog__single-thumb'>
                <Link href='/blog-details'>
                  <img src='assets/images/blog/four.png' alt='Image_inner' />
                </Link>
                <div className='tag'>
                  <Link href='/blog-list'>
                    <i className='fa-solid fa-tags' />
                    Health
                  </Link>
                </div>
              </div>
              <div className='blog__single-inner'>
                <div className='blog__single-meta'>
                  <p>
                    <i className='icon-user' />
                    Robert Fox
                  </p>
                  <p>
                    <i className='icon-message' />
                    Comments (03)
                  </p>
                </div>
                <div className='blog__single-content'>
                  <h4>
                    <Link href='/blog-details'>
                      The whimsically named Egg Canvas brainch{" "}
                    </Link>
                  </h4>
                  <p>
                    There are many variations of passages of Lorem Ipsum
                    available, but majority have suffered teration in some form,
                    by injected humour, or randomised words which don't look
                    even slight believable. If you are going to use a passage of
                    Lorem Ipsum.
                  </p>
                </div>
                <div className='blog__single-cta'>
                  <Link
                    href='/blog-details'
                    aria-label='blog details'
                    title='blog details'
                  >
                    Read More
                    <i className='fa-solid fa-arrow-right-long' />
                  </Link>
                </div>
              </div>
            </div>
            <div
              className='blog__single cta'
              data-aos='fade-up'
              data-aos-duration={1000}
              data-aos-delay={100}
            >
              <div className='blog__single-thumb'>
                <Link href='/blog-details'>
                  <img src='assets/images/blog/five.png' alt='Image_inner' />
                </Link>
                <div className='tag'>
                  <Link href='/blog-list'>
                    <i className='fa-solid fa-tags' />
                    Education
                  </Link>
                </div>
              </div>
              <div className='blog__single-inner'>
                <div className='blog__single-meta'>
                  <p>
                    <i className='icon-user' />
                    Robert Fox
                  </p>
                  <p>
                    <i className='icon-message' />
                    Comments (03)
                  </p>
                </div>
                <div className='blog__single-content'>
                  <h4>
                    <Link href='/blog-details'>
                      The whimsically named Egg Canvas brainch{" "}
                    </Link>
                  </h4>
                  <p>
                    There are many variations of passages of Lorem Ipsum
                    available, but majority have suffered teration in some form,
                    by injected humour, or randomised words which don't look
                    even slight believable. If you are going to use a passage of
                    Lorem Ipsum.
                  </p>
                </div>
                <div className='blog__single-cta'>
                  <Link
                    href='/blog-details'
                    aria-label='blog details'
                    title='blog details'
                  >
                    Read More
                    <i className='fa-solid fa-arrow-right-long' />
                  </Link>
                </div>
              </div>
            </div>
            <div
              className='blog__single cta'
              data-aos='fade-up'
              data-aos-duration={1000}
              data-aos-delay={100}
            >
              <div className='blog__single-thumb'>
                <Link href='/blog-details'>
                  <img src='assets/images/blog/six.png' alt='Image_inner' />
                </Link>
                <div className='tag'>
                  <Link href='/blog-list'>
                    <i className='fa-solid fa-tags' />
                    Donation
                  </Link>
                </div>
              </div>
              <div className='blog__single-inner'>
                <div className='blog__single-meta'>
                  <p>
                    <i className='icon-user' />
                    Robert Fox
                  </p>
                  <p>
                    <i className='icon-message' />
                    Comments (03)
                  </p>
                </div>
                <div className='blog__single-content'>
                  <h4>
                    <Link href='/blog-details'>
                      The whimsically named Egg Canvas brainch{" "}
                    </Link>
                  </h4>
                  <p>
                    There are many variations of passages of Lorem Ipsum
                    available, but majority have suffered teration in some form,
                    by injected humour, or randomised words which don't look
                    even slight believable. If you are going to use a passage of
                    Lorem Ipsum.
                  </p>
                </div>
                <div className='blog__single-cta'>
                  <Link
                    href='/blog-details'
                    aria-label='blog details'
                    title='blog details'
                  >
                    Read More
                    <i className='fa-solid fa-arrow-right-long' />
                  </Link>
                </div>
              </div>
            </div>
            <div
              className='pagination-wrapper'
              data-aos='fade-up'
              data-aos-duration={1000}
              data-aos-delay={100}
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
          <div className='col-12 col-xl-4'>
            <div className='blog-main__sidebar'>
              <div
                className='cm-details-author cm-sidebar-widget'
                data-aos='fade-up'
                data-aos-duration={1000}
                data-aos-delay={100}
              >
                <div className='author-thumb'>
                  <img src='assets/images/author-two.png' alt='Image_inner' />
                </div>
                <div className='author-meta'>
                  <h6>Rosalina Willaim</h6>
                  <p>Front End Developer</p>
                  <p>
                    he whimsically named Egg Canvas is the design director and
                    photographer in New York.
                  </p>
                </div>
                <div className='social'>
                  <a
                    href='https://www.facebook.com/'
                    target='_blank'
                    aria-label='share us on facebook'
                    title='facebook'
                    rel='noreferrer'
                  >
                    <i className='fa-brands fa-facebook-f' />
                  </a>
                  <a
                    href='https://vimeo.com/'
                    target='_blank'
                    aria-label='share us on vimeo'
                    title='vimeo'
                    rel='noreferrer'
                  >
                    <i className='fa-brands fa-vimeo-v' />
                  </a>
                  <a
                    href='https://x.com/'
                    target='_blank'
                    aria-label='share us on twitter'
                    title='twitter'
                    rel='noreferrer'
                  >
                    <i className='fa-brands fa-twitter' />
                  </a>
                  <a
                    href='https://www.linkedin.com/'
                    target='_blank'
                    aria-label='share us on linkedin'
                    title='linkedin'
                    rel='noreferrer'
                  >
                    <i className='fa-brands fa-linkedin-in' />
                  </a>
                </div>
              </div>
              <div className='cm-details__sidebar'>
                <div
                  className='cm-sidebar-widget'
                  data-aos='fade-up'
                  data-aos-duration={1000}
                  data-aos-delay={100}
                >
                  <div className='intro'>
                    <h5>search here</h5>
                  </div>
                  <form action='#' method='post'>
                    <input
                      type='text'
                      name='search-product'
                      id='searchProduct'
                      placeholder='Search Here...'
                      required=''
                    />
                    <button type='submit'>
                      <i className='fa-solid fa-magnifying-glass' />
                    </button>
                  </form>
                </div>
                <div
                  className='cm-sidebar-widget'
                  data-aos='fade-up'
                  data-aos-duration={1000}
                  data-aos-delay={100}
                >
                  <div className='intro'>
                    <h5>Recent Posts</h5>
                  </div>
                  <div className='cm-sidebar-post'>
                    <div className='single-item'>
                      <div className='thumb'>
                        <Link href='/blog-details'>
                          <img
                            src='assets/images/blog/ph-one.png'
                            alt='Image_inner'
                          />
                        </Link>
                      </div>
                      <div className='content'>
                        <p>
                          <i className='fa-solid fa-calendar-days' />{" "}
                          <span>November 19, 2024</span>
                        </p>
                        <p>
                          <Link href='/blog-details'>
                            Where Innovation Meets Foundation
                          </Link>
                        </p>
                      </div>
                    </div>
                    <div className='single-item'>
                      <div className='thumb'>
                        <Link href='/blog-details'>
                          <img
                            src='assets/images/blog/ph-two.png'
                            alt='Image_inner'
                          />
                        </Link>
                      </div>
                      <div className='content'>
                        <p>
                          <i className='fa-solid fa-calendar-days' />{" "}
                          <span>November 19, 2024</span>
                        </p>
                        <p>
                          <Link href='/blog-details'>
                            Where Innovation Meets Foundation
                          </Link>
                        </p>
                      </div>
                    </div>
                    <div className='single-item'>
                      <div className='thumb'>
                        <Link href='/blog-details'>
                          <img
                            src='assets/images/blog/three.png'
                            alt='Image_inner'
                          />
                        </Link>
                      </div>
                      <div className='content'>
                        <p>
                          <i className='fa-solid fa-calendar-days' />{" "}
                          <span>November 22, 2024</span>
                        </p>
                        <p>
                          <Link href='/blog-details'>
                            Structures That Stand, Dreams That Soar
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className='cm-sidebar-widget'
                  data-aos='fade-up'
                  data-aos-duration={1000}
                  data-aos-delay={100}
                >
                  <div className='intro'>
                    <h5>Categories</h5>
                  </div>
                  <div className='cm-categories'>
                    <Link href='/blog-list'>
                      <span>Donation</span>
                      <span>05</span>
                    </Link>
                    <Link href='/blog-list'>
                      <span>Charity</span>
                      <span>02</span>
                    </Link>
                    <Link href='/blog-list'>
                      <span>Volunteer</span>
                      <span>09</span>
                    </Link>
                    <Link href='/blog-list'>
                      <span>Health</span>
                      <span>07</span>
                    </Link>
                    <Link href='/blog-list'>
                      <span>Education</span>
                      <span>04</span>
                    </Link>
                  </div>
                </div>
                <div
                  className='cm-sidebar-widget'
                  data-aos='fade-up'
                  data-aos-duration={1000}
                  data-aos-delay={100}
                >
                  <div className='intro'>
                    <h5>Popular Tags</h5>
                  </div>
                  <div className='tag-wrapper'>
                    <Link href='/shop'>t-shirt</Link>
                    <Link href='/shop'>Banner Design</Link>
                    <Link href='/shop'>Brochures</Link>
                    <Link href='/shop'>Landing</Link>
                    <Link href='/shop'>Print</Link>
                    <Link href='/shop'>Business Card</Link>
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

export default BlogListInner;
