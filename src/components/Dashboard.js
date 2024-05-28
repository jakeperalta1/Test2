import React, { useState, useEffect } from 'react';

const url = 'https://json-storage-api.p.rapidapi.com/datalake';
const headers = {
  'Content-Type': 'application/json',
  'X-RapidAPI-Key': 'ca97d14d49msh31526a0570daacdp1705a2jsnea3b7d2d6662',
  'X-RapidAPI-Host': 'json-storage-api.p.rapidapi.com'
};

// Static account number
const accountNumber = localStorage.getItem('accountNumber');
const accountId = 'USERID-' + accountNumber;

const Dashboard = () => {


  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadTransactions();
  }, []);

  const storeTransaction = async (transaction) => {
    try {
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
            Name: 'Transaction',
            Creator: {
              '@type': 'UserAccount',
              Identifier: accountId // Use static account number
            },
            About: {
              '@type': 'Organization'
            },
            Amount: transaction.amount,
            Balance: transaction.balance,
            Type: transaction.type,
            SerialNumber: transaction.serial // Add serial number to the transaction
          }
        })
      });

      const data = await response.json();
      console.log(data);
      // After each transaction, load the latest transactions to update the balance
      loadTransactions();
    } catch (error) {
      console.error('Error storing transaction:', error);
    }
  };

  const loadTransactions = async () => {
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
                Identifier: accountId // Use static account number
              }
            }
          }
        })
      });

      const data = await response.json();
      const result = data.Result.ItemListElement.map(item => item.Item);
      // Sort transactions by serial number in ascending order
      result.sort((a, b) => a.SerialNumber - b.SerialNumber);
      setTransactions(result);
      if (result.length > 0) {
        // Update balance to the latest transaction's balance
        const latestBalance = result[result.length - 1].Balance;
        setBalance(latestBalance);
        if (latestBalance < 0) {
          setErrorMessage('Insufficient balance for withdrawal');
        } else {
          setErrorMessage('');
        }
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const clearTransactions = async () => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          '@context': [
            'http://schema4i.org/Thing.jsonld',
            'http://schema4i.org/Action.jsonld',
            'http://schema4i.org/DeleteAction.jsonld'
          ],
          '@type': 'DeleteAction',
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
                Identifier: accountId // Use static account number
              }
            }
          }
        })
      });

      const data = await response.json();
      console.log(data);
      setTransactions([]);
      setBalance(0);
      setErrorMessage('');
    } catch (error) {
      console.error('Error clearing transactions:', error);
    }
  };

  const handleDeposit = async () => {
    const newBalance = balance + parseFloat(amount);
    await storeTransaction({ amount: parseFloat(amount), balance: newBalance, type: 'Deposit', serial: transactions.length + 1 });
    setBalance(newBalance); // Update balance state
    setAmount(0); // Reset input field
    loadTransactions(); // Reload transactions to update balance
  };

  const handleWithdraw = async () => {
    if (amount > balance) {
      setErrorMessage('Insufficient balance for withdrawal');
      return;
    }
    const newBalance = balance - parseFloat(amount);
    await storeTransaction({ amount: parseFloat(amount), balance: newBalance, type: 'Withdraw', serial: transactions.length + 1 });
    setBalance(newBalance); // Update balance state
    setAmount(0); // Reset input field
    loadTransactions(); // Reload transactions to update balance
  };

  return (
    <div className="transection-area container mt-5">
      <h1>Transaction App</h1>
      <div className='form-group'>
        <input className='form-control'
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <br />
        <button className='btn btn-primary themebutton' onClick={handleDeposit}>Deposit</button>
        <button className='btn btn-primary themebutton' onClick={handleWithdraw}>Withdraw</button>
      </div>
      <div>
        <h2>Current Balance: ${balance}</h2>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </div>
      <div>

        <h2>Transactions:</h2>

        <br />
        <button className='btn btn-primary themebutton' onClick={loadTransactions}>Load Transactions</button>
        <button className='btn btn-primary themebutton' onClick={clearTransactions}>Clear Transactions</button>


        <table className="table table-striped">
          <thead>
            <tr>
              <th>SL</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Current Balance</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.SerialNumber}</td>
                <td>{transaction.Type}</td>
                <td>${transaction.Amount}</td>
                <td>${transaction.Balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
