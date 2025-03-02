import React, { useState } from "react";

const BalanceSheetQuiz = ({ onQuizComplete }) => {
  const [answers, setAnswers] = useState({
    cash2024: "",
    receivables2023: "",
    totalAssets2024: "",
    accountsPayable2024: "",
    longTermDebt2023: "",
    retainedEarnings2024: "",
    totalEquity2023: "",
    totalLiabilities2024: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnswers((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const checkAnswers = () => {
    const correctAnswers = {
      cash2024: "8625",
      receivables2023: "8796",
      totalAssets2024: "243197",
      accountsPayable2024: "53742",
      longTermDebt2023: "36132",
      retainedEarnings2024: "83135",
      totalEquity2023: "90349",
      totalLiabilities2024: "243197",
    };

    for (const key in correctAnswers) {
      if (answers[key] !== correctAnswers[key]) {
        alert("There is an error in your answers. Please check and try again.");
        return;
      }
    }

    // If all answers are correct, navigate to a different page
    if (onQuizComplete) {
      onQuizComplete();
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h2>Balance Sheet Quiz (Amounts in Millions)</h2>
      <p>Fill in the missing values from the balance sheet:</p>

      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}
      >
        <thead>
          <tr style={{ borderBottom: "1px solid #ddd" }}>
            <th style={{ textAlign: "left", padding: "8px" }}>Line Item</th>
            <th style={{ textAlign: "left", padding: "8px" }}>2024</th>
            <th style={{ textAlign: "left", padding: "8px" }}>2023</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: "8px" }}>Cash and cash equivalents</td>
            <td style={{ padding: "8px" }}>
              <input
                type="number"
                name="cash2024"
                value={answers.cash2024}
                onChange={handleChange}
                style={{ width: "80px" }}
              />
            </td>
            <td style={{ padding: "8px" }}>8,625</td>
          </tr>
          <tr>
            <td style={{ padding: "8px" }}>Receivables, net</td>
            <td style={{ padding: "8px" }}>8,796</td>
            <td style={{ padding: "8px" }}>
              <input
                type="number"
                name="receivables2023"
                value={answers.receivables2023}
                onChange={handleChange}
                style={{ width: "80px" }}
              />
            </td>
          </tr>
          <tr>
            <td style={{ padding: "8px" }}>Total Assets</td>
            <td style={{ padding: "8px" }}>
              <input
                type="number"
                name="totalAssets2024"
                value={answers.totalAssets2024}
                onChange={handleChange}
                style={{ width: "80px" }}
              />
            </td>
            <td style={{ padding: "8px" }}>243,197</td>
          </tr>
          <tr>
            <td style={{ padding: "8px" }}>Accounts Payable</td>
            <td style={{ padding: "8px" }}>
              <input
                type="number"
                name="accountsPayable2024"
                value={answers.accountsPayable2024}
                onChange={handleChange}
                style={{ width: "80px" }}
              />
            </td>
            <td style={{ padding: "8px" }}>53,742</td>
          </tr>
          <tr>
            <td style={{ padding: "8px" }}>Long-term Debt</td>
            <td style={{ padding: "8px" }}>36,132</td>
            <td style={{ padding: "8px" }}>
              <input
                type="number"
                name="longTermDebt2023"
                value={answers.longTermDebt2023}
                onChange={handleChange}
                style={{ width: "80px" }}
              />
            </td>
          </tr>
          <tr>
            <td style={{ padding: "8px" }}>Retained Earnings</td>
            <td style={{ padding: "8px" }}>
              <input
                type="number"
                name="retainedEarnings2024"
                value={answers.retainedEarnings2024}
                onChange={handleChange}
                style={{ width: "80px" }}
              />
            </td>
            <td style={{ padding: "8px" }}>83,135</td>
          </tr>
          <tr>
            <td style={{ padding: "8px" }}>Total Equity</td>
            <td style={{ padding: "8px" }}>90,349</td>
            <td style={{ padding: "8px" }}>
              <input
                type="number"
                name="totalEquity2023"
                value={answers.totalEquity2023}
                onChange={handleChange}
                style={{ width: "80px" }}
              />
            </td>
          </tr>
          <tr>
            <td style={{ padding: "8px" }}>
              Total Liabilities, redeemable noncontrolling interest, and equity
            </td>
            <td style={{ padding: "8px" }}>
              <input
                type="number"
                name="totalLiabilities2024"
                value={answers.totalLiabilities2024}
                onChange={handleChange}
                style={{ width: "80px" }}
              />
            </td>
            <td style={{ padding: "8px" }}>243,197</td>
          </tr>
        </tbody>
      </table>

      <button
        style={{
          marginTop: "20px",
          padding: "10px 15px",
          background: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={checkAnswers}
      >
        Check Answers
      </button>
    </div>
  );
};

export default BalanceSheetQuiz;
