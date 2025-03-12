import React, { useEffect, useRef } from "react";
import "./App.css";
import { DinorCard } from "./components/Card";
import { DinorButton } from "./components/DinorButton";

function App() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleDataSent = (event: CustomEvent) => {
    console.log("Received data from Angular:", event.detail);
  };

  useEffect(() => {
    const button = buttonRef.current;

    if (button) {
      // @ts-ignore
      button.addEventListener("dataSent", handleDataSent);
    }

    return () => {
      if (button) {
        // @ts-ignore
        button.removeEventListener("dataSent", handleDataSent);
      }
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>This is a react app</p>

        <DinorButton
          title="Click me i'm a dnor button"
          variant="primary-filled"
          size="large"
        ></DinorButton>

        <div style={{ marginTop: "40px" }} />

        <DinorCard title="I am a card">
          <div>just a random contenttttt</div>
        </DinorCard>
      </header>
    </div>
  );
}

export default App;
