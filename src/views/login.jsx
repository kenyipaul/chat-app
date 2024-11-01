import Axios from "axios"
import { useRef } from "react"
import { useNavigate } from "react-router-dom";

export default function Login() {
    const passRef = useRef();
    const emailRef = useRef();
    
    const navigate = useNavigate();

    const login = () => {
        
        const email = emailRef.current.value;
        const password = passRef.current.value;
        const url = "http://localhost:3303/login"

        Axios.post(url, {   
            email: email,
            password: password
        }).then((response) => {
            if (!response.data.user) {
                alert(response.data.msg)
            } else {
                localStorage.setItem('_user', JSON.stringify(response.data.data))
                navigate('/chat')
            }
        })
    }
    
    return (
        <div className="form-container">

            <form action="#">
                <h1>LOGIN</h1>
                <div className="input-area">
                    <label htmlFor="email">Email</label>
                    <input ref={emailRef} type="email" name="email" id="email" />
                </div>
                <div className="input-area">
                    <label htmlFor="password">Password</label>
                    <input ref={passRef} type="password" name="password" id="password" />
                </div>
                <button onClick={login} type="button">LOG IN</button>
                <p>Don't have an account yet? <a href="/register">Register here</a></p>
            </form>

        </div>
    )
}