import { useControls } from "leva";
import React from "react";
import { DnorButton } from "./components/DnorButton";
import { DnorCard } from "./components/DnorCard";
import DnorGrid, { DnorGridItem } from "./components/DnorGrid";
import "./styles/App.scss";

function App() {
  const gridControls = useControls("Main Grid", {
    mainCardColSpan: {
      value: 6,
      min: 1,
      max: 12,
      step: 1,
      label: "Main Card Column Span",
    },
    buttonRowStart: {
      value: 5,
      min: 1,
      max: 12,
      step: 1,
      label: "Button Row Start",
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
      value: "I am a dnor card title",
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

  const nestedGridRows = nestedGridControls.rows as 2 | 4 | 6 | 8;

  return (
    <div className="App">
      <main className="App-main">
        <DnorGrid rows={6}>
          <DnorGridItem colStart={4} colSpan={6} rowStart={1} rowSpan={1}>
            <div className="page-title">
              <h1>DNOR Web Components Demo</h1>
              <p className="subtitle">
                Explore our component library with interactive controls
              </p>
            </div>
          </DnorGridItem>
          <DnorGridItem
            colStart={1}
            colSpan={gridControls.mainCardColSpan}
            rowStart={2}
            rowSpan={4}
          >
            <DnorCard title={componentControls.cardTitle}>
              <div className="animated-logo">DN</div>
              <DnorGrid rows={nestedGridRows}>
                <DnorGridItem
                  colStart={1}
                  colSpan={nestedGridControls.item1ColSpan}
                  rowStart={1}
                  rowSpan={2}
                >
                  <div className="sub-grid-item">
                    <span className="item-title">Grid Item 1</span>
                    <span className="item-desc">Responsive grid system</span>
                  </div>
                </DnorGridItem>
                <DnorGridItem
                  colStart={1}
                  colSpan={nestedGridControls.item2ColSpan}
                  rowStart={3}
                  rowSpan={2}
                >
                  <div className="sub-grid-item">
                    <span className="item-title">Grid Item 2</span>
                    <span className="item-desc">Flexible layouts</span>
                  </div>
                </DnorGridItem>
                <DnorGridItem
                  colStart={nestedGridControls.item2ColSpan + 1}
                  colSpan={nestedGridControls.item3ColSpan}
                  rowStart={3}
                  rowSpan={2}
                >
                  <div className="sub-grid-item">
                    <span className="item-title">Grid Item 3</span>
                    <span className="item-desc">Dynamic sizing</span>
                  </div>
                </DnorGridItem>
              </DnorGrid>
            </DnorCard>
          </DnorGridItem>
          <DnorGridItem
            colStart={gridControls.mainCardColSpan + 1}
            colSpan={gridControls.buttonColSpan}
            rowStart={gridControls.buttonRowStart}
            rowSpan={3}
          >
            <DnorButton
              title={componentControls.buttonTitle}
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
          <DnorGridItem colStart={1} colSpan={12} rowStart={6} rowSpan={1}>
            <footer className="App-footer">
              <p>DNOR Web Components library footer</p>
            </footer>
          </DnorGridItem>
        </DnorGrid>
      </main>
    </div>
  );
}

export default App;
