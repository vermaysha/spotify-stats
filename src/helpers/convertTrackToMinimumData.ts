import { getImageData } from "./getImageData";

export interface IConvertedTrackObject {
  image: string;
  artist: string;
  name: string;
  href: string;
}

export async function convertTrackToMinimumData(track: SpotifyApi.TrackObjectFull | SpotifyApi.EpisodeObject): Promise<IConvertedTrackObject> {
  let albumArtUrl = 'https://raw.githubusercontent.com/andyruwruw/andyruwruw/master/src/assets/images/default-album-art.png';
  if ('album' in track
    && 'images' in track.album
    && track.album.images.length) {
    albumArtUrl = track.album.images[0].url;
  }
  const image = await getImageData(albumArtUrl) ?? '';

  let artist = 'Unknown Artist';
  if ('artists' in track && track.artists.length) {
    artist = track.artists.map((artist) => artist.name).join(', ');
  }

  let name = 'Unknown Track';
  if ('name' in track) {
    name = track.name;
  }

  let href = '#';
  if ('external_urls' in track && 'spotify' in track.external_urls) {
    href = track.external_urls.spotify;
  }

  return {
    image,
    artist,
    name,
    href,
  };
};
