'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './page.css';
import Modal from './components/modal/Modal.jsx';
import CursorFollower from './components/modal/CursorFollower.jsx';
import Switch_joke from './components/modal/Switch_joke';
import Mode_switch from './components/modal/Mode_switch';
import Fox_button from './components/modal/Fox_button';

function Page() {
  const [show, setShow] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [epithetsData, setEpithetsData] = useState([]);
  const [selectedContainerIndex, setSelectedContainerIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLampOn, setIsLampOn] = useState(false);
  const [isNormal, setIsNormal] = useState(true);
  const [isQuotes, setIsQuotes] = useState(false);
  const [generatedQuotes, setGeneratedQuotes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [warningMessage, setWarningMessage] = useState(null);
  const MAX_WORDS_IN_QUOTE = 2;
  const MAX_WORDS_IN_MESSAGE = 1;
    // Состояние для отслеживания, показана ли подсказка или нет
    const [tooltipShown, setTooltipShown] = useState(false);

    useEffect(() => {
      // Проверяем, была ли уже показана подсказка ранее
      const tooltipShownBefore = localStorage.getItem('tooltipShown');
      if (!tooltipShownBefore) {
        // Показываем подсказку и устанавливаем tooltipShown в значение true
        setTooltipShown(true);
        // Сохраняем флаг в localStorage, чтобы помнить, что подсказка была показана
        localStorage.setItem('tooltipShown', 'true');
      }
    }, []);

  useEffect(() => {
    console.log(isNormal);
  }, [isNormal]);

  const Quotes = () => {
    setIsQuotes(!isQuotes);
    setWarningMessage(null); 
    console.log(isQuotes);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const toggleInput = () => {
    setShow(!show);
  };

  const handleInputChange = (event) => {
    const inputValue = event.target.value.trim();
    const words = inputValue.split(/\s+/);

    const maxWords = isQuotes ? MAX_WORDS_IN_QUOTE : MAX_WORDS_IN_MESSAGE;

    if (words.length <= maxWords) {
      setInputValue(inputValue);
      setWarningMessage(null); 
    } else {
      setWarningMessage(`Пожалуйста, вводите только ${maxWords} ${isQuotes ? 'слово' : 'слово'}`);
    }
  };

  const handleSubmit = async () => {
    // Validation for empty or too short inputs
    const words = inputValue.split(/\s+/);
    const maxWords = isQuotes ? MAX_WORDS_IN_QUOTE : MAX_WORDS_IN_MESSAGE;

    if (words.length === 0 || words.length > maxWords) {
      setWarningMessage(`Please enter ${maxWords} ${isQuotes ? 'words' : 'word'} in the input.`);
      return; // Return early if the input is invalid
    }

    setIsLoading(true);

    try {
      if (isQuotes) {
        const response = await axios.post('http://localhost:8000/quotes', {
          prompt: inputValue,
        });
        console.log(response.data);
        setGeneratedQuotes(response.data.quotes);
      } else {
        const response = await axios.post('http://localhost:8000/message', {
          message: inputValue,
        });
        console.log(response.data);
        const updatedEpithetsData = response.data.epithets.map((epitet) => ({
          epitet,
          isActive: false,
        }));
        setEpithetsData(updatedEpithetsData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      if (isQuotes) {
        setCurrentQuoteIndex(0);
      } else {
        setCurrentIndex(0);
      }
      setIsLoading(false);
    }
  };

  const handleClick = (index) => {
    const selectedElement = epithetsData[index];

    const updatedEpithetsData = epithetsData.map((epitetData, i) => ({
      ...epitetData,
      isActive: i === index,
    }));

    setEpithetsData(updatedEpithetsData);

    console.log(`Эпитет ${selectedElement.epitet} превращен в контейнер`);

    setSelectedContainerIndex(index);
    openModal();
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  useEffect(() => {
    const epithetsTimer = setInterval(() => {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }, 700);

    if (currentIndex >= epithetsData.length - 1) {
      clearInterval(epithetsTimer);
    }

    return () => clearInterval(epithetsTimer);
  }, [currentIndex, epithetsData.length]);

  useEffect(() => {
    const quotesTimer = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => prevIndex + 1);
    }, 1000);

    if (currentQuoteIndex >= generatedQuotes.length - 1) {
      clearInterval(quotesTimer);
    }

    return () => clearInterval(quotesTimer);
  }, [currentQuoteIndex, generatedQuotes.length]);

  return (
    <div className={`body ${isLampOn ? 'true' : 'false'}`}>
      <div className="header">
        <Mode_switch isNormal={isNormal} setIsNormal={setIsNormal} />
        <Fox_button isLampOn={isLampOn} setIsLampOn={setIsLampOn} />
      </div>
      <Switch_joke isLampOn={isLampOn} setIsLampOn={setIsLampOn} />

      <CursorFollower isLampOn={isLampOn} setIsLampOn={setIsLampOn} />
      <div className='container'>
        <div
          className={`text_epitet ${isLampOn ? 'true' : 'false'
            } ${isQuotes ? 'qu' : 'ep'}`}
          onClick={Quotes}
        >
          <p id='p_epitet' onClick={toggleInput}>
            {isQuotes ? 'QUOTES' : 'EPITET'}
          </p>
        </div>
        <div
          className={`search ${show ? 'show' : 'hide'} ${isLampOn ? 'true' : 'false'}`}
        >
          <input
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder='Введите слово'
            className={`input ${isLampOn ? 'true' : 'false'}`}
            type='text'
          />
          {warningMessage && (
            <p className={`warning-message ${isLoading ? 'loading' : ''}`}>
              {warningMessage}
            </p>
          )}
        </div>
        <div className={`epitets-container ${isLampOn ? 'true' : 'false'}`}>
          {isLoading ? (
            <p>Загрузка...</p>
          ) : isQuotes ? (
            <div>
              {generatedQuotes.slice(0, currentQuoteIndex + 1).map((quote, index) => (
                <p key={index} className={`generated-quote animated-item`}>
                  {quote}
                </p>
              ))}
            </div>
          ) : (
            <div className='epitet-list'>
              {epithetsData.slice(0, currentIndex + 1).map((epitetData, index) => (
                <div
                  className={`epitet-item ${selectedContainerIndex === index ? 'active' : ''}`}
                  key={index}
                  onClick={() => handleClick(index)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {epitetData.isActive ? (
                    <div
                      className='epitet-container active'
                      style={{ backgroundColor: epitetData.color }}
                    >
                      <p className='animated-item'>{epitetData.epitet}</p>
                    </div>
                  ) : (
                    <p className='animated-item'>{epitetData.epitet}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {tooltipShown && (
        <div className="tooltip">
          <p>Добро пожаловать на сайт! Нажмите на "EPITET" или "QUOTES", чтобы начать.</p>
        </div>
      )}


      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        selectedContainerIndex={selectedContainerIndex}
        inputValue={inputValue}
        isLampOn={isLampOn}
        isNormal={isNormal}
      />
    </div>
  );
}

export default Page;
