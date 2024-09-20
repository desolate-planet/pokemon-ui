import React from "react";
import { useEffect } from "react";
import "./GameScreen.css";
import {
  getAllPokemon,
  getPokemonImage,
  shufflePokemon,
  getFourPokemon,
  getPokemonNumber,
} from "../../utility/dataService";
import { GameData, Pokemon } from "../../types";

export function GameScreen() {
  const [score, setScore] = React.useState<number>(0);
  const [imageSrc, setImageSrc] = React.useState<string>("");
  const [displayStyle, setDisplayStyle] = React.useState<string>("fetching");

  const [gameData, setGameData] = React.useState<GameData>();
  const [showChoices, setShowChoices] = React.useState<string>("hidden");
  const [correctAnswer, setCorrectAnswer] = React.useState<string>("");
  const [hasGameStarted, setGameStarted] = React.useState<boolean>(false);

  const [playButtonStyle, setShowPlayButtonStyle] =
    React.useState<string>("show-play-button");
  const [endPlayButtonStyle, setShowEndPlayButtonStyle] =
    React.useState<string>("hide-end-play-button");

  const [nextButtonStyle, setShowNextButtonStyle] =
    React.useState<string>("hide-next-button");

  const [hasAnswered, setHasAnswered] = React.useState<boolean>(false);

  useEffect(() => {
    getPokemonStateFromServer();
  }, []);

  async function startGame() {
    setScore(0);
    setGameStarted(true);
    changeQuestion();
    setShowPlayButtonStyle("hide-play-button");
    setShowEndPlayButtonStyle("show-end-play-button");
  }

  async function endGame() {
    resetImage();
    setGameStarted(false);
    setShowPlayButtonStyle("show-play-button");
    setShowEndPlayButtonStyle("hide-end-play-button");
  }

  function resetImage() {
    setImageSrc("");
    setDisplayStyle("fetching");
  }

  function getPokemonStateFromStorage() {
    const pokemonJson = localStorage.getItem("pokemon") ?? "{}";
    return JSON.parse(pokemonJson) as Pokemon[];
  }

  function getPokemonStateFromServer() {
    getAllPokemon().then((availablePokemon) => {
      if (availablePokemon == null) {
        return;
      }

      localStorage.setItem("pokemon", JSON.stringify(availablePokemon));

      const randomPokemon = shufflePokemon(availablePokemon);
      const pokemonChoices = getFourPokemon(randomPokemon);

      const [correctPokemon] = pokemonChoices;
      const number = getPokemonNumber(correctPokemon.url);
      const image = getPokemonImage(number);
      setCorrectAnswer(correctPokemon.name);
      setGameStarted(false);

      setImageSrc(image);

      setGameData({
        pokemon: shufflePokemon(pokemonChoices),
        correctAnswer: {
          image,
          name: correctPokemon.name,
        },
      });
    });
  }

  function changeQuestion() {
    resetImage();
    showSilhouette();

    let availablePokemon = getPokemonStateFromStorage();

    const randomPokemon = shufflePokemon(availablePokemon);
    const pokemonChoices = getFourPokemon(randomPokemon);

    const [correctPokemon] = pokemonChoices;
    const number = getPokemonNumber(correctPokemon.url);
    const image = getPokemonImage(number);
    setCorrectAnswer(correctPokemon.name);

    setImageSrc(image);

    setGameData({
      pokemon: shufflePokemon(pokemonChoices),
      correctAnswer: {
        image,
        name: correctPokemon.name,
      },
    });

    setHasAnswered(false);
    setShowNextButtonStyle("hide-next-button");
  }

  function showSilhouette() {
    if (!gameData) {
      return;
    }
    setDisplayStyle("hidden");
  }

  function validateAnswer(ev: React.SyntheticEvent<EventTarget>) {
    if (hasAnswered || !gameData) {
      return;
    }

    if (!(ev.target instanceof HTMLButtonElement)) {
      return;
    }

    const { name } = ev.target.dataset;

    if (name === gameData.correctAnswer.name) {
      setScore(score + 10);
    }

    revealPokemon();
    setHasAnswered(true);
    setShowNextButtonStyle("show-next-button");
  }

  function revealPokemon() {
    setDisplayStyle("revealed");
  }

  return (
    <div id="game-screen">
      <main className={displayStyle}>
        <div id="pokemon-container">
          <img id="pokemon-image" alt="pokemon-image" src={imageSrc} />
        </div>
        <div id="answer">
          <div id="bg-overlay"></div>
          <div id="text-overlay">{correctAnswer}</div>
        </div>

        {hasGameStarted && (
          <button
            id="next-button"
            className={nextButtonStyle}
            data-testid="next-button"
            onClick={changeQuestion}
          >
            Next Pokemon
          </button>
        )}

        <button
          id="start-play-button"
          className={playButtonStyle}
          data-testid="start-play-button"
          onClick={startGame}
        >
          Play Game
        </button>

        <button
          id="end-play-button"
          data-testid="end-play-button"
          className={endPlayButtonStyle}
          onClick={endGame}
        >
          End Game
        </button>

        <p>Score: {score}</p>

        <section id="controls">
          <div id="choices" className={showChoices}>
            {gameData?.pokemon.map(({ name }) => {
              return (
                <div>
                  <button data-name={name} onClick={validateAnswer}>
                    {name}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

export default GameScreen;
