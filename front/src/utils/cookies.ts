export const setCookie = (cookieName: string, cookieValue: string): void => {
  document.cookie = `${cookieName}=${cookieValue}; Max-Age=63158400; path=/`;
};

export const getCookie = (cookieName: string): string | undefined => {
  const cookiesMap = document.cookie.split('=');
  const index = cookiesMap.findIndex((cookie) => cookie === cookieName);
  if (index === -1) return undefined;
  return cookiesMap[index + 1];
};
