interface Pokemon {
  name: string;
  url: string;
}

interface GameData {
  pokemon: Pokemon[];
  correctAnswer: Answer;
}

interface Answer {
  image: string;
  name: string;
}

export type { Pokemon, GameData, Answer };
