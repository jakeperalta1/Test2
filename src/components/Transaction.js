import React from 'react';

const Transaction = ({ transactions }) => {
  return (
    <div className="mt-5">
      <h3>Transactions:</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Type</th>
            <th>Account Number</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Current Balance</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => {
            let currentBalance = 0;

            // Calculate current balance up to the current row
            for (let i = 0; i <= index; i++) {
              const { type, amount, accountNumber } = transactions[i];

              // Update current balance only for the current accountNumber
              if (transactions[i].accountNumber === transaction.accountNumber) {
                if (type === 'Deposit') {
                  currentBalance += amount;
                } else if (type === 'Withdrawal') {
                  currentBalance -= amount;
                }else if (type === 'Transfer Deposit') {
                  currentBalance += amount;
                } else if (type === 'Transfer Withdrawal') {
                  currentBalance -= amount;
                }
              }
            }

            return (
              <tr key={index}>
                <td>{transaction.type}</td>
                <td>{transaction.accountNumber}</td>
                <td>${transaction.amount.toFixed(2)}</td>
                <td>{transaction.timestamp}</td>
                <td>${currentBalance.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Transaction;
