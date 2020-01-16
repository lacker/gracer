import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("renders something", () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/error/i);
  expect(linkElement).not.toBeInTheDocument();
});
