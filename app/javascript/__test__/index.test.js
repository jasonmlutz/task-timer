/**
 * @jest-environment jsdom
 */
import React from "react";
import ReactDOM from "react-dom/client";

// COMPONENTS
import App from "../components/App"

describe("APPLICATION ROOT", () => {
  describe("STATIC TESTS", () => {
    test("should render without crashing", () => {
      jest.spyOn(ReactDOM, "createRoot")
      // jest.spyOn(ReactDOM, "render")
      const div = document.createElement("div");
      div.id = "root";
      document.body.appendChild(div)
      require("../index.jsx")
      expect(ReactDOM.createRoot).toHaveBeenCalledWith(div)
      // expect(render).toHaveBeenCalledWith(
      //   <React.StrictMode>
      //     <App />
      //   </React.StrictMode>
      // )
    })
    test.todo("should call root.render")
  })
})