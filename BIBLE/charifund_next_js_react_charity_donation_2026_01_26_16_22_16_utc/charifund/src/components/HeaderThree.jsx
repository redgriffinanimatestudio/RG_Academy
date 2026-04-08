"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import NiceSelect from "nice-select2";
import AddToCart from "../helper/AddToCart";
const HeaderThree = () => {
  const countryRef = useRef(null);
  let pathname = usePathname();
  let [search, setSearch] = useState(false);
  let [canvas, setCanvas] = useState(false);
  let [backdrop, setBackdrop] = useState(false);
  let [mobileMenu, setMobileMenu] = useState(false);
  const [scroll, setScroll] = useState(false);
  const handleSearch = () => {
    setSearch(!search);
  };
  const handleMobileMenu = () => {
    setMobileMenu(!mobileMenu);
  };
  const handleCanvas = () => {
    setCanvas(!canvas);
  };
  const handleBackdrop = () => {
    setBackdrop(!backdrop);
  };

  useEffect(() => {
    window.onscroll = () => {
      if (window.pageYOffset < 150) {
        setScroll(false);
      } else if (window.pageYOffset > 150) {
        setScroll(true);
      }
      return () => (window.onscroll = null);
    };
  }, []);

  const mobileMenuListRef = useRef(null);

  useEffect(() => {
    const desktopMenu = document.querySelector(".navbar__menu");

    if (desktopMenu && mobileMenuListRef.current) {
      mobileMenuListRef.current.innerHTML = desktopMenu.innerHTML;

      const setupDropdownToggles = (container) => {
        const dropdownLabels = container.querySelectorAll(
          ".navbar__dropdown-label"
        );

        dropdownLabels.forEach((label) => {
          label.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();

            const subMenu = this.nextElementSibling;

            // ✅ Only close siblings within the same level (UL)
            const siblingLabels = Array.from(
              this.closest("ul")?.querySelectorAll(
                ":scope > li > .navbar__dropdown-label"
              ) || []
            );

            siblingLabels.forEach((sibling) => {
              const siblingSubMenu = sibling.nextElementSibling;

              if (
                sibling !== this &&
                siblingSubMenu &&
                siblingSubMenu.classList.contains("navbar__sub-menu")
              ) {
                siblingSubMenu.style.maxHeight = "0px";
                siblingSubMenu.classList.remove("show");
                sibling.classList.remove("navbar__item-active");
              }
            });

            // Toggle current submenu with smooth animation
            if (subMenu && subMenu.classList.contains("navbar__sub-menu")) {
              const isOpen = subMenu.classList.contains("show");

              if (isOpen) {
                subMenu.style.maxHeight = "0px";
                subMenu.classList.remove("show");
                this.classList.remove("navbar__item-active");
              } else {
                subMenu.classList.add("show");
                subMenu.style.maxHeight = subMenu.scrollHeight + "px";
                this.classList.add("navbar__item-active");
              }
            }
          });
        });
      };

      setupDropdownToggles(mobileMenuListRef.current);
    }
  }, []);

  useEffect(() => {
    if (countryRef.current) {
      new NiceSelect(countryRef.current);
    }
  }, []);

  return (
    <>
      <header className={`header header-tertiary ${scroll && "sticky-header"}`}>
        <div className='container'>
          <div className='row'>
            <div className='col-12'>
              <div className='main-header__menu-box'>
                <nav className='navbar p-0'>
                  <div className='navbar-logo'>
                    <Link href='/'>
                      <img src='/assets/images/logo.png' alt='Image_inner' />
                    </Link>
                  </div>

                  <div className='navbar__menu d-none d-xl-block'>
                    <ul className='navbar__list'>
                      <li
                        className={`navbar__item navbar__item--has-children nav-fade ${
                          pathname === "/" ? "active" : ""
                        }`}
                      >
                        <Link
                          href='#'
                          aria-label='dropdown menu'
                          className='navbar__dropdown-label dropdown-label-alter'
                        >
                          Home
                        </Link>
                        <ul className='navbar__sub-menu mega-menu'>
                          <li>
                            <div className='mega-content-wrapper'>
                              <img
                                src='/assets/images/home-one.png'
                                alt='Image_inner'
                              />
                              <div className='mega-content'>
                                <Link href='/' className='btn--primary'>
                                  Demo
                                </Link>
                              </div>
                            </div>
                            <Link href='/'>Home One</Link>
                          </li>
                          <li>
                            <div className='mega-content-wrapper'>
                              <img
                                src='/assets/images/home-two.png'
                                alt='Image_inner'
                              />
                              <div className='mega-content'>
                                <Link
                                  href='/index-two'
                                  className='btn--secondary'
                                >
                                  Demo
                                </Link>
                              </div>
                            </div>
                            <Link href='/index-two'>Home Two</Link>
                          </li>
                          <li>
                            <div className='mega-content-wrapper'>
                              <img
                                src='/assets/images/home-three.png'
                                alt='Image_inner'
                              />
                              <div className='mega-content'>
                                <Link
                                  href='/index-three'
                                  className='btn--primary'
                                >
                                  Demo
                                </Link>
                              </div>
                            </div>
                            <Link href='/index-three'>Home Three</Link>
                          </li>
                          <li>
                            <div className='mega-content-wrapper'>
                              <img
                                src='/assets/images/home-four.png'
                                alt='Image_inner'
                              />
                              <div className='mega-content'>
                                <Link
                                  href='/index-four'
                                  className='btn--primary'
                                >
                                  Demo
                                </Link>
                              </div>
                              <span className='new'>New</span>
                            </div>
                            <Link href='/index-four'>Home Four</Link>
                          </li>
                          <li>
                            <div className='mega-content-wrapper'>
                              <img
                                src='/assets/images/home-five.png'
                                alt='Image_inner'
                              />
                              <div className='mega-content'>
                                <Link
                                  href='/index-five'
                                  className='btn--primary'
                                >
                                  Demo
                                </Link>
                              </div>
                              <span className='new'>New</span>
                            </div>
                            <Link href='/index-five'>Home Five</Link>
                          </li>
                        </ul>
                      </li>
                      <li
                        className={`navbar__item nav-fade ${
                          ["/about-us"].includes(pathname) ? "active" : ""
                        }`}
                      >
                        <Link href='/about-us'>About Us</Link>
                      </li>
                      <li
                        className={`navbar__item navbar__item--has-children nav-fade ${
                          ["/our-causes", "/cause-details"].includes(pathname)
                            ? "active"
                            : ""
                        }`}
                      >
                        <Link
                          href='#'
                          aria-label='dropdown menu'
                          className='navbar__dropdown-label dropdown-label-alter'
                        >
                          Causes
                        </Link>
                        <ul className='navbar__sub-menu'>
                          <li
                            className={
                              ["/our-causes"].includes(pathname) ? "active" : ""
                            }
                          >
                            <Link href='/our-causes'>Our Causes</Link>
                          </li>
                          <li
                            className={
                              ["/cause-details"].includes(pathname)
                                ? "active"
                                : ""
                            }
                          >
                            <Link href='/cause-details'>Cause Details</Link>
                          </li>
                        </ul>
                      </li>
                      <li
                        className={`navbar__item navbar__item--has-children nav-fade ${
                          [
                            "/faq",
                            "/donate-us",
                            "/become-volunteer",
                            "/events",
                            "/event-details",
                            "/shop",
                            "/product-details",
                            "/cart",
                            "/checkout",
                          ].includes(pathname)
                            ? "active"
                            : ""
                        }`}
                      >
                        <Link
                          href='#'
                          aria-label='dropdown menu'
                          className='navbar__dropdown-label dropdown-label-alter'
                        >
                          Pages
                        </Link>
                        <ul className='navbar__sub-menu'>
                          <li
                            className={
                              ["/faq"].includes(pathname) ? "active" : ""
                            }
                          >
                            <Link href='/faq'>FAQ</Link>
                          </li>
                          <li
                            className={
                              ["/donate-us"].includes(pathname) ? "active" : ""
                            }
                          >
                            <Link href='/donate-us'>Donate Us</Link>
                          </li>
                          <li
                            className={
                              ["/become-volunteer"].includes(pathname)
                                ? "active"
                                : ""
                            }
                          >
                            <Link href='/become-volunteer'>
                              Become Volunteer
                            </Link>
                          </li>
                          <li
                            className={`navbar__item navbar__item--has-children ${
                              ["/events", "/event-details"].includes(pathname)
                                ? "active"
                                : ""
                            }`}
                          >
                            <Link
                              href='#'
                              aria-label='dropdown menu'
                              className='navbar__dropdown-label navbar__dropdown-label-sub'
                            >
                              Events
                            </Link>
                            <ul className='navbar__sub-menu navbar__sub-menu__nested'>
                              <li
                                className={
                                  ["/events"].includes(pathname) ? "active" : ""
                                }
                              >
                                <Link href='/events'>Events</Link>
                              </li>
                              <li
                                className={
                                  ["/event-details"].includes(pathname)
                                    ? "active"
                                    : ""
                                }
                              >
                                <Link href='/event-details'>Event Details</Link>
                              </li>
                            </ul>
                          </li>
                          <li
                            className={`navbar__item navbar__item--has-children ${
                              [
                                "/shop",
                                "/product-details",
                                "/cart",
                                "/checkout",
                              ].includes(pathname)
                                ? "active"
                                : ""
                            }`}
                          >
                            <Link
                              href='#'
                              aria-label='dropdown menu'
                              className='navbar__dropdown-label navbar__dropdown-label-sub'
                            >
                              Shop
                            </Link>
                            <ul className='navbar__sub-menu navbar__sub-menu__nested'>
                              <li
                                className={
                                  ["/shop"].includes(pathname) ? "active" : ""
                                }
                              >
                                <Link href='/shop'>Our Shop</Link>
                              </li>
                              <li
                                className={
                                  ["/product-details"].includes(pathname)
                                    ? "active"
                                    : ""
                                }
                              >
                                <Link href='/product-details'>
                                  Product Details
                                </Link>
                              </li>
                              <li
                                className={
                                  ["/cart"].includes(pathname) ? "active" : ""
                                }
                              >
                                <Link href='/cart'>View Cart</Link>
                              </li>
                              <li
                                className={
                                  ["/checkout"].includes(pathname)
                                    ? "active"
                                    : ""
                                }
                              >
                                <Link href='/checkout'>Cehckout</Link>
                              </li>
                            </ul>
                          </li>
                          <li
                            className={`navbar__item navbar__item--has-children ${
                              ["/our-team", "/team-details"].includes(pathname)
                                ? "active"
                                : ""
                            }`}
                          >
                            <Link
                              href='#'
                              aria-label='dropdown menu'
                              className='navbar__dropdown-label navbar__dropdown-label-sub'
                            >
                              Team
                            </Link>
                            <ul className='navbar__sub-menu navbar__sub-menu__nested'>
                              <li
                                className={
                                  ["/our-team"].includes(pathname)
                                    ? "active"
                                    : ""
                                }
                              >
                                <Link href='/our-team'>Our Teams</Link>
                              </li>
                              <li
                                className={
                                  ["/team-details"].includes(pathname)
                                    ? "active"
                                    : ""
                                }
                              >
                                <Link href='/team-details'>Team Details</Link>
                              </li>
                            </ul>
                          </li>
                          <li
                            className={
                              ["/coming-soon"].includes(pathname)
                                ? "active"
                                : ""
                            }
                          >
                            <Link href='/coming-soon'>Coming Soon</Link>
                          </li>
                          <li
                            className={
                              ["/404"].includes(pathname) ? "active" : ""
                            }
                          >
                            <Link href='/404'>Error</Link>
                          </li>
                        </ul>
                      </li>
                      <li
                        className={`navbar__item navbar__item--has-children nav-fade ${
                          [
                            "/blog-list",
                            "/blog-grid",
                            "/blog-details",
                          ].includes(pathname)
                            ? "active"
                            : ""
                        } `}
                      >
                        <Link
                          href='/'
                          aria-label='dropdown menu'
                          className='navbar__dropdown-label dropdown-label-alter'
                        >
                          News
                        </Link>
                        <ul className='navbar__sub-menu'>
                          <li
                            className={
                              ["/blog-list"].includes(pathname) ? "active" : ""
                            }
                          >
                            <Link href='/blog-list'>News List View</Link>
                          </li>
                          <li
                            className={
                              ["/blog-grid"].includes(pathname) ? "active" : ""
                            }
                          >
                            <Link href='/blog-grid'>News Grid View</Link>
                          </li>
                          <li
                            className={
                              ["/blog-details"].includes(pathname)
                                ? "active"
                                : ""
                            }
                          >
                            <Link href='/blog-details'>News Details</Link>
                          </li>
                        </ul>
                      </li>
                      <li
                        className={`navbar__item nav-fade ${
                          ["/contact-us"].includes(pathname) ? "active" : ""
                        } `}
                      >
                        <Link href='/contact-us'>Contact Us</Link>
                      </li>
                    </ul>
                  </div>

                  <div className='navbar__options'>
                    <div className='navbar__mobile-options '>
                      <div className='select-country d-none d-xxl-block'>
                        <select
                          ref={countryRef}
                          name='country'
                          defaultValue={"English"}
                          className='country-select select one'
                        >
                          <option data-display='<i class="fi-gb-eng"></i> English'>
                            English
                          </option>
                          <option data-display='<i class="fi-us"></i> Spanish'>
                            Spanish
                          </option>
                          <option data-display='<i class="fi-cn"></i> Chinese'>
                            Chinese
                          </option>
                          <option data-display='<i class="fi-it"></i> Italian'>
                            Italian
                          </option>
                        </select>
                      </div>
                      <div className='cart-box'>
                        <button
                          onClick={handleBackdrop}
                          className='open-cart cart'
                          aria-label='cart'
                          title='open cart'
                        >
                          <span>0</span>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width={18}
                            height={24}
                            viewBox='0 0 18 24'
                            fill='none'
                          >
                            <path
                              d='M8.51049 0C7.26729 0 6.07501 0.49386 5.19593 1.37294C4.31685 2.25201 3.82299 3.4443 3.82299 4.6875V5.46875H3.17456C2.51683 5.46806 1.88419 5.72107 1.40832 6.1751C0.932455 6.62914 0.650039 7.24922 0.619869 7.90625L0.00268136 20.7578C-0.0131401 21.1034 0.0411781 21.4486 0.162362 21.7726C0.283546 22.0967 0.469085 22.3928 0.707797 22.6432C0.946509 22.8936 1.23345 23.093 1.55132 23.2296C1.8692 23.3661 2.21142 23.4368 2.55737 23.4375H14.4636C14.8096 23.4368 15.1518 23.3661 15.4697 23.2296C15.7875 23.093 16.0745 22.8936 16.3132 22.6432C16.5519 22.3928 16.7374 22.0967 16.8586 21.7726C16.9798 21.4486 17.0341 21.1034 17.0183 20.7578L16.4011 7.90625C16.3709 7.24922 16.0885 6.62914 15.6127 6.1751C15.1368 5.72107 14.5042 5.46806 13.8464 5.46875H13.198V4.6875C13.198 3.4443 12.7041 2.25201 11.8251 1.37294C10.946 0.49386 9.7537 0 8.51049 0ZM5.38549 4.6875C5.38549 3.8587 5.71473 3.06384 6.30078 2.47779C6.88684 1.89174 7.68169 1.5625 8.51049 1.5625C9.3393 1.5625 10.1342 1.89174 10.7202 2.47779C11.3063 3.06384 11.6355 3.8587 11.6355 4.6875V5.46875H5.38549V4.6875ZM14.8386 7.97656L15.4558 20.8359C15.4607 20.9703 15.4391 21.1043 15.3922 21.2303C15.3452 21.3563 15.274 21.4719 15.1824 21.5703C15.0888 21.6663 14.9771 21.7428 14.8537 21.7951C14.7303 21.8474 14.5977 21.8746 14.4636 21.875H2.55737C2.42332 21.8746 2.29071 21.8474 2.16729 21.7951C2.04388 21.7428 1.93214 21.6663 1.83862 21.5703C1.74703 21.4719 1.67575 21.3563 1.62883 21.2303C1.58191 21.1043 1.56028 20.9703 1.56518 20.8359L2.18237 7.97656C2.19443 7.72163 2.30426 7.48114 2.48904 7.30509C2.67382 7.12904 2.91934 7.03096 3.17456 7.03125H13.8464C14.1017 7.03096 14.3472 7.12904 14.5319 7.30509C14.7167 7.48114 14.8266 7.72163 14.8386 7.97656Z'
                              fill='black'
                            />
                            <path
                              d='M4.88672 9.52344C5.31819 9.52344 5.66797 9.17366 5.66797 8.74219C5.66797 8.31072 5.31819 7.96094 4.88672 7.96094C4.45525 7.96094 4.10547 8.31072 4.10547 8.74219C4.10547 9.17366 4.45525 9.52344 4.88672 9.52344Z'
                              fill='black'
                            />
                            <path
                              d='M12.1367 9.52344C12.5682 9.52344 12.918 9.17366 12.918 8.74219C12.918 8.31072 12.5682 7.96094 12.1367 7.96094C11.7052 7.96094 11.3555 8.31072 11.3555 8.74219C11.3555 9.17366 11.7052 9.52344 12.1367 9.52344Z'
                              fill='black'
                            />
                          </svg>
                        </button>
                      </div>
                      <div className='sidenav-box d-none d-xl-block'>
                        <button
                          onClick={handleCanvas}
                          className='open-sidenav'
                          aria-label='sidenav'
                          title='open sidenav'
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width={28}
                            height={26}
                            viewBox='0 0 28 26'
                            fill='none'
                          >
                            <ellipse
                              cx='2.39023'
                              cy='2.39022'
                              rx='2.39023'
                              ry='2.39022'
                              fill='#FFC107'
                            />
                            <ellipse
                              cx='13.9146'
                              cy='2.39022'
                              rx='2.39023'
                              ry='2.39022'
                              fill='black'
                            />
                            <ellipse
                              cx='25.44'
                              cy='2.39022'
                              rx='2.39023'
                              ry='2.39022'
                              fill='black'
                            />
                            <ellipse
                              cx='2.39023'
                              cy='12.6334'
                              rx='2.39023'
                              ry='2.39022'
                              fill='black'
                            />
                            <ellipse
                              cx='13.9146'
                              cy='12.6344'
                              rx='2.39023'
                              ry='2.39022'
                              fill='#FFC107'
                            />
                            <ellipse
                              cx='25.44'
                              cy='12.6344'
                              rx='2.39023'
                              ry='2.39022'
                              fill='black'
                            />
                            <ellipse
                              cx='2.39023'
                              cy='23.0484'
                              rx='2.39023'
                              ry='2.39022'
                              fill='black'
                            />
                            <ellipse
                              cx='13.9996'
                              cy='23.0484'
                              rx='2.39023'
                              ry='2.39022'
                              fill='black'
                            />
                            <ellipse
                              cx='25.61'
                              cy='23.0484'
                              rx='2.39023'
                              ry='2.39022'
                              fill='#FFC107'
                            />
                          </svg>
                        </button>
                      </div>
                      <Link
                        href='/donate-us'
                        className='btn--secondary d-none d-md-flex'
                      >
                        Donate Now <i className='fa-solid fa-arrow-right' />
                      </Link>
                    </div>
                    <button
                      onClick={handleMobileMenu}
                      className='open-offcanvas-nav d-flex d-xl-none'
                      aria-label='toggle mobile menu'
                      title='open offcanvas menu'
                    >
                      <span className='icon-bar top-bar' />
                      <span className='icon-bar middle-bar' />
                      <span className='icon-bar bottom-bar' />
                    </button>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`${
            search ? "search-active search-popup" : "search-popup"
          }`}
        >
          <button
            onClick={handleSearch}
            className='close-search'
            aria-label='close search box'
            title='close search box'
          >
            <i className='fa-solid fa-xmark' />
          </button>
          <form action='#' method='post'>
            <div className='search-popup__group'>
              <input
                type='text'
                name='search-field'
                id='searchField'
                placeholder='Search....'
                required=''
              />
              <button
                type='submit'
                aria-label='search products'
                title='search products'
              >
                <i className='fa-solid fa-magnifying-glass' />
              </button>
            </div>
          </form>
        </div>
      </header>

      <div
        className={`mobile-menu mobile-menu--primary d-block d-xxl-none ${
          mobileMenu ? "show-menu" : ""
        }`}
      >
        <nav className='mobile-menu__wrapper'>
          <div className='mobile-menu__header nav-fade'>
            <div className='logo'>
              <Link href='/' aria-label='home page' title='logo'>
                <img src='/assets/images/logo.png' alt='Image_inner' />
              </Link>
            </div>
            <button
              onClick={handleMobileMenu}
              aria-label='close mobile menu'
              className='close-mobile-menu'
            >
              <i className='fa-solid fa-xmark' />
            </button>
          </div>
          <div className='mobile-menu__list' ref={mobileMenuListRef}></div>

          <div className='mobile-menu__cta nav-fade d-block d-md-none'>
            <Link href='/donate-us' className='btn--primary '>
              Donate Now <i className='fa-solid fa-arrow-right' />
            </Link>
          </div>
          <div className='mobile-menu__social social nav-fade'>
            <Link
              href='https://www.facebook.com/'
              target='_blank'
              aria-label='share us on facebook'
              title='facebook'
            >
              <i className='fa-brands fa-facebook-f' />
            </Link>
            <Link
              href='https://vimeo.com/'
              target='_blank'
              aria-label='share us on vimeo'
              title='vimeo'
            >
              <i className='fa-brands fa-vimeo-v' />
            </Link>
            <Link
              href='https://x.com/'
              target='_blank'
              aria-label='share us on twitter'
              title='twitter'
            >
              <i className='fa-brands fa-twitter' />
            </Link>
            <Link
              href='https://www.linkedin.com/'
              target='_blank'
              aria-label='share us on linkedin'
              title='linkedin'
            >
              <i className='fa-brands fa-linkedin-in' />
            </Link>
          </div>
        </nav>
      </div>

      <div
        className={`mobile-menu__backdrop ${
          mobileMenu ? "mobile-menu__backdrop-active" : ""
        }`}
      ></div>

      {/* ==== off canvas start ==== */}
      <>
        <div
          className={`off-canvas d-none d-xl-block ${
            canvas && "off-canvas-active"
          } `}
        >
          <div className='off-canvas__inner'>
            <div className='off-canvas__head'>
              <Link href='/'>
                <img src='/assets/images/logo.png' alt='Logo' />
              </Link>
              <button
                onClick={handleCanvas}
                aria-label='close off canvas'
                className='off-canvas-close'
              >
                <i className='fa-solid fa-xmark' />
              </button>
            </div>
            <div className='offcanvas__search'>
              <form action='#'>
                <input
                  type='text'
                  placeholder='What are you searching for?'
                  required=''
                />
                <button type='submit'>
                  <i className='icon-search' />
                </button>
              </form>
            </div>
            <div className='off-canvas__contact'>
              <h5>Contact Info</h5>
              <div className='single'>
                <span>
                  <i className='fa-solid fa-phone-volume' />
                </span>
                <a href='tel:253-556-7777'>(+1) 253 556-7777</a>
              </div>
              <div className='single'>
                <span>
                  <i className='fa-solid fa-envelope' />
                </span>
                <a href='mailto:example@support.com'>example@support.com</a>
              </div>
              <div className='single'>
                <span>
                  <i className='fa-solid fa-location-dot' />
                </span>
                <a
                  target='_blank'
                  href='https://www.google.com/maps/place/Narbethong+QLD+4725,+Australia/@-23.8173641,145.3223283,11z/data=!3m1!4b1!4m15!1m8!3m7!1s0x2b2bfd076787c5df:0x538267a1955b1352!2sAustralia!3b1!8m2!3d-25.274398!4d133.775136!16zL20vMGNoZ2h5!3m5!1s0x6bcacfb51d7e5257:0x400eef17f209750!8m2!3d-23.8656897!4d145.5354411!16s%2Fg%2F1wd3w6zw'
                  rel='noreferrer'
                >
                  Narbethong Queensland 4725 Australia
                </a>
              </div>
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
        <div
          className={`off-canvas-backdrop ${
            canvas && "off-canvas-backdrop-active"
          } `}
        />
      </>
      {/* ==== / off canvas end ==== */}
      <>
        {/* ==== sidebar cart start ==== */}
        <div className={`sidebar-cart ${backdrop && "sidebar-cart-active"} `}>
          <div className='der'>
            <button onClick={handleBackdrop} className='close-cart'>
              <span className='close-icon'>X</span>
            </button>
            <h2>
              Shopping Bag
              <span className='count'>2</span>
            </h2>
            <div className='cart-items'>
              <AddToCart />
              <AddToCart />
            </div>
            <div className='totals'>
              <div className='subtotal'>
                <span className='label'>Subtotal:</span>
                <span className='amount '>
                  $<span className='total-price'>0.00</span>
                </span>
              </div>
            </div>
            <div className='action-buttons'>
              <Link
                className='view-cart-button'
                href='/cart'
                aria-label='go to cart'
              >
                Cart
              </Link>
              <Link
                className='checkout-button'
                href='/checkout'
                aria-label='go to checkout'
              >
                Checkout
                <i className='fa-solid fa-arrow-right-long' />
              </Link>
            </div>
          </div>
        </div>
        <div
          className={`cart-backdrop ${backdrop && "cart-backdrop-active"} `}
        />
      </>
    </>
  );
};

export default HeaderThree;
