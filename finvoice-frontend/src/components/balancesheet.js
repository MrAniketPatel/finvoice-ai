import React from "react";

function BalanceSheet() {
  const dummyData = [
    { id: 1, name: "Invoice 001", amount: 5000 },
    { id: 2, name: "Invoice 002", amount: 3000 },
  ];

  return (
    <div>
      <h2>Balance Sheet</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Invoice</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {dummyData.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BalanceSheet;

