import React, {useState, useContext} from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../helpers/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const {setAuthState} = useContext(AuthContext);

  let navigate = useNavigate();

const login = () => {
   const data = {username:username, password:password};
   axios.post("http://localhost:3001/auth/login",data).then((response) => {
        if(response.data.error) {
              alert(response.data.error);
        }
        else{
          localStorage.setItem("accessToken", response.data.token);
          setAuthState({username: response.data.username, id: response.data.id, status: true});
          navigate("/");
        }
   });
}
const handleGoogleLogin = (credentialResponse) => {
  const credentialResponseDecoded = jwtDecode(credentialResponse.credential);
  console.log("Google login response:", credentialResponseDecoded);
  
  // Extract user information from Google credential response
  const { email, given_name} = credentialResponseDecoded;

  // Perform database operations (check if user exists, create user if necessary, authenticate user, etc.)
  // Example:
  axios.post("http://localhost:3001/auth/google-login", { email,given_name })
    .then((response) => {
      if(response.data.error) {
            alert(response.data.error);
      }
      else{
        localStorage.setItem("accessToken", response.data.token);
        setAuthState({username: response.data.username, id: response.data.id, status: true});
        navigate("/");
      }
 })
 .catch((error) => {
  console.error("Google Login Error:", error);
  alert("An error occurred during Google login. Please try again later.");
});
}

  return (
    <div className="loginContainer">
      <h1 >Login</h1>
      <label> UserName </label>
      <input 
        type="text" 
        placeholder = "(Ex: Dhwarakesh123...)"
        onChange={(event) => 
        {setUsername(event.target.value)}} 
      />
      <label> Password </label>
      <input 
        type="password" 
        placeholder = "Your Password..."
        onChange={(event) => 
        {setPassword(event.target.value)}} 
      />

      <button onClick = {login}> Login </button>
      <div className='googleLogin'>
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => {
            console.log('Login Failed');
            alert("Google login failed. Please try again later.");
          }}
        />
      </div>
    </div>
  )
}

export default Login