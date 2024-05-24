import React, { useState, useEffect } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [users, setUsers] = useState([]);

  const url = 'https://json-storage-api.p.rapidapi.com/datalake';
  const headers = {
    'Content-Type': 'application/json',
    'X-RapidAPI-Key': 'ca97d14d49msh31526a0570daacdp1705a2jsnea3b7d2d6662',
    'X-RapidAPI-Host': 'json-storage-api.p.rapidapi.com'
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          '@context': [
            'http://schema4i.org/Thing.jsonld',
            'http://schema4i.org/Action.jsonld',
            'http://schema4i.org/SearchAction.jsonld'
          ],
          '@type': 'SearchAction',
          Object: {
            '@context': [
              'http://schema4i.org/Thing.jsonld',
              'http://schema4i.org/Filter',
              'http://schema4i.org/DataLakeItem',
              'http://schema4i.org/UserAccount'
            ],
            '@type': 'Filter',
            FilterItem: {
              '@type': 'DataLakeItem',
              Creator: {
                '@type': 'UserAccount',
                Identifier: 'USERID-4711'
              }
            }
          }
        })
      });
      const data = await response.json();
      setUsers(data.Result.ItemListElement.map(item => item.Item));
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleLogin = () => {
    const user = users.find(user => user.About.Email === email && user.About.Password === password);
    if (user) {
      // Redirect to dashboard after successful login
      localStorage.setItem('accountNumber', user.About.AccountNumber);
      window.location.href = '/dashboard';
    } else {
      setErrorMessage('Invalid email or password');
    }
  };

  return (
    <div className="loginArea container mt-5">
      <div className='loginBody col-md-4'>
        <h2>Login</h2>
        <form onSubmit={e => { e.preventDefault(); handleLogin(); }}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="loginbutton btn btn-primary">Login</button>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
