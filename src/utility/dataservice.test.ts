import { log } from "console";
import {
  getAllPokemon,
  getFourPokemon,
  getPokemonImage,
  getPokemonNumber,
  shufflePokemon,
} from "./dataService";
import { Pokemon } from "../types";

const testPokemon = {
  results: [
    { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
    { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
    { name: "venusaur", url: "https://pokeapi.co/api/v2/pokemon/3/" },
    { name: "charmander", url: "https://pokeapi.co/api/v2/pokemon/4/" },
    { name: "charmeleon", url: "https://pokeapi.co/api/v2/pokemon/5/" },
    { name: "charizard", url: "https://pokeapi.co/api/v2/pokemon/6/" },
    { name: "squirtle", url: "https://pokeapi.co/api/v2/pokemon/7/" },
    { name: "wartortle", url: "https://pokeapi.co/api/v2/pokemon/8/" },
    { name: "blastoise", url: "https://pokeapi.co/api/v2/pokemon/9/" },
    { name: "caterpie", url: "https://pokeapi.co/api/v2/pokemon/10/" },
    { name: "metapod", url: "https://pokeapi.co/api/v2/pokemon/11/" },
    { name: "butterfree", url: "https://pokeapi.co/api/v2/pokemon/12/" },
    { name: "weedle", url: "https://pokeapi.co/api/v2/pokemon/13/" },
    { name: "kakuna", url: "https://pokeapi.co/api/v2/pokemon/14/" },
    { name: "beedrill", url: "https://pokeapi.co/api/v2/pokemon/15/" },
    { name: "pidgey", url: "https://pokeapi.co/api/v2/pokemon/16/" },
    { name: "pidgeotto", url: "https://pokeapi.co/api/v2/pokemon/17/" },
    { name: "pidgeot", url: "https://pokeapi.co/api/v2/pokemon/18/" },
    { name: "rattata", url: "https://pokeapi.co/api/v2/pokemon/19/" },
    { name: "raticate", url: "https://pokeapi.co/api/v2/pokemon/20/" },
    { name: "spearow", url: "https://pokeapi.co/api/v2/pokemon/21/" },
    { name: "fearow", url: "https://pokeapi.co/api/v2/pokemon/22/" },
    { name: "ekans", url: "https://pokeapi.co/api/v2/pokemon/23/" },
    { name: "arbok", url: "https://pokeapi.co/api/v2/pokemon/24/" },
    { name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon/25/" },
    { name: "raichu", url: "https://pokeapi.co/api/v2/pokemon/26/" },
    { name: "sandshrew", url: "https://pokeapi.co/api/v2/pokemon/27/" },
    { name: "sandslash", url: "https://pokeapi.co/api/v2/pokemon/28/" },
    { name: "nidoran-f", url: "https://pokeapi.co/api/v2/pokemon/29/" },
    { name: "nidorina", url: "https://pokeapi.co/api/v2/pokemon/30/" },
    { name: "nidoqueen", url: "https://pokeapi.co/api/v2/pokemon/31/" },
    { name: "nidoran-m", url: "https://pokeapi.co/api/v2/pokemon/32/" },
    { name: "nidorino", url: "https://pokeapi.co/api/v2/pokemon/33/" },
    { name: "nidoking", url: "https://pokeapi.co/api/v2/pokemon/34/" },
    { name: "clefairy", url: "https://pokeapi.co/api/v2/pokemon/35/" },
    { name: "clefable", url: "https://pokeapi.co/api/v2/pokemon/36/" },
    { name: "vulpix", url: "https://pokeapi.co/api/v2/pokemon/37/" },
    { name: "ninetales", url: "https://pokeapi.co/api/v2/pokemon/38/" },
    { name: "jigglypuff", url: "https://pokeapi.co/api/v2/pokemon/39/" },
    { name: "wigglytuff", url: "https://pokeapi.co/api/v2/pokemon/40/" },
    { name: "zubat", url: "https://pokeapi.co/api/v2/pokemon/41/" },
    { name: "golbat", url: "https://pokeapi.co/api/v2/pokemon/42/" },
    { name: "oddish", url: "https://pokeapi.co/api/v2/pokemon/43/" },
    { name: "gloom", url: "https://pokeapi.co/api/v2/pokemon/44/" },
    { name: "vileplume", url: "https://pokeapi.co/api/v2/pokemon/45/" },
    { name: "paras", url: "https://pokeapi.co/api/v2/pokemon/46/" },
    { name: "parasect", url: "https://pokeapi.co/api/v2/pokemon/47/" },
    { name: "venonat", url: "https://pokeapi.co/api/v2/pokemon/48/" },
    { name: "venomoth", url: "https://pokeapi.co/api/v2/pokemon/49/" },
    { name: "diglett", url: "https://pokeapi.co/api/v2/pokemon/50/" },
  ],
};

beforeEach(() => {
  fetchMock.resetMocks;
  fetchMock.doMock();
});

it("Retrieves first 50 pokemon results", async () => {
  fetchMock.mockResponseOnce(JSON.stringify(testPokemon));
  const pokemon = await getAllPokemon();
  log("pokemon: ", pokemon);

  expect(pokemon).toBeDefined;
  expect(pokemon).toHaveLength(50);
  expect(fetch).toHaveBeenCalledWith(
    "https://pokeapi.co/api/v2/pokemon?limit=50"
  );
});

it("returns null when exception caused by offline service", async () => {
  fetchMock.mockReject(() => Promise.reject("API is down"));

  const pokemonData = await getAllPokemon();

  expect(pokemonData).toEqual(null);
  expect(fetch).toHaveBeenCalledWith(
    "https://pokeapi.co/api/v2/pokemon?limit=50"
  );
});

it("A pokemon image number is returned with a valid URL", async () => {
  const pokemonNumber = getPokemonNumber(testPokemon.results[0].url);
  expect(pokemonNumber).toEqual("1");
});

it("A pokemon image number is not returned with an invalid URL", async () => {
  const invalidPokemon = {
    name: "stench",
    url: "https://pokeapi.co/api/v2/ability/wrong",
  };

  const pokemonNumber = getPokemonNumber(invalidPokemon.url);
  expect(pokemonNumber).toBeUndefined;
});

it("A pokemon image link is returned, containing a number", async () => {
  expect(getPokemonImage("1")).toEqual(
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
  );
});

it("A collection of pokemon is shuffled randomly", async () => {
  // first compare two arrays with the same data
  let copyOfPokemon = testPokemon.results.slice();

  expect(compareArrayValues(copyOfPokemon, testPokemon.results)).toEqual(true);

  // Now shuffle the original data and compare again.
  copyOfPokemon = shufflePokemon(testPokemon.results);
  expect(compareArrayValues(copyOfPokemon, testPokemon.results)).toEqual(false);
});

it("Four pokemon are selected from a collection of pokemon", async () => {
  const fourPokemon = getFourPokemon(testPokemon.results);
  expect(fourPokemon).toHaveLength(4);
});

function compareArrayValues(array1: Pokemon[], array2: Pokemon[]) {
  return (
    array1.length === array2.length &&
    array1.every(function (value, index) {
      return value === array2[index];
    })
  );
}
