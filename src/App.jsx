import { useState, useEffect } from 'react';

function useLocalStorageState(key, initialState) {
  const [value, setValue] = useState(() => {
    return localStorage.getItem(key) || initialState;
  });

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue];
}

function App() {
  const [username, setUsername] = useLocalStorageState('username', '');
  const [favoriteColor, setFavoriteColor] = useLocalStorageState('favoriteColor', '');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleColorChange = (event) => {
    setFavoriteColor(event.target.value);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome!</h1>
      
      <InputWithLabel
        id="username"
        value={username}
        onInputChange={handleUsernameChange}
      >
        Username:
      </InputWithLabel>
      
      <p>Hello, {username || 'Guest'}!</p>

      <div style={{ marginTop: '15px' }}>
        <InputWithLabel
          id="favoriteColor"
          value={favoriteColor}
          onInputChange={handleColorChange}
        >
          Favorite Color:
        </InputWithLabel>
        <p>Your favorite color is: {favoriteColor || 'None'}</p>
      </div>
    </div>
  );
}

function InputWithLabel(props) {
  return (
    <>
      <label htmlFor={props.id} style={{ marginRight: '8px' }}>{props.children}</label>
      <input
        id={props.id}
        type="text"
        value={props.value}
        onChange={props.onInputChange}
      />
    </>
  );
}

export default App;