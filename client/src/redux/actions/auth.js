import axios from 'axios';
import jwtDecode from 'jwt-decode';

// URIs

import serverURI from '../../config/URI';

export const PASSWORD_MATCH_ERROR = 'PASSWORD_MATCH_ERROR';
export const PASSWORD_MATCH_SUCCESS = 'PASSWORD_MATCH_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE'; // TODO: make separate action types for registration
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'; // TODO: make separate action types for registration
export const EMPLOYEE_LOGIN_FAILURE = 'EMPLOYEE_LOGIN_FAILURE'; // TODO: make separate action types for registration
export const EMPLOYEE_LOGIN_SUCCESS = 'EMPLOYEE_LOGIN_SUCCESS'; // TODO: make separate action types for registration
// TODO: Make loading action type LOGGING_IN for login and loginEmployee actions

// Axios Defaults

axios.defaults.withCredentials = true;
axios.defaults.headers.common.Authorization = localStorage.getItem('jwt');

// Actions

export const login = ({ pin, pass }, push) => (dispatch) => {
  axios // TODO: Determine the name of this route
    .post(`${serverURI}/api/restaurants/login`, { pin, pass })
    .then((res) => {
      const { role } = jwtDecode(res.data.token);

      dispatch({ type: LOGIN_SUCCESS, jwt: res.data.token, role });

      localStorage.setItem('jwt', res.data.token);

      if (role.admin || role.manager) {
        push('/servers');
      } else {
        push('/tables');
      }
    })
    .catch((err) => {
      dispatch({ type: LOGIN_FAILURE, payload: err });
    });
};

export const register = ({ firstName, lastName, pass, confirmPass }, push) => (dispatch) => {
  if (pass !== confirmPass) {
    dispatch({ type: PASSWORD_MATCH_ERROR, payload: 'Passwords must match' });
    return;
  }
  dispatch({ type: PASSWORD_MATCH_SUCCESS });
  axios
    .post(`${serverURI}/api/employees/admin/register`, { name: `${firstName} ${lastName}`, pass })
    .then((res) => {
      // TODO: Test that this works -----------------------------------
      const { role } = jwtDecode(res.data.token);

      dispatch({ type: LOGIN_SUCCESS, jwt: res.data.token, role });

      localStorage.setItem('jwt', res.data.token);

      if (role.admin) {
        push('/restaurant/sign-up');
      } else {
        push('/404');
      }
      // TODO: --------------------------------------------------------
    })
    .catch((err) => {
      dispatch({ type: LOGIN_FAILURE, payload: err });
    });
};

export const loginEmployee = ({ pin, pass }, push) => (dispatch) => {
  // TODO: Change action types to be unique from register/login
  axios
    .post(`${serverURI}/api/employees/login`, { pin, pass })
    .then((res) => {
      const { role } = jwtDecode(res.data.token);

      dispatch({ type: LOGIN_SUCCESS, payload: { jwt: res.data.token, role } });

      localStorage.setItem('jwt', res.data.token);

      if (role.admin || role.manager) {
        push('/servers');
      } else {
        push('/tables');
      }
    })
    .catch((err) => {
      dispatch({ type: LOGIN_FAILURE, payload: err });
    });
};

export const addEmployee = ({ firstName, lastName, pass, confirmPass }) => (dispatch) => {
  if (pass !== confirmPass) {
    dispatch({ type: PASSWORD_MATCH_ERROR, payload: 'Passwords must match' });
    return;
  }
  dispatch({ type: PASSWORD_MATCH_SUCCESS });
  axios
    .post(`${serverURI}/api/employees/register`, { name: `${firstName} ${lastName}`, pass })
    .then((res) => {
      dispatch({ type: LOGIN_SUCCESS, payload: res.data });
    })
    .catch((err) => {
      dispatch({ type: LOGIN_FAILURE, payload: err });
    });
};