import { useReducer, useState, useEffect } from 'react';

// Custom hook from your previous lesson
function useLocalStorageState(key, initialState) {
  const [value, setValue] = useState(() => {
    return localStorage.getItem(key) || initialState;
  });

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue];
}

// Initial state for the cat fact reducer
const initialFactState = {
  loading: false,
  error: null,
  fact: null,
};

// Reducer function for managing cat fact fetch states
function factReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { loading: true, error: null, fact: null };
    case 'FETCH_SUCCESS':
      return { loading: false, error: null, fact: action.payload };
    case 'FETCH_ERROR':
      return { loading: false, error: action.payload, fact: null };
    default:
      return state;
  }
}

function App() {
  // Local storage state from previous lessons
  const [username, setUsername] = useLocalStorageState('username', '');
  const [favoriteColor, setFavoriteColor] = useLocalStorageState('favoriteColor', '');

  // useReducer state for the cat fact generator
  const [factState, dispatch] = useReducer(factReducer, initialFactState);
  const { loading, error, fact } = factState;

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleColorChange = (event) => {
    setFavoriteColor(event.target.value);
  };

  // Handler to fetch cat fact using useReducer dispatch actions
  const fetchCatFact = async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const response = await fetch('https://catfact.ninja/fact');
      if (!response.ok) {
        throw new Error('Failed to fetch cat fact');
      }
      const data = await response.json();
      dispatch({ type: 'FETCH_SUCCESS', payload: data.fact });
    } catch (err) {
      dispatch({ type: 'FETCH_ERROR', payload: err.message });
    }
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
        <p>
          Your favorite color is:{' '}
          <span style={{ color: favoriteColor || 'black', fontWeight: 'bold' }}>
            {favoriteColor || 'None'}
          </span>
        </p>
      </div>

      <hr style={{ margin: '25px 0' }} />

      {/* Cat Fact Generator Section */}
      <div>
        <h1>Cat Fact Generator</h1>
        <button onClick={fetchCatFact} style={{ marginBottom: '15px', padding: '8px 16px' }}>
          Get Cat Fact
        </button>

        {/* Conditional Rendering for API states */}
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        {fact && <p style={{ fontStyle: 'italic' }}>"{fact}"</p>}
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