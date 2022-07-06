import React, { useState, useEffect } from "react";
import Big from "big.js";
import "./App.css";

const BOATLOAD_OF_GAS = Big(3)
  .times(10 ** 13)
  .toFixed();

function App({ contract, currentUser, nearConfig, wallet }) {
  const [status, setStatus] = useState(null);
  useEffect(() => {
    const getStatus = async () => {
      if (currentUser) {
        const status = await contract.get_status({
          account_id: currentUser.accountId,
        });
        setStatus(status);
      }
    };
    getStatus();
  }, [contract, currentUser]);

  const onSubmit = async (event) => {
    event.preventDefault();

    const { fieldset, message } = event.target.elements;
    fieldset.disabled = true;

    await contract.set_status(
      { message: message.value, account_id: currentUser.accountId },
      BOATLOAD_OF_GAS
    );

    const status = await contract.get_status({
      account_id: currentUser.accountId,
    });

    setStatus(status);
    message.value = "";
    fieldset.disabled = false;
    message.focus();
  };

  const signIn = () => {
    wallet.requestSignIn(
      {
        contractId: nearConfig.contractName,
        methodNames: ["set_status"],
      },
      "NEAR Status Message"
    );
  };

  const signOut = () => {
    wallet.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  };
  return (
    <div className="App">
      {status ? (
        <>
          <p>Your current status:</p>
          <p>
            <code>{status}</code>
          </p>
        </>
      ) : (
        <p>No status message yet!</p>
      )}
      {currentUser ? (
        <button onClick={signOut}>Sign Out</button>
      ) : (
        <button onClick={signIn}>Log In</button>
      )}
      <form onSubmit={onSubmit}>
        <fieldset id="fieldset">
          <p>Add or update your status message!</p>
          <p className="highlight">
            <label htmlFor="message">Message:</label>
            <input autoComplete="off" autoFocus id="message" required />
          </p>
          <button type="submit">Update</button>
        </fieldset>
      </form>
    </div>
  );
}

export default App;
