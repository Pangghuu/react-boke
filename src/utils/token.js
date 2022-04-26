// 封装localStorage存取token

const TOKEN_KEY = "key-pc";

const getToken = () => {
  // localStorage.getItem();
  return window.localStorage.getItem(TOKEN_KEY)
};
const setToken = (token) => {
  // localStorage.setItem(TOKEN_KEY, token);
  return window.localStorage.setItem(TOKEN_KEY, token)
};
const clearToken = () => {
  // localStorage.removeItem(TOKEN_KEY);
  return window.localStorage.removeItem(TOKEN_KEY)
};

export { getToken, setToken, clearToken };
