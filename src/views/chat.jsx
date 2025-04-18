import Axios from "axios"
import { io } from "socket.io-client"
import { UserContext } from "../app"
import { useContext, useRef, useEffect, useState, act } from "react"

export default function Chat() {

    const socket = useRef();
    const [users, setUsers] = useState([])
    const [messages, setMessages] = useState([])
    const [user, setUser] = useContext(UserContext)
    const [activeUser, setActiveUser] = useState({})
    const [arrivalMessage, setArrivalMessage] = useState(null)

    useEffect(() => {
        if (Object.keys(activeUser).length > 0)
            socket.current = io("http://localhost:3303")
    }, [activeUser])

    useEffect(() => {
        Axios.post("http://localhost:3303/users", {
            "id": user.id
        }).then((response) => {
            setUsers(response.data.data)
        })
    }, [])

    useEffect(() => {
        if (Object.keys(activeUser).length > 0) {
            socket.current.emit('add-user', user.id)
        }
    }, [activeUser])
    
    useEffect(() => {
        if (Object.keys(activeUser).length > 0) {
            Axios.post("http://localhost:3303/getMsgs", {
                sender: user.id,
                receiver: activeUser.id
            }).then((response) => {
                setMessages(response.data)
            })
        }   
    }, [activeUser])
    
    const sendMsg = () => {
        let msg = document.getElementById('msg-input')
        
        Axios.post('http://localhost:3303/sendMsg', {
            to: activeUser.id,
            from: user.id,
            msg: msg.value
        }).then(response => {
            console.log(response.data)
        })

        let msgBlock = document.createElement('div')
                msgBlock.className = "message-container sent-message"
                msgBlock.innerHTML = `<p class="message">${msg.value}</p>`;

                document.querySelector('.chat-container').appendChild(msgBlock);

        if (socket.current) {
            socket.current.emit('send-msg', {to: activeUser.id, from: user.id, msg: msg.value})
        }
    }


    useEffect(() => {
        if (socket.current) {
            socket.current.on('msg-received', msg => {
                setArrivalMessage({ from: msg.from, msg: msg.msg})
            })   
        }
    })

    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage])
      }, [arrivalMessage])

    return (
        <div id="chat-view">
            <section>
                <div className="title-bar">
                    <div className="user-profile">
                        <div className="cover"></div>
                        <div className="info">
                            <h1>{user.name}</h1>
                            <p>{user.id}</p>
                        </div>
                    </div>
                    <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <defs></defs> <g id="Bold-Outline" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="setting-2" fill-rule="nonzero" fill="currentColor"> <path d="M3.1674542,11.060587 L2.32102494,9.4697065 C1.51109784,7.94743251 2.08856908,6.05680997 3.61084307,5.24688287 C4.03006252,5.02383682 4.4946363,4.89935465 4.96921402,4.88290847 L6.77017158,4.82049745 C7.43502402,4.79745743 8.04490315,4.44534355 8.39728262,3.88108446 L9.35181092,2.35261496 C10.2651753,0.890060523 12.1912381,0.444854024 13.6537925,1.35821842 C14.0565658,1.60975009 14.3966574,1.9498417 14.6481891,2.35261496 L15.6027174,3.88108446 C15.9550969,4.44534355 16.564976,4.79745743 17.2298284,4.82049745 L19.030786,4.88290847 C20.7540775,4.94262801 22.102669,6.38804405 22.0429495,8.11133555 C22.0265033,8.58591327 21.9020211,9.05048705 21.6789751,9.4697065 L20.8325458,11.060587 C20.5200728,11.6478861 20.5200728,12.3521139 20.8325458,12.939413 L21.6789751,14.5302935 C22.4889022,16.0525675 21.9114309,17.94319 20.3891569,18.7531171 C19.9699375,18.9761632 19.5053637,19.1006453 19.030786,19.1170915 L17.2298284,19.1795025 C16.564976,19.2025426 15.9550969,19.5546564 15.6027174,20.1189155 L14.6481891,21.647385 C13.7348247,23.1099395 11.8087619,23.555146 10.3462075,22.6417816 C9.9434342,22.3902499 9.60334259,22.0501583 9.35181092,21.647385 L8.39728262,20.1189155 C8.04490315,19.5546564 7.43502402,19.2025426 6.77017158,19.1795025 L4.96921402,19.1170915 C3.24592252,19.057372 1.897331,17.6119559 1.95705054,15.8886644 C1.97349673,15.4140867 2.09797889,14.949513 2.32102494,14.5302935 L3.1674542,12.939413 C3.47992717,12.3521139 3.47992717,11.6478861 3.1674542,11.060587 Z M4.93309947,10.121174 C5.55804541,11.2957722 5.55804541,12.7042278 4.93309947,13.878826 L4.08667021,15.4697065 C4.0065031,15.6203822 3.96176178,15.7873591 3.9558507,15.9579316 C3.93438633,16.5773162 4.41909648,17.096827 5.03848114,17.1182914 L6.8394387,17.1807024 C8.16914359,17.2267824 9.38890183,17.9310102 10.0936608,19.0595284 L11.0481891,20.5879979 C11.1385945,20.7327625 11.26083,20.854998 11.4055946,20.9454034 C11.9312653,21.2736844 12.6235299,21.1136685 12.9518109,20.5879979 L13.9063392,19.0595284 C14.6110982,17.9310102 15.8308564,17.2267824 17.1605613,17.1807024 L18.9615189,17.1182914 C19.1320914,17.1123803 19.2990683,17.067639 19.4497439,16.9874719 C19.996879,16.6963682 20.2044334,16.0168415 19.9133298,15.4697065 L19.0669005,13.878826 C18.4419546,12.7042278 18.4419546,11.2957722 19.0669005,10.121174 L19.9133298,8.5302935 C19.9934969,8.37961784 20.0382382,8.21264094 20.0441493,8.04206843 C20.0656137,7.42268378 19.5809035,6.903173 18.9615189,6.88170862 L17.1605613,6.81929761 C15.8308564,6.77321755 14.6110982,6.0689898 13.9063392,4.94047163 L12.9518109,3.41200213 C12.8614055,3.26723754 12.73917,3.14500197 12.5944054,3.05459657 C12.0687347,2.72631555 11.3764701,2.88633147 11.0481891,3.41200213 L10.0936608,4.94047163 C9.38890183,6.0689898 8.16914359,6.77321755 6.8394387,6.81929761 L5.03848114,6.88170862 C4.86790863,6.8876197 4.70093173,6.93236103 4.55025606,7.01252814 C4.00312103,7.30363177 3.79556658,7.98315847 4.08667021,8.5302935 L4.93309947,10.121174 Z M12,16.5 C9.51471863,16.5 7.5,14.4852814 7.5,12 C7.5,9.51471863 9.51471863,7.5 12,7.5 C14.4852814,7.5 16.5,9.51471863 16.5,12 C16.5,14.4852814 14.4852814,16.5 12,16.5 Z M12,14.5 C13.3807119,14.5 14.5,13.3807119 14.5,12 C14.5,10.6192881 13.3807119,9.5 12,9.5 C10.6192881,9.5 9.5,10.6192881 9.5,12 C9.5,13.3807119 10.6192881,14.5 12,14.5 Z" id="shape"></path> </g> </g> </svg>
                </div>
                <div className="user-list">
                    {
                        users.map((data, key) => {
                            return <User data={data} onclick={() => setActiveUser(data)} key={key} />
                        })
                    }
                </div>
            </section>
            <section>
                {
                    Object.keys(activeUser).length > 0 ?
                    <>
                        <div className="title-bar">
                            <div className="user-profile">
                                <div className="cover">
                                </div>
                                <div className="info">
                                    <h1>{activeUser.name}</h1>
                                </div>
                            </div>
                        </div>
                        
                        <div className="chat-container">
                            {
                                messages.map((data, key) => {
                                    if (data.from == activeUser.id) {
                                        return <ReceivedMessage data={data} key={key} />
                                    } else {
                                        return <SentMessage data={data} key={key} />
                                    }
                                })
                            }
                        </div>

                        <div className="bottom-bar">
                            <input type="text" name="msg-input" id="msg-input" placeholder="Type message here...." />
                            <button onClick={sendMsg}>Send</button>
                        </div>
                    </>
                    :
                    <></>
                }
                
            </section>
        </div>
    )
}

function User(props) {
    return (
        <div className="user" onClick={props.onclick}>
            <div className="user-profile">
                <div className="cover">
                    <div className="dot"></div>
                </div>
                <div className="info">
                    <h1>{props.data.name}</h1>
                    <p>I'm done with my project bro, I almost postponded it</p>
                </div>
            </div>
        </div>
    )
}

function ReceivedMessage(props) {
    return (
        <div className="message-container received-message">
            <p className="message">{props.data.msg}</p>
        </div>
    )
}

function SentMessage(props) {
    return (
        <div className="message-container sent-message">
            <p className="message">{props.data.msg}</p>
        </div>
    )
}