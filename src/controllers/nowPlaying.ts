import type { VercelRequest, VercelResponse } from '@vercel/node';
import SpotifyWebApi from 'spotify-web-api-node';
import { Env } from '../env';
import { convertToImageResponse, convertTrackToMinimumData } from '../helpers';
import { renderToString } from 'react-dom/server';
import { NowPLaying } from '../views/Spotify/NowPlaying'

export async function nowPlaying(req: VercelRequest, res: VercelResponse) {
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

    const nowPlaying = (await spotifyAPI.getMyCurrentPlayingTrack()).body

    let { item } = nowPlaying

    const {
      is_playing: isPlaying = false,
      progress_ms: progress = 0,
    } = nowPlaying;

    // Get last played if it's not playing.
    if (!item) {
      const response = await spotifyAPI.getMyRecentlyPlayedTracks({
        limit: 1
      })
      item = response.body.items[0].track;
    }

    // If the link was clicked, reroute them to the href.
    if (req.query.open) {
      if (item && item.external_urls) {
        res.writeHead(302, {
          Location: item.external_urls.spotify,
        });
        return res.end();
      }
      return res.status(200).end();
    }

    // The music bars are colored based on the songs danceability, energy and happiness
    // And they move to the beat of the song :)
    let audioFeatures: SpotifyApi.AudioFeaturesResponse | null = null;

    if (Object.keys(item).length) {
      audioFeatures = (await spotifyAPI.getAudioFeaturesForTrack(item.id)).body
    }

    // Minimum data for the track.
    const track = await convertTrackToMinimumData(item);

    // Getting duration of the track.
    const {
      duration_ms: duration,
    } = item;

    // Hey! I'm returning an image!
    convertToImageResponse(res);

    // Generating the component and rendering it
    const text: string = renderToString(NowPLaying({
      audioFeatures,
      duration,
      isPlaying,
      progress,
      track,
    })!);

    return res.send(text)
  } catch (error: any) {
    return res.status(400).json({
      error: error.body
    })
  }

  res.send('')
}
