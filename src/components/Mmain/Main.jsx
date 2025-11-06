import React, { createContext, useContext, useState } from 'react'
import "./Main.css"
import { assets } from '../../assets/assets'
import { BASE_URL, getApiConfig } from '../../Constants'
import { userContex } from '../../App'

export default function Main() {
    const { previousPrompt, setPreciousPrompt, showResult, setShowResult, question, setQuestion } = useContext(userContex);
    const [result, setResult] = useState("")
    const [recentPrompt, setRecentPrompt] = useState("")
    const [loading, setLoading] = useState(false)
    const [resultData, setResultData] = useState("")
    const [ansQuestion, setAnsQuestion] = useState("")

    const delayPrompt = (index, nextword) => {
        setTimeout(() => {
            setResult(prev => prev + nextword)
        }, 73 * index);
    }

    const payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": question
                    }
                ]
            }
        ]
    }
    const askques = async () => {
        setShowResult(true);
        setQuestion("");
        setPreciousPrompt(prev => [...prev, question]);
        setResult("");
        setAnsQuestion(question);
        setLoading(true);

        try {
            const apiConfig = getApiConfig();
            const response = await fetch(`${BASE_URL}?key=${apiConfig.params.key}`, {
                method: apiConfig.method,
                headers: apiConfig.headers,
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.error?.message || 'Unknown API error';
                throw new Error(`API request failed (${response.status}): ${errorMessage}`);
            }
            
            const data = await response.json();
            
            // Check for API-specific errors in the response
            if (data.error) {
                throw new Error(`API Error: ${data.error.message || 'Unknown error'}`);
            }
            
            // Handle the response based on the actual structure
            let realResult = '';
            if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
                realResult = data.candidates[0].content.parts[0].text;
            } else if (data.text) {
                realResult = data.text;
            } else {
                console.error('Unexpected API response structure:', data);
                throw new Error('Unexpected API response format');
            }

            // Format the response text
            let formattedText = realResult
                .split('**')
                .map((part, i) => (i % 2 === 1 ? `<b>${part}</b>` : part))
                .join('')
                .split('*')
                .join('<br>');
                
            const newResult3 = formattedText.split(' ');

            for (let i = 0; i < newResult3.length; i++) {
                let word = newResult3[i];
                delayPrompt(i, word + " ")
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="main">
            <div className="nav">
                <p>Gemini</p>
                <img src={assets.user_icon} alt="" />
            </div>
            {!showResult ? <div className="center">
                <div className="heading">
                    <p><span>Hello, Dev.</span></p>
                    <p>how can i help you today?</p>
                </div>
                <div className="cards">
                    <div className="first allcards">
                        <p>suggest beautifull places to see on an upcoming road trip</p>
                        <img src={assets.compass_icon} alt="" />
                    </div>
                    <div className="second allcards" >
                        <p>Briefly summarise the concept:urban planning</p>
                        <img src={assets.bulb_icon} alt="" />
                    </div>
                    <div className="third allcards">
                        <p>Brainstroam team bonding activities for our work retreat</p>
                        <img src={assets.message_icon} alt="" />
                    </div>
                    <div className="fourth allcards">
                        <p>improve the readability of the following code</p>
                        <img src={assets.code_icon} alt="" />
                    </div>
                </div>
            </div> :
                <div className='answers'>
                    <div className="user-ques">
                        <img src={assets.user_icon} alt="" />
                        <p>{ansQuestion}</p>
                    </div>
                    <div className="gemini-ans">
                        <img src={assets.gemini_icon} alt="" />
                        {loading ?
                            <div className='loader'>
                                <hr />
                                <hr />
                                <hr />
                            </div>
                            : <p dangerouslySetInnerHTML={{ __html: result }}></p>
                        }
                    </div>
                </div>}

            <div className="end-search">
                <div className="search-box">
                    <div className="input">
                        <input type="text" value={question} onChange={(event) => setQuestion(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    askques();
                                }
                            }} placeholder='Entere a prompt here' />
                    </div>
                    <div className="input-img">
                        <img className='temp-img' src={assets.gallery_icon} alt="" />
                        <img className='temp-img' src={assets.mic_icon} alt="" />
                        {question ? <img onClick={askques} src={assets.send_icon} alt="" /> : null}
                    </div>
                </div>
                <div className="end-text">
                    <p>Gemini may display inaccurate info, including photo,people. So double-check
                        it's responses. Your privacy and Gemini App</p>
                </div>
            </div>
        </div>
    )
}