import type { VercelRequest, VercelResponse } from '@vercel/node';
import SpotifyWebApi from 'spotify-web-api-node';
import { Env } from '../env'
import { convertToImageResponse } from '../helpers';
import { renderToString } from 'react-dom/server';
import { Auth } from '../views/General/Auth';

export async function auth(req: VercelRequest, res: VercelResponse) {
  try {
    Env.checkEnv()
  } catch (error) {
    return res.status(400).json(error)
  }

  if (Env.getSpotifyRefreshToken()) {
    return res.status(400).json({
      error: 'Your SPOTIFY_REFRESH TOKEN has been set'
    })
  }

  const spotifyAPI = new SpotifyWebApi({
    clientId: Env.getSpotifyClientId(),
    clientSecret: Env.getSpotifyClienSecret(),
    redirectUri: `${Env.getBaseUrl()}/api/auth`
  })

  const code = req.query.code ?? ''

  try {
    const spotify = await spotifyAPI.authorizationCodeGrant(code.toString())
    const { refresh_token: refreshToken } = spotify.body

    convertToImageResponse(res)

    const text: string = renderToString(Auth({
      refreshToken,
    })!);

    res.send(text)

  } catch (error: any) {
    console.log(error)
    res.status(400).json(
      error.body
    )
  }
};
