import { Pokemon } from "../types";

const pokeApiUrl = `https://pokeapi.co/api/v2/pokemon?limit=50`;

async function getAllPokemon() {
  try {
    const result = await fetch(pokeApiUrl);
    const pokemonData = await result.json();
    return pokemonData.results as Pokemon[];
  } catch (e) {
    console.warn(e);
    return null;
  }
}

function getPokemonImage(imageIdentifier: string) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${imageIdentifier}.png`;
}

function getFourPokemon(pokemonData: Pokemon[]) {
  return pokemonData.splice(0, 4);
}

function getPokemonNumber(url: string) {
  const numberRegEx = /(\d+)\/$/;
  return (url.match(numberRegEx) || [])[1];
}

function shufflePokemon(pokemonData: Pokemon[]) {
  const shuffledPokemon = pokemonData
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  return shuffledPokemon;
}

export {
  getAllPokemon,
  getPokemonNumber,
  getPokemonImage,
  shufflePokemon,
  getFourPokemon,
};
