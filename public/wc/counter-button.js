// Define the custom element class
class CounterButton extends HTMLElement {
  constructor() {
    super();

    // Create a shadow DOM
    this.attachShadow({ mode: "open" });

    // Initialize counter
    this.count = 0;

    // Create the component's HTML
    this.shadowRoot.innerHTML = `
      <style>
        .counter-button {
          padding: 10px 20px;
          font-size: 16px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .counter-button:hover {
          background-color: #45a049;
        }
        
        .counter {
          margin-left: 10px;
          font-weight: bold;
        }
      </style>
      
      <button class="counter-button">
        Click me! <span class="counter">${this.count}</span>
      </button>
    `;

    // Add click event listener
    this.shadowRoot.querySelector("button").addEventListener("click", () => {
      this.count++;
      this.updateCount();
    });
  }

  // Method to update the counter display
  updateCount() {
    this.shadowRoot.querySelector(".counter").textContent = this.count;
  }
}

// Register the custom element
customElements.define("counter-button", CounterButton);
export {};

// Usage example:
// <counter-button></counter-button>
