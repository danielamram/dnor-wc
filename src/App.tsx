import { useControls } from "leva";
import React from "react";
import { DnorButton } from "./components/DnorButton";
import { DnorCard } from "./components/DnorCard";
import DnorGrid, { DnorGridItem } from "./components/DnorGrid";
import "./styles/App.scss";

function App() {
  const gridControls = useControls("Main Grid", {
    rows: {
      value: 6 as 2 | 4 | 6 | 8,
      options: [2, 4, 6, 8],
      label: "Grid Rows",
    },
    mainCardColSpan: {
      value: 6,
      min: 1,
      max: 12,
      step: 1,
      label: "Main Card Column Span",
    },
    mainCardRowSpan: {
      value: 4,
      min: 1,
      max: 8,
      step: 1,
      label: "Main Card Row Span",
    },
    buttonColSpan: {
      value: 5,
      min: 1,
      max: 12,
      step: 1,
      label: "Button Column Span",
    },
  });

  const nestedGridControls = useControls("Nested Grid", {
    rows: {
      value: 4 as 2 | 4 | 6 | 8,
      options: [2, 4, 6, 8],
      label: "Nested Grid Rows",
    },
    item1ColSpan: {
      value: 6,
      min: 1,
      max: 12,
      step: 1,
      label: "Item 1 Column Span",
    },
    item2ColSpan: {
      value: 3,
      min: 1,
      max: 12,
      step: 1,
      label: "Item 2 Column Span",
    },
    item3ColSpan: {
      value: 3,
      min: 1,
      max: 12,
      step: 1,
      label: "Item 3 Column Span",
    },
  });

  const componentControls = useControls("Component Properties", {
    cardTitle: {
      value: "I am a dnor card",
      label: "Card Title",
    },
    buttonVariant: {
      value: "primary-filled",
      options: ["primary-filled", "secondary-filled"],
      label: "Button Variant",
    },
    buttonTitle: {
      value: "Click me i'm a dnor button",
      label: "Button Title",
    },
    buttonSize: {
      value: "large",
      options: ["tiny", "small", "medium", "large", "huge"],
      label: "Button Size",
    },
  });

  const mainGridRows = gridControls.rows as 2 | 4 | 6 | 8;
  const nestedGridRows = nestedGridControls.rows as 2 | 4 | 6 | 8;

  return (
    <div className="App">
      <main className="App-main">
        <DnorGrid rows={mainGridRows}>
          <DnorGridItem colStart={6} colSpan={2} rowStart={1} rowSpan={2}>
            <div>This is a DNOR Web components demo</div>
          </DnorGridItem>
          <DnorGridItem
            colStart={1}
            colSpan={gridControls.mainCardColSpan}
            rowStart={3}
            rowSpan={gridControls.mainCardRowSpan}
          >
            <DnorCard title={componentControls.cardTitle}>
              <div className="card-content">
                <p>DNOR content</p>
                <div className="animated-logo">DN</div>
                <DnorGrid rows={nestedGridRows}>
                  <DnorGridItem
                    colStart={1}
                    colSpan={nestedGridControls.item1ColSpan}
                    rowStart={1}
                    rowSpan={2}
                  >
                    <div className="sub-grid-item">Sub-grid item 1</div>
                  </DnorGridItem>
                  <DnorGridItem
                    colStart={1}
                    colSpan={nestedGridControls.item2ColSpan}
                    rowStart={3}
                    rowSpan={2}
                  >
                    <div className="sub-grid-item">Sub-grid item 2</div>
                  </DnorGridItem>
                  <DnorGridItem
                    colStart={nestedGridControls.item2ColSpan + 1}
                    colSpan={nestedGridControls.item3ColSpan}
                    rowStart={3}
                    rowSpan={2}
                  >
                    <div className="sub-grid-item">Sub-grid item 3</div>
                  </DnorGridItem>
                </DnorGrid>
              </div>
            </DnorCard>
          </DnorGridItem>
          <DnorGridItem
            colStart={8}
            colSpan={gridControls.buttonColSpan}
            rowStart={3}
            rowSpan={4}
          >
            <DnorButton
              title="Click me i'm a dnor button"
              variant={
                componentControls.buttonVariant as
                  | "primary-filled"
                  | "secondary-filled"
              }
              size={
                componentControls.buttonSize as
                  | "tiny"
                  | "small"
                  | "medium"
                  | "large"
                  | "huge"
              }
            ></DnorButton>
          </DnorGridItem>
        </DnorGrid>
      </main>
    </div>
  );
}

export default App;
