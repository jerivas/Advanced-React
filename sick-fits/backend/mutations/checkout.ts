import { KeystoneContext } from '@keystone-next/types';
import {
  CartItemCreateInput,
  OrderCreateInput,
} from '../.keystone/schema-types';
import stripeConfig from '../lib/stripe';

// Fake gql for syntax highlighting
const graphql = String.raw;

export default async function checkout(
  root: any,
  { token }: { token: string },
  context: KeystoneContext
): Promise<OrderCreateInput> {
  const userId = context.session.itemId;
  if (!userId) {
  }

  const user = await context.lists.User.findOne({
    where: { id: userId },
    resolveFields: graphql`
      id
      name
      email
      cart {
        id
        quantity
        product {
          name
          price
          description
          photo {
            id
            altText
            image {
              publicUrlTransformed
            }
          }
        }
      }
    `,
  });
  const cartItems: CartItemCreateInput[] = user.cart.filter(
    (cartItem) => cartItem.product
  );

  const amount = cartItems.reduce(
    (total, cartItem) => total + cartItem.product.price * cartItem.quantity,
    0
  );
  const charge = await stripeConfig.paymentIntents.create({
    amount,
    currency: 'USD',
    confirm: true,
    payment_method: token,
  });

  const orderItems = cartItems.map((cartItem) => ({
    name: cartItem.product.name,
    description: cartItem.product.description,
    price: cartItem.product.price,
    quantity: cartItem.quantity,
    photo: { connect: { id: cartItem.product.photo.id } },
  }));
  const order: OrderCreateInput = await context.lists.Order.createOne({
    data: {
      total: charge.amount,
      charge: charge.id,
      items: { create: orderItems },
      user: { connect: { id: userId } },
    },
    resolveFields: graphql`id total charge items user`,
  });

  await context.lists.CartItem.deleteMany({
    ids: user.cart.map((item) => item.id),
  });
  return order;
}
