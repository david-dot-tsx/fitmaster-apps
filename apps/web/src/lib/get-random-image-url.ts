const getRandomId = () => Math.floor(Math.random() * 1024) + 1;

export const getRandomImageUrl = (): string => {
  return `https://picsum.photos/id/${getRandomId()}/1024/1024`;
};
