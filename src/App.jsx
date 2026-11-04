import { useEffect, useRef, useReducer } from 'react';

const initialState = {
  data: [],
  isLoading: false,
  isError: false,
  searchTerm: 'react',
};

function storiesReducer(state, action) {
  switch (action.type) {
    case 'FETCH_INIT':
      return { ...state, isLoading: true, isError: false };
    case 'FETCH_SUCCESS':
      return { ...state, isLoading: false, data: action.payload };
    case 'FETCH_FAILURE':
      return { ...state, isLoading: false, isError: true };
    case 'REMOVE_ITEM':
      return {
        ...state,
        data: state.data.filter((item) => item.objectID !== action.payload),
      };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    default:
      return state;
  }
}

function App() {
  const inputRef = useRef();
  const [state, dispatch] = useReducer(storiesReducer, initialState);

  const fetchArticles = () => {
    if (!state.searchTerm) return;

    dispatch({ type: 'FETCH_INIT' });

    fetch(`https://hn.algolia.com/api/v1/search?query=${state.searchTerm}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch');
        }
        return res.json();
      })
      .then((result) => {
        dispatch({ type: 'FETCH_SUCCESS', payload: result.hits });
      })
      .catch(() => {
        dispatch({ type: 'FETCH_FAILURE' });
      });
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchArticles();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>My Articles</h1>

      <form onSubmit={handleSearchSubmit} style={{ marginBottom: '20px' }}>
        <input
          ref={inputRef}
          type="text"
          value={state.searchTerm}
          onChange={(e) =>
            dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value })
          }
          style={{ marginRight: '8px' }}
        />
        <button
          type="button"
          onClick={() => inputRef.current.focus()}
          style={{ marginRight: '8px' }}
        >
          Focus Input
        </button>
        <button type="submit">Search</button>
      </form>

      {state.isError && <p>Something went wrong...</p>}

      {state.isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {state.data.map((item) => (
            <li key={item.objectID} style={{ marginBottom: '8px' }}>
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                {item.title}
              </a>
              <button
                type="button"
                onClick={() =>
                  dispatch({ type: 'REMOVE_ITEM', payload: item.objectID })
                }
                style={{ marginLeft: '10px' }}
              >
                Dismiss
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;