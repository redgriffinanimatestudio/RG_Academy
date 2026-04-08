const TopBarFive = () => {
  return (
    <div className='topbar topbar--secondary topbar--quaternary topbar-five d-none d-lg-block'>
      <div className='container'>
        <div className='row'>
          <div className='col-12'>
            <div className='topbar__inner'>
              <div className='row align-items-center gutter-12'>
                <div className='col-12 col-lg-9 col-xxl-7'>
                  <div className='topbar__list-wrapper'>
                    <ul className='topbar__list justify-content-center justify-content-xxl-start'>
                      <li>
                        <i className='fa-solid fa-comment-dots' /> Helpline:{" "}
                        <a href='tel:2305-587-3407'>+2(305) 587-3407</a>
                      </li>
                      <li>
                        <span className='divider' />
                      </li>
                      <li>
                        <a href='mailto:example@info.com'>example@info.com</a>
                      </li>
                      <li>
                        <span className='divider' />
                      </li>
                      <li>
                        <a
                          href='https://maps.app.goo.gl/Gr9pTNqz5FRNrjQw8'
                          target='_blank'
                          rel='noreferrer'
                        >
                          54 Berrick St Boston MA 02115
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className='col-12 col-lg-3 col-xxl-5'>
                  <div className='topbar-five-extra justify-content-end'>
                    <div className='topbar__extra text-center justify-content-center justify-content-xxl-end d-none d-xxl-flex'>
                      <p>
                        Updates: Delivers Personal Protective Equipments to
                        North.
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBarFive;
