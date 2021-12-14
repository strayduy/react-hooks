// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  PokemonDataView,
  PokemonForm,
  PokemonInfoFallback,
  fetchPokemon,
} from '../pokemon'

const Status = {
  Idle: 'idle',
  Pending: 'pending',
  Resolved: 'resolved',
  Rejected: 'rejected',
};

function PokemonInfo({pokemonName}) {
  // 🐨 Have state for the pokemon (null)
  // 🐨 use React.useEffect where the callback should be called whenever the
  // pokemon name changes.
  // 💰 DON'T FORGET THE DEPENDENCIES ARRAY!
  // 💰 if the pokemonName is falsy (an empty string) then don't bother making the request (exit early).
  // 🐨 before calling `fetchPokemon`, clear the current pokemon state by setting it to null
  // 💰 Use the `fetchPokemon` function to fetch a pokemon by its name:
  //   fetchPokemon('Pikachu').then(
  //     pokemonData => {/* update all the state here */},
  //   )
  // 🐨 return the following things based on the `pokemon` state and `pokemonName` prop:
  //   1. no pokemonName: 'Submit a pokemon'
  //   2. pokemonName but no pokemon: <PokemonInfoFallback name={pokemonName} />
  //   3. pokemon: <PokemonDataView pokemon={pokemon} />

  const [pokemonState, setPokemonState] = React.useState({
    status: Status.Idle,
  });
  const { error, pokemon, status } = pokemonState;

  React.useEffect(() => {
    if (!pokemonName) {
      setPokemonState({ status: Status.Idle });
      return;
    }

    setPokemonState({ status: Status.Pending });

    fetchPokemon(pokemonName)
      .then(pokemonData => {
          setPokemonState({
            pokemon: pokemonData,
            status: Status.Resolved,
          });
      })
      .catch(error => {
          setPokemonState({
            error: error,
            status: Status.Rejected,
          });
      });
  }, [pokemonName]);

  switch (status) {
    case Status.Pending:
      return <PokemonInfoFallback name={pokemonName} />;
    case Status.Resolved:
      return <PokemonDataView pokemon={pokemon} />;
    case Status.Rejected:
      throw error;
    case Status.Idle:
    default:
      return 'Submit a pokemon';
  };
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { error, hasError: true };
  }

  render() {
    const { error, hasError } = this.state;

    if (hasError) {
      return (
        <div role="alert">
          There was an error:
          <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary key={pokemonName}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
