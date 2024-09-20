import React from "react";
import { render, screen } from "@testing-library/react";
import GameScreen from "./GameScreen";

test("renders start-button", () => {
  render(<GameScreen />);

  const startButton = screen.getByTestId("start-play-button");
  expect(startButton).toBeInTheDocument();

  const endButton = screen.getByTestId("end-play-button");
  expect(endButton).toBeInTheDocument();
});
