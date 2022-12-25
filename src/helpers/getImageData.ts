import fetch from 'node-fetch';

export const getImageData = async (imageUrl: string) => {
  if (imageUrl) {
    const buff: ArrayBuffer = await (await fetch(imageUrl)).arrayBuffer();
    return `data:image/jpeg;base64,${Buffer.from(buff).toString('base64')}`;
  }
};
