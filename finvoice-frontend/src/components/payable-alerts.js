import React from "react";

function PayableAlerts() {
  const alerts = ["Invoice 003 is overdue", "Payment reminder for Invoice 002"];

  return (
    <div>
      <h2>Payable Alerts</h2>
      <ul>
        {alerts.map((alert, index) => (
          <li key={index}>{alert}</li>
        ))}
      </ul>
    </div>
  );
}

export default PayableAlerts;

