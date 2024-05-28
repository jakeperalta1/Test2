import React, { useState, useEffect } from 'react';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [lastAccountNumber, setLastAccountNumber] = useState(4711); // Assuming initial value

  const url = 'https://json-storage-api.p.rapidapi.com/datalake';
  const headers = {
    'Content-Type': 'application/json',
    'X-RapidAPI-Key': 'ca97d14d49msh31526a0570daacdp1705a2jsnea3b7d2d6662',
    'X-RapidAPI-Host': 'json-storage-api.p.rapidapi.com'
  };

  useEffect(() => {
    loadUsers();
    getLastAccountNumber();
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
                Identifier: 'USERID-4711' // Modify if necessary
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

  const getLastAccountNumber = async () => {
    try {
      // Fetch the last account number from your data storage
      // For now, let's assume you're fetching it from an API endpoint
      const response = await fetch('https://your-api.com/last-account-number');
      const data = await response.json();
      setLastAccountNumber(data.lastAccountNumber); // Update the state with the fetched value
    } catch (error) {
      console.error('Error fetching last account number:', error);
    }
  };

  const handleSignup = async () => {
    try {
      // Calculate the new account number based on the number of existing users
      const newAccountNumber = lastAccountNumber + users.length + 1;

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          '@context': [
            'http://schema4i.org/Thing.jsonld',
            'http://schema4i.org/Action.jsonld',
            'http://schema4i.org/CreateAction.jsonld'
          ],
          '@type': 'CreateAction',
          Result: {
            '@context': [
              'http://schema4i.org/DataLakeItem.jsonld',
              'http://schema4i.org/UserAccount.jsonld',
              'http://schema4i.org/OfferForPurchase.jsonld',
              'http://schema4i.org/Offer.jsonld',
              'http://schema4i.org/Organization.jsonld',
              'http://schema4i.org/PostalAddress.jsonld'
            ],
            '@type': 'DataLakeItem',
            Name: username,
            Creator: {
              '@type': 'UserAccount',
              Identifier: 'USERID-4711', // Modify if necessary
            },
            About: {
              '@type': 'Organization',
              Email: email,
              Password: password, // Store hashed passwords for security
              AccountNumber: newAccountNumber // Add the new field for the account number
            }
          }
        })
      });
      await response.text();
      // Clear input fields after successful signup
      setUsername('');
      setEmail('');
      setPassword('');
      setErrorMessage('');
      // Reload users after signup to display updated list
      loadUsers();
    } catch (error) {
      console.error('Error signing up:', error);
      setErrorMessage('Error signing up. Please try again.');
    }
  };

  return (
    <div className="signup-area container mt-5">
      <h1>Signup</h1>
      <div className="form-group">
        <input className="form-control" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <br />
        <input className="form-control" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <br />
        <input className="form-control" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <br />
        <button className="btn btn-primary themebutton" onClick={handleSignup}>Signup</button>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </div>
      <h2>Registered Users:</h2>
                <ul>
                    {users.map((user, index) => (
                        <li key={index}>{user.Name} - {user.About.Email} {user.About.Password} {user.About.AccountNumber}</li>
                    ))}
                </ul>
    </div>
  );
};

export default Signup;
