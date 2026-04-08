"use client";
import { useEffect, useRef } from "react";
import NiceSelect from "nice-select2";

const TopBarTwo = () => {
  const currencyRef_two = useRef(null);
  const countryRef_two = useRef(null);

  useEffect(() => {
    if (currencyRef_two.current) {
      new NiceSelect(currencyRef_two.current);
    }
    if (countryRef_two.current) {
      new NiceSelect(countryRef_two.current);
    }
  }, []);
  return (
    <div className="topbar two d-none d-lg-block">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-12 col-lg-6">
            <div className="topbar__list-wrapper">
              <ul className="topbar__list">
                <li>
                  <a href="mailto:support@example.com">
                    <i className="fa-regular fa-envelope" />
                    support@example.com
                  </a>
                </li>
                <li>
                  <a href="tel:2305-587-3407">
                    <i className="fa-solid fa-phone" />
                    +2(305) 587-3407
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="topbar__items justify-content-end">
              <div className="select-currency">
                <select
                  ref={countryRef_two}
                  name="country"
                  defaultValue={"English"}
                  className="country-select select two"
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
              <div className="select-country">
                <select
                  ref={currencyRef_two}
                  name="currency"
                  defaultValue={"usd"}
                  className="currency-select select two"
                >
                  <option value="usd">USD</option>
                  <option value="gbp">GBP</option>
                  <option value="aud">AUD</option>
                  <option value="euro">Euro</option>
                </select>
              </div>

              <div className="social">
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  aria-label="share us on facebook"
                  title="facebook"
                  rel="noreferrer"
                >
                  <i className="fa-brands fa-facebook-f" />
                </a>
                <a
                  href="https://vimeo.com/"
                  target="_blank"
                  aria-label="share us on vimeo"
                  title="vimeo"
                  rel="noreferrer"
                >
                  <i className="fa-brands fa-vimeo-v" />
                </a>
                <a
                  href="https://x.com/"
                  target="_blank"
                  aria-label="share us on twitter"
                  title="twitter"
                  rel="noreferrer"
                >
                  <i className="fa-brands fa-twitter" />
                </a>
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  aria-label="share us on linkedin"
                  title="linkedin"
                  rel="noreferrer"
                >
                  <i className="fa-brands fa-linkedin-in" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBarTwo;
