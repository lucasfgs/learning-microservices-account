/* eslint-disable array-callback-return */
import { objectKeyExists } from '@application/helpers/objects/objectKeyExists'
import { Middleware } from '@application/protocols/middlewares/middleware'
import { MiddlewareRequestModel } from '@application/protocols/requests/Http'
import { Jwt } from '@application/protocols/security/Jwt'
import { IUserRepository } from '@domain/repositories/IUserRepository'
import { UnauthorizedError } from '@application/errors/UnauthorizedError'
import { formatUserPermissions } from '@application/helpers/arrays/formatUserPermissions'
import { Caching } from '@application/protocols/cache/Caching'
import { IUser } from '@domain/models/IUser'

export class Authenticate implements Middleware {
  constructor (
        private readonly jwtAdapter: Jwt,
        private readonly userRepository: IUserRepository,
        private readonly caching: Caching
  ) {}

  async handle (request: MiddlewareRequestModel, routePermission?: string, routeRoles?: string[]): Promise<void> {
    if (
      !objectKeyExists(request, 'headers') ||
      !objectKeyExists(request.headers, 'authorization')
    ) {
      throw new UnauthorizedError('Invalid request')
    }

    const { authorization } = request.headers

    const [, token] = authorization.split(/\s+/)

    const { id, role } = this.checkJwt(token)

    let user: IUser = null

    const userCachedPermissions = await this.caching.getData(`user-${id}`)

    console.log(userCachedPermissions)

    if (userCachedPermissions) {
      user = JSON.parse(userCachedPermissions) as IUser
    } else {
      user = await this.userRepository.findUserPermissionsById(id)
      await this.caching.setData(`user-${user.id}`, JSON.stringify(user))
    }

    const userPermissions = formatUserPermissions(user)

    if (!userPermissions.includes(routePermission)) { throw new UnauthorizedError('User has no permission') }

    if (routeRoles) {
      if (!routeRoles.includes(user.role.name)) { throw new UnauthorizedError('User has no permission') }
    }
    request.user = {
      id,
      role
    }
  }

  private checkJwt (token) {
    try {
      return this.jwtAdapter.verify(token)
    } catch (error) {
      throw new UnauthorizedError(error.message)
    }
  }
}
