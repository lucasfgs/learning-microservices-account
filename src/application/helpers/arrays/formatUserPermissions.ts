import { IUser } from '@domain/models/IUser'

export function formatUserPermissions (user: IUser): string[] {
  const userPermissions = []

  user.role.permissionRoles.map(permissionRole => {
    permissionRole.create && userPermissions.push(`${permissionRole.permission.name}.create`)
    permissionRole.read && userPermissions.push(`${permissionRole.permission.name}.read`)
    permissionRole.update && userPermissions.push(`${permissionRole.permission.name}.update`)
    permissionRole.delete && userPermissions.push(`${permissionRole.permission.name}.delete`)
  })

  return userPermissions
}
