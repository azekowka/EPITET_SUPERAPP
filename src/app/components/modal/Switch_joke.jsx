import React, { useState, useEffect } from "react";
import "./switch_joke.css";

function Switch_joke({ isLampOn, setIsLampOn }) {
  const [isSwitchOn, setIsSwitchOn] = useState(isLampOn);

  const handleSwitchChange = () => {
    const newIsOn = !isSwitchOn;
    setIsSwitchOn(newIsOn);
    setIsLampOn(newIsOn);
  };

  return (
    <div className="Switch">
      <div id="lamp" className={isLampOn ? "lamp-on" : ""}>
        <input type="checkbox" id="switchToggle" name="switchToggle" />
        <input
          type="radio"
          className="switch-on"
          name="switch"
          value="on"
          checked={isLampOn}
          onChange={handleSwitchChange}
        />

        <input
          type="radio"
          className="switch-off"
          name="switch"
          value="off"
          checked={!isLampOn}
          onChange={handleSwitchChange}
        />
        <label
          htmlFor="switch-on"
          className={`entypo-lamp ${isLampOn ? "on" : "off"}`}
        ></label>
        <div className={`lamp ${isLampOn ? "on" : "off"}`}>
          <div className="gonna-give-light"></div>
        </div>
      </div>

    </div>
  );
}


export default Switch_joke;