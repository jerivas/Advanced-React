import { ProductWhereInput } from './.keystone/schema-types';
import { permissionsList } from './schemas/fields';
import { ListAccessArgs } from './types';

export function isSignedIn({ session }: ListAccessArgs): boolean {
  return Boolean(session);
}

const generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    ({ session }: ListAccessArgs) => Boolean(session?.data.role?.[permission]),
  ])
);

// Yes/No permissions based on roles and session attributes
export const permissions = {
  ...generatedPermissions,
};

// Rules return a boolean or a filter function to limit object-level access
export const rules = {
  canManageProducts({ session }: ListAccessArgs): boolean | ProductWhereInput {
    if (permissions.canManageProducts({ session })) return true;
    return { user: { id: session.itemId } };
  },
  canReadProducts({ session }: ListAccessArgs): boolean | ProductWhereInput {
    if (permissions.canManageProducts({ session })) return true;
    return { status: 'AVAILABLE' };
  },
};
