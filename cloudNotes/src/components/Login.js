//rafce
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';


const Login = (props) => {
    const [credentials, setCredentials] = useState({email: "", password: ""})
    let history = useHistory();

    const [password, setPassword] = useState("")
    const handleSubmit = async (e)=>{
        e.preventDefault();
        const response = await fetch(`http://localhost:5000/api/auth/login`, {
            method: 'POST', 
        
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({email: credentials.email, password: credentials.password})
          });
          const json = await response.json();
          console.log(json);
          if (json.success) {
              // Save the auth token and redirect
              localStorage.setItem('token', json.authtoken);
              props.showAlert("Logged in Successfully:)", "success");
              history.push("/");
          }else{
            props.showAlert("Invalid User Details", "danger");
          }
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }


    return (
        <div className='mt-3'>
            <h2>Login to continue to iNotebook</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" onChange={onChange}   id="email" name='email' value={credentials.email} aria-describedby="emailHelp" />
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" value={credentials.password}  onChange={onChange}  className="form-control" id="password" name='password'/>
                </div>
    
                <button type="submit" className="btn btn-primary" >Submit</button>
            </form>
        </div>
    )
}

export default Login