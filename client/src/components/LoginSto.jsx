import { SignJWT, jwtVerify } from 'jose';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import coverImage from '../assets/cover.jpg';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useWishlist } from '../context/WishListContext';
import { ACTIVE_KEY, KEYS } from '../key/config';
import './login.scss';
// import coverImage from '../assets/'

const LoginSto = () => {
    const {showNotification} = useNotification();
    const {getUserIdFromToken, refreshUserId} = useWishlist();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {isAuthenticated, setisAuthenticated, validateToken, logout} = useAuth();

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    //hardcoded username/password for demo

    const mockUser = [
      {
        email: 'tkhoju@gmail.com',
        password: '123456',
      },
      {
        email: 'user1@example.com',
        password: 'password',
      },
      {
        email: 'admin@example.com',
        password: 'admin',
      }

  ]

    // for signing JWT
    // const secret = new TextEncoder().encode('your-secret-key');

    // Generate JWT
    const generateJWT = async(payload) => {
      const token = await new SignJWT(payload)
        .setProtectedHeader({alg: 'HS256'})
        .setIssuedAt()
        .setExpirationTime('2h')
        .sign(KEYS[ACTIVE_KEY]);

      return token;
    }
    
    const handleLogin = async (e) => {
      e.preventDefault();
      setLoading(true);
      // setError('');

      // validate use credential
      const user = mockUser.find((user) => user.email === email && user.password === password);
      if(user) {
          const token = await generateJWT({email: user.email});
          
          console.log('the token generated is:' + token);
          localStorage.setItem('authToken', token);
          getUserIdFromToken();
          refreshUserId();
          navigate('/');
          showNotification('logged in successfully', 'success');

          //check if token is expired
          // monitorTokenExpiration();
          // alert('login successful' + token);

          //run token validation function from authcontext
          validateToken();
      } else {
        setError('Inavlid email or passwor');
      }
    }

  //state to track toke expiration
  const [isTokenExpired, setTokeExpired] = useState(false);

  //function to monitor token expiration

  const monitorTokenExpiration = async () => {
    const token = localStorage.getItem('authToken');
    try {
      //decode JWT to get expriation time
      const { payload } = await jwtVerify(token, KEYS[ACTIVE_KEY]);

      //calculate time until expiration
      const expirationTime = payload.exp * 1000; //convert to milisecods
      const currentTime = Date.now();
      const timeUntilExpiration = expirationTime - currentTime;

      //set time out to mark token as expired
      setTimeout(() => {
        console.log('Token has expired');
        setTokeExpired(true);
      }, timeUntilExpiration)
     } catch(err) {
      console.log('error verifying token:' + err);
      setTokeExpired(true);
     }
  }

  useEffect(() => {
    if(isTokenExpired) {
      console.log('token is expired');
    }
  })


  return (
      <>
        <div className='spacer'></div>
          <div className='w-70 section__padding'>

          <div className="login__section__wrapper">
            <div className="form_section">
              <h4>Welcome</h4>
              <p className='subTitle'>Use your email and password to Login</p>

              <div className="form__wrapper loginForm">
                <form onSubmit={handleLogin}>
                  <div className='form__grp'>
                    <label htmlFor=""> Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                  </div>

                  <div className='form__grp'>
                    <label> Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>


                  <button type='submit' className='btn__main'>login</button>

                  <p className='signup__message'>
                    Dont have an account yet? <Link to="" className=''>Sign Up</Link>
                  </p>
                </form>
              </div>
            </div>      

            <div className='featured__image'>
              <figure>
                <img src={coverImage} alt="cover image for signup page" />
              </figure>
            </div>        
          </div>

          {error && <p style={{color: 'red'}}> {error} </p>}
        </div>
      </>
  )
}

export default LoginSto