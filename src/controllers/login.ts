import type { VercelRequest, VercelResponse } from '@vercel/node';
import SpotifyWebApi from 'spotify-web-api-node';
import { Env } from '../env';

export function login(_req: VercelRequest, res: VercelResponse) {
  try {
    Env.checkEnv()
  } catch (error) {
    console.error(error)
    return res.status(400).json({error})
  }

  if (Env.getSpotifyRefreshToken()) {
    return res.status(400).json({
      error: 'Your SPOTIFY_REFRESH TOKEN has been set'
    })
  }

  const spotifyAPI = new SpotifyWebApi({
    clientId: Env.getSpotifyClientId(),
    clientSecret: Env.getSpotifyClienSecret(),
    redirectUri: 'http://localhost:3000/api/auth'
  })

  const scopes = [
    // Listening History
    'user-read-playback-position',
    'user-top-read',
    'user-read-recently-played',

    // Spotify Connect
    'user-read-currently-playing',
    'user-read-playback-state'
  ]

  const authorizeURL  = spotifyAPI.createAuthorizeURL(scopes, '')

  return res.redirect(authorizeURL)
};
