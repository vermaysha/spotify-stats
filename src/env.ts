import { config } from 'dotenv'

config()


export class Env {
  static getBaseUrl(): string | undefined {
    return process.env.BASE_URL
  }
  static getSpotifyClientId(): string | undefined {
    return process.env.SPOTIFY_CLIENT_ID
  }

  static getSpotifyClienSecret(): string | undefined {
    return process.env.SPOTIFY_CLIENT_SECRET
  }

  static getSpotifyRefreshToken(): string | undefined {
    return process.env.SPOTIFY_REFRESH_TOKEN;
  }

  static checkEnv() {
    if (this.getSpotifyClienSecret() === undefined) {
      throw `The SPOTIFY_CLIENT_SECRET variable is not set`
    }

    if (this.getSpotifyClientId() === undefined) {
      throw `The SPOTIFY_CLIENT_ID variable is not set`
    }

    if (this.getBaseUrl() === undefined) {
      throw `The BASE_URL variable is not set`
    }
  }
}
