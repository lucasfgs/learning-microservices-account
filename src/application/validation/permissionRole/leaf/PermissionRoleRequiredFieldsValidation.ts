import { isBoolean } from '@application/helpers/boolean/isBoolean'
import { ICreatePermissionRole } from '@domain/models/IPermissionRole'
import { RequestValidationError } from '@application/errors/RequestValidationError'
import { ValidationComposite } from '@application/protocols/validation/ValidationComposite'
import { isString } from '@application/helpers/strings/isString'

export class PermissionRoleRequiredFieldsValidation extends ValidationComposite<ICreatePermissionRole> {
  validate (request: ICreatePermissionRole): void {
    const { create, delete: destroy, update, read, permission, role } = request

    const error = new RequestValidationError('Invalid request')

    if (!isBoolean(read)) { error.messages.push('Invalid field: read') }

    if (!isBoolean(create)) { error.messages.push('Invalid field: create') }

    if (!isBoolean(update)) { error.messages.push('Invalid field: update') }

    if (!isBoolean(destroy)) { error.messages.push('Invalid field: destroy') }

    if (!isString(permission)) { error.messages.push('Invalid field: permission') }

    if (!isString(role)) { error.messages.push('Invalid field: role') }

    if (error.messages.length > 1) { throw error }
  }
}
