import { RedisClient } from 'redis'

import { Caching } from '@application/protocols/cache/Caching'

export class RedisAdapter implements Caching {
  constructor (
        private readonly client: RedisClient
  ) {}

  getData (key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.get(key, (error, data) => {
        error ? reject(error) : resolve(data)
      })
    })
  }

  setData (key: string, value: string, expirtationTimeInSeconds: number = 60 * 60 * 24): Promise<string> {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, 'EX', expirtationTimeInSeconds, (error, resp) => {
        error ? reject(error) : resolve(resp)
      })
    })
  }
}
