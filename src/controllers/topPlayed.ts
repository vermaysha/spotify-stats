import type { VercelRequest, VercelResponse } from '@vercel/node';
import SpotifyWebApi from 'spotify-web-api-node';
import { Env } from '../env';
import { convertToImageResponse, convertTrackToMinimumData } from '../helpers';
import { renderToString } from 'react-dom/server';
import { IConvertedTrackObject } from '../helpers/convertTrackToMinimumData';
import { TopPlayed } from '../views/Spotify/TopPlayed';

export async function topPlayed(_req: VercelRequest, res: VercelResponse) {
  if (!Env.getSpotifyRefreshToken()) {
    return res.status(400).json({
      error: 'Your SPOTIFY_REFRESH TOKEN has not set'
    })
  }

  const spotifyAPI = new SpotifyWebApi({
    clientId: Env.getSpotifyClientId(),
    clientSecret: Env.getSpotifyClienSecret(),
    refreshToken: Env.getSpotifyRefreshToken()
  })

  try {

    const token = await spotifyAPI.refreshAccessToken()

    spotifyAPI.setAccessToken(token.body.access_token)

    const timeRanges: Array<'long_term' | 'medium_term' | 'short_term'> = ['long_term', 'medium_term', 'short_term']

    const topPlayedTracks: SpotifyApi.TrackObjectFull[][] = await Promise.all(timeRanges.map(async (timeRange) => {
      return (await spotifyAPI.getMyTopTracks({
        time_range: timeRange,
        limit: 5
      })).body.items
    }));

    const topPlayedConvertedTracks: IConvertedTrackObject[][] = await Promise.all(topPlayedTracks.map(async (tracks) => {
      return await Promise.all(tracks.map(async (track) => await convertTrackToMinimumData(track)))
    }));

    const text: string = renderToString(
      TopPlayed({ trackLists: topPlayedConvertedTracks })!
    );

    convertToImageResponse(res);

    return res.send(text)
  } catch (error: any) {
    return res.status(400).json({
      error: error.body
    })
  }
};
