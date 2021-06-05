import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import Head from 'next/head';
import DisplayError from '../../components/ErrorMessage';
import OrderStyles from '../../components/styles/OrderStyles';
import formatMoney from '../../lib/formatMoney';

const ORDER_QUERY = gql`
  query ORDER_QUERY($id: ID!) {
    Order(where: { id: $id }) {
      id
      total
      charge
      items {
        id
        name
        description
        quantity
        price
        photo {
          altText
          image {
            publicUrlTransformed
          }
        }
      }
    }
  }
`;

export default function OrderPage() {
  const router = useRouter();
  const { error, data, loading } = useQuery(ORDER_QUERY, {
    variables: { id: router.query.id },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <DisplayError error={error} />;

  const { Order } = data;
  return (
    <OrderStyles>
      <Head>
        <title>Sick Fits - Order Details</title>
      </Head>
      <p>
        <span>Order ID:</span>
        <span>{Order.id}</span>
      </p>
      <p>
        <span>Order Total:</span>
        <span>{formatMoney(Order.total)}</span>
      </p>
      <p>
        <span>Order Items:</span>
        <span>{Order.items.length}</span>
      </p>
      <div className="items">
        {Order.items.map((item) => (
          <div className="order-item" key={item.id}>
            <img
              src={item.photo.image.publicUrlTransformed}
              alt={item.photo.altText}
            />
            <div className="item-details">
              <h2>{item.name}</h2>
              <p>Qty: {item.quantity}</p>
              <p>Each: {formatMoney(item.price)}</p>
              <p>Sub Total: {formatMoney(item.price * item.quantity)}</p>
              <p>{item.description} </p>
            </div>
          </div>
        ))}
      </div>
    </OrderStyles>
  );
}
