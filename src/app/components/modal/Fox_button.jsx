import React, { useState, useEffect } from "react";
import "./fox_button.css";

function Fox_button({ isLampOn, setIsLampOn }) {
    const [isSwitchOn, setIsSwitchOn] = useState(isLampOn);

    const handleSwitchChange = () => {
        const newIsOn = !isSwitchOn;
        setIsSwitchOn(newIsOn);
        setIsLampOn(newIsOn);
      };

    useEffect(() => {
        setIsSwitchOn(isLampOn);
    }, [isLampOn]);

    return (
        <div className="Switchnew">
            <div className="the-container">
                <input
                    type="checkbox"
                    id="toggle"
                    // Set the checked attribute based on isLampOn state
                    checked={isLampOn}
                    // Call the handleSwitchChange function when the checkbox is clicked
                    onChange={handleSwitchChange}
                />
                <label htmlFor="toggle"></label>

                <div className="day-night-cont">
                    <span className="the-sun"></span>
                    <div className="the-moon">
                        <span className="moon-inside"></span>
                    </div>
                </div>

                <div className={`switch ${isLampOn ? 'true' : 'false'}`}>
                    <div className="button">
                        <div className="b-inside"></div>
                    </div>
                </div>

                <div className={`c-window ${isLampOn ? 'true' : 'false'}`}>
                    <span className="the-sun"></span>
                    <span className="the-moon"></span>

                    <div className="the-fox">
                        <div className="fox-face">
                            <section className="eyes left"></section>
                            <section className="eyes right"></section>
                            <span className="nose"></span>
                            <div className="white-part">
                                <span className="mouth"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default Fox_button;