import { createContext, useEffect, useReducer } from 'react';
// import axios from 'src/utils/axios';
import axios from 'axios';
import { verify, JWT_SECRET } from 'src/utils/jwt';
import PropTypes from 'prop-types';

const initialAuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  errors: {},
  errors1: {}
};

const setSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem('accessToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;
    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  ERROR: (state, action) => {
    const { errors, errors1 } = action.payload;
    return {
      ...state,
      isAuthenticated: false,
      user: null,
      errors: errors || {},
      errors1: errors1 || {}
    };
  }
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext({
  ...initialAuthState,
  method: 'JWT',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  error: () => Promise.resolve()
});

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialAuthState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');

        if (accessToken && verify(accessToken, JWT_SECRET)) {
          setSession(accessToken);

          const response = await axios.get('/api/account/personal');
          const { user } = response.data;

          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user
            }
          });
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null
            }
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    };

    initialize();
  }, []);

  const login = async (email, password) => {
    const response = await axios.post('/api/user/login', {
      email,
      password
    });

    const { accessToken, user, success, errors } = response.data;
    if (success) {
      setSession(accessToken);
      dispatch({
        type: 'LOGIN',
        payload: {
          user
        }
      });
    } else {
      console.log(response.data, response.data.errors, '****');
      dispatch({
        type: 'ERROR',
        payload: {
          errors
        }
      });
    }
  };

  const logout = async () => {
    setSession(null);
    dispatch({ type: 'LOGOUT' });
  };

  const register = async (email, name, password) => {
    // const response = await axios.post('/api/account/register', {
    const response = await axios.post('/api/user/register', {
      name,
      email,
      password
    });

    const { accessToken, user, success, errors } = response.data;
    if (success) {
      localStorage.setItem('accessToken', accessToken);
      dispatch({
        type: 'REGISTER',
        payload: {
          user
        }
      });
    } else {
      dispatch({
        type: 'ERROR',
        payload: {
          errors1: errors
        }
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'JWT',
        login,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthContext;
