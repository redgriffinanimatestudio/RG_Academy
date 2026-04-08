"use client";
import Link from "next/link";
import React, { useState } from "react";

const themes = [
  { name: "default-color", file: "assets/css/default-theme.css" },
  { name: "blue-color", file: "assets/css/blue-theme.css" },
  { name: "brown-color", file: "assets/css/brown-theme.css" },
  { name: "green-color", file: "assets/css/green-theme.css" },
  { name: "orange-color", file: "assets/css/orange-theme.css" },
  { name: "purple-color", file: "assets/css/purple-theme.css" },
  { name: "teal-color", file: "assets/css/teal-theme.css" },
  { name: "yellow-color", file: "assets/css/yellow-theme.css" },
];

const ColorPalate = () => {
  const [active, setActive] = useState(false);
  const [activeTheme, setActiveTheme] = useState("default-color");
  const [layout, setLayout] = useState(""); // 'box-layout'
  const [dark, setDark] = useState(false);
  const [stickyHeader, setStickyHeader] = useState(false);

  const handleColorActive = () => setActive((prev) => !prev);

  const handleThemeChange = (themeName, themeFile) => {
    const themeLink = document.getElementById("switch-color");
    if (themeLink) {
      themeLink.href = themeFile;
      setActiveTheme(themeName);
    }
  };

  const handleBoxLayout = (type) => {
    const body = document.body;
    if (type === "box") {
      body.classList.add("box-layout");
      setLayout("box");
    } else {
      body.classList.remove("box-layout");
      setLayout("full");
    }
  };

  const handleDarkVersion = (type) => {
    const body = document.body;
    if (type === "dark") {
      body.classList.add("dark-body");
      setDark(true);
    } else {
      body.classList.remove("dark-body");
      setDark(false);
    }
  };

  const handleStickyHeader = (type) => {
    const body = document.body;
    if (type === "sticky") {
      body.classList.add("want-sticky-header");
      setStickyHeader(true);
    } else {
      body.classList.remove("want-sticky-header");
      setStickyHeader(false);
    }
  };

  return (
    <div className={`color-palate ${active ? "visible-palate" : ""}`}>
      <button className='color-trigger' onClick={handleColorActive}>
        <i className='fa-solid fa-gear' />
      </button>
      <button className='close-color-trigger' onClick={handleColorActive}>
        <i className='fa-solid fa-xmark' />
      </button>

      <div className='color-palate-inner'>
        <div className='various-color clearfix'>
          <h6>Multiple Colors</h6>
          <br />
          <div className='colors-list'>
            {themes.map((theme, index) => (
              <span
                key={index}
                className={`palate ${theme.name} ${
                  activeTheme === theme.name ? "active" : ""
                }`}
                onClick={() => handleThemeChange(theme.name, theme.file)}
              />
            ))}
          </div>
        </div>

        <h6>Boxed Version</h6>
        <ul className='box-version option-box'>
          <li
            className={`box ${layout === "box" ? "active" : ""}`}
            onClick={() => handleBoxLayout("box")}
          >
            Boxed
          </li>
          <li
            className={`${layout === "full" ? "active" : ""}`}
            onClick={() => handleBoxLayout("full")}
          >
            Full width
          </li>
        </ul>

        <h6>Sticky Header</h6>
        <ul className='header-version option-box'>
          <li
            className={`${stickyHeader ? "active" : ""}`}
            onClick={() => handleStickyHeader("sticky")}
          >
            No
          </li>
          <li
            className={`box ${!stickyHeader ? "active" : ""}`}
            onClick={() => handleStickyHeader("no")}
          >
            Yes
          </li>
        </ul>

        <h6>Dark Version</h6>
        <ul className='dark-version option-box'>
          <li
            className={`box ${dark ? "active" : ""}`}
            onClick={() => handleDarkVersion("dark")}
          >
            Yes
          </li>
          <li
            className={`${!dark ? "active" : ""}`}
            onClick={() => handleDarkVersion("light")}
          >
            No
          </li>
        </ul>

        <div className='purchase-box'>
          <p>
            You will find much more options for colors and styling in admin
            panel. This color picker is used only for demonstration purposes.
          </p>
          <Link href='/' className='purchase-box__btn'>
            Buy Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ColorPalate;
