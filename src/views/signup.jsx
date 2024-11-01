import Axios from "axios";
import { useRef } from "react"

export default function Signup() {
    
    const nameRef = useRef();
    const passRef = useRef();
    const emailRef = useRef();
    
    const register = () => {
        const email = emailRef.current.value;
        const name = nameRef.current.value;
        const password = passRef.current.value;

        const url = 'http://localhost:3303/register'

        Axios.post(url, {
            name: name,
            email: email,
            password: password
        }).then((response) => {
            console.log(response.data)
        })
    }

    return (
        <div className="form-container">

            <form action="#">
                <h1>SIGN UP</h1>
                <div className="input-area">
                    <label htmlFor="name">Name</label>
                    <input ref={nameRef} type="text" name="name" id="name" />
                </div>
                <div className="input-area">
                    <label htmlFor="email">Email</label>
                    <input ref={emailRef} type="email" name="email" id="email" />
                </div>
                <div className="input-area">
                    <label htmlFor="password">Password</label>
                    <input ref={passRef} type="password" name="password" id="password" />
                </div>
                <button onClick={register} type="button">SIGN UP</button>
                <p>Already have an account? <a href="/">login here</a></p>
            </form>

        </div>
    )
}