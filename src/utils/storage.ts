import { User } from "../hooks/useUsers";
export const setToLS = (key: string, value: string) => {
  // window.localStorage.setItem(key, JSON.stringify(value));
  window.localStorage.setItem(key, value);
};

export const getFromLS = (key: string) => {
  const value = window.localStorage.getItem(key);

  if (value) {
    return value;
  }
};

export const setUserToLs = (user: User) => {
  setToLS("user", JSON.stringify(user));
}

export const getUserFromLs = () => {
  const user = getFromLS("user");
  if (user) {
    return JSON.parse(user);
  }
}
