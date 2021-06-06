import {
  OrderItemWhereInput,
  OrderWhereInput,
  ProductWhereInput,
  UserWhereInput,
} from './.keystone/schema-types';
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
    if (!isSignedIn({ session })) return false;
    if (permissions.canManageProducts({ session })) return true;
    return { user: { id: session.itemId } };
  },
  canReadProducts({ session }: ListAccessArgs): boolean | ProductWhereInput {
    if (!isSignedIn({ session })) return false;
    if (permissions.canManageProducts({ session })) return true;
    return { status: 'AVAILABLE' };
  },
  canOrder({ session }: ListAccessArgs): boolean | OrderWhereInput {
    if (!isSignedIn({ session })) return false;
    if (permissions.canManageCart({ session })) return true;
    return { user: { id: session.itemId } };
  },
  canManageOrderItems({
    session,
  }: ListAccessArgs): boolean | OrderItemWhereInput {
    if (!isSignedIn({ session })) return false;
    if (permissions.canManageCart({ session })) return true;
    return { order: { user: { id: session.itemId } } };
  },
  canManageUsers({ session }: ListAccessArgs): boolean | UserWhereInput {
    if (!isSignedIn({ session })) return false;
    if (permissions.canManageUsers({ session })) return true;
    return { id: session.itemId };
  },
};
