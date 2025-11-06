import React, { useContext, useState } from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { userContex } from '../../App'

const Sidebar = () => {

    const { previousPrompt, setPreciousPrompt, showResult, setShowResult,question, setQuestion} = useContext(userContex)
    const [extended, setExtended] = useState(false)

    const newChat = () => {
        setShowResult(false);
    }

    const changeit = () => {
        setExtended(!extended)
    }
    return (
        <div className='sidebar'>
            <div className="top">
                <img className='menu' onClick={changeit} src={assets.menu_icon} alt="" />
                <div className="new-chat" onClick={newChat}>
                    <img src={assets.plus_icon} alt="" />
                    {extended ? <p>New Chat</p> : null}
                </div>
                {extended ? <div className="recent">
                    <p className="recent-title"> Recent</p>
                    {previousPrompt.map((item, index) => {
                        return (
                            <div className="recent-entry prev-ques">
                                <img src={assets.message_icon} alt="" />
                                <p>{item}</p>
                            </div>
                        )
                    })}

                </div> : null}
            </div>
            <div className="bottom">
                <div className="bottom-item recent-entry">
                    <img src={assets.question_icon} alt="" />
                    {extended ? <p>Help</p> : null}
                </div>
                <div className="bottom-item recent-entry">
                    <img src={assets.history_icon} alt="" />
                    {extended ? <p>Activity</p> : null}
                </div>
                <div className="bottom-item recent-entry">
                    <img src={assets.setting_icon} alt="" />
                    {extended ? <p>Setting</p> : null}
                </div>
            </div>
        </div>
    )
}

export default Sidebar
