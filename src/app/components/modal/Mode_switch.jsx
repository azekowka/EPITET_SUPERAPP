import React, { useState } from "react";
import "./mode_switch.css";

function ModeSwitch({ isNormal, setIsNormal }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSwitchMode = (newMode) => {
    setIsNormal(newMode);
    setMenuOpen(false); //закрываем меню, при нажатии
  };

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className={`menu-wrap ${menuOpen ? "open" : ""}`}>
      <input type="checkbox" className="toggler" checked={menuOpen} onChange={handleMenuToggle} />
      <label className="hamburger" htmlFor="menu-toggle" onClick={handleMenuToggle}>
        <img
          className={`hamburger-image ${isNormal ? "true" : "false"}`}
          src={isNormal ? "smile.png" : "clown.png"}
          alt=""
        />
      </label>
      <div className="menu">
        <div>
          <div className="line">
            <ul>
              <li>
                <div className="photo_joke" onClick={() => handleSwitchMode(false)}>
                  <img src="./clown_mem.png" alt="" />
                  <div className="text_joke">
                    <a id="text">Шуточная версия</a>
                  </div>
                </div>
              </li>
              <li>
                <div className="photo_normal" onClick={() => handleSwitchMode(true)}>
                  <img src="./smile_mem.png" alt="" />
                  <div className="text_normal">
                    <a id="text">Нормальная версия</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModeSwitch;
