// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function useLocalStorageState(storageKey, initialValue) {
  const [value, setValue] = React.useState(() => {
    const storedValue = window.localStorage.getItem(storageKey);
    if (storedValue) {
      return JSON.parse(storedValue);
    }

    return initialValue;
  });

  React.useEffect(() => {
    const serializedValue = JSON.stringify(value);
    window.localStorage.setItem(storageKey, serializedValue);
  }, [storageKey, value]);

  return [value, setValue];
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState('name', initialName);

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
