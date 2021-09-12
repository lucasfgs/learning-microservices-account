import { UserRepository } from '@application/repositories/UserRepository'
import { redisClient } from '@infra/cache/redis'
import { RedisAdapter } from '@main/adapters/cache/RedisAdapter'
import { jwtAdapterSingleton } from '@main/adapters/security/JwtAdapter'
import { Authenticate } from '@presentation/middlewares/auth/Authenticate'

export const authenticateMiddlewareFactory = () => {
  const jwtAdapter = jwtAdapterSingleton

  const userRepository = new UserRepository()

  const caching = new RedisAdapter(redisClient)

  const authenticate = new Authenticate(jwtAdapter, userRepository, caching)

  return {
    jwtAdapter,
    userRepository,
    authenticate
  }
}
