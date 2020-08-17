const generateMessage = (username: string, text: string) => ({
  username,
  text,
  createdAt: new Date().getTime(),
});

const generateLocationMessage = (username: string, url: string) => ({
  username,
  url,
  createdAt: new Date().getTime(),
});

export { generateMessage, generateLocationMessage };
