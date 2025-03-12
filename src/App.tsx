import React from "react";
import "./App.scss";
import { DnorButton } from "./components/DnorButton";
import { DnorCard } from "./components/DnorCard";
import { Grid, GridItem } from "./components/Grid";

function App() {
  return (
    <div className="App">
      <main className="App-main">
        <Grid rows={6}>
          <GridItem colStart={6} colSpan={2} rowStart={1} rowSpan={2}>
            <div>This is a dnor component header</div>
          </GridItem>
          <GridItem colStart={1} colSpan={6} rowStart={3} rowSpan={4}>
            <DnorCard title="I am a dnor card">
              <div className="card-content">
                <p>DNOR content</p>
                <div className="animated-logo">DN</div>
                <Grid rows={4}>
                  <GridItem colSpan={6} rowSpan={2}>
                    <div className="sub-grid-item">Sub-grid item 1</div>
                  </GridItem>
                  <GridItem colStart={1} colSpan={3} rowStart={3} rowSpan={2}>
                    <div className="sub-grid-item">Sub-grid item 2</div>
                  </GridItem>
                  <GridItem colStart={4} colSpan={3} rowStart={3} rowSpan={2}>
                    <div className="sub-grid-item">Sub-grid item 3</div>
                  </GridItem>
                </Grid>
              </div>
            </DnorCard>
          </GridItem>
          <GridItem colStart={8} colSpan={5} rowStart={3} rowSpan={4}>
            <DnorButton
              title="Click me i'm a dnor button"
              variant="primary-filled"
              size="large"
            ></DnorButton>
          </GridItem>
        </Grid>
      </main>
    </div>
  );
}

export default App;
