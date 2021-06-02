import { KeystoneContext } from '@keystone-next/types';
import { CartItemCreateInput } from '../.keystone/schema-types';
import { Session } from '../types';

export default async function addToCart(
  root: any,
  { productId }: { productId: string },
  context: KeystoneContext
): Promise<CartItemCreateInput> {
  const session = context.session as Session;
  if (!session.itemId) {
    throw new Error('You are not logged in!');
  }

  const currentCart: readonly CartItemCreateInput[] = await context.lists.CartItem.findMany(
    {
      where: { user: { id: session.itemId }, product: { id: productId } },
      resolveFields: 'id, quantity',
    }
  );

  // Existing item in cart, increment by 1
  const [existingCartItem] = currentCart;
  if (existingCartItem)
    return context.lists.CartItem.updateOne({
      id: existingCartItem.id,
      data: { quantity: existingCartItem.quantity + 1 },
    }) as Promise<CartItemCreateInput>;

  // New cart item, create
  return context.lists.CartItem.createOne({
    data: {
      quantity: 1,
      product: { connect: { id: productId } },
      user: { connect: { id: session.itemId } },
    },
  }) as Promise<CartItemCreateInput>;
}
