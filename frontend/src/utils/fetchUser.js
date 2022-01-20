export const fetchUser = () => {
  const localValue = localStorage.getItem("user");
  const userInfo =
    localValue !== "undefined" ? JSON.parse(localValue) : localStorage.clear();
  return userInfo;
};
