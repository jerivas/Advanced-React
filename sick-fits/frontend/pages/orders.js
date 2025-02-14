import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Head from 'next/head';
import styled from 'styled-components';
import Link from 'next/link';
import DisplayError from '../components/ErrorMessage';
import OrderItemStyles from '../components/styles/OrderItemStyles';
import formatMoney from '../lib/formatMoney';

const USER_ORDERS_QUERY = gql`
  query USER_ORDERS_QUERY {
    allOrders {
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

function countOrderItems(order) {
  return order.items.reduce((tally, item) => tally + item.quantity, 0);
}

const OrderUl = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  grid-gap: 4rem;
`;

export default function OrdersPage() {
  const { error, data, loading } = useQuery(USER_ORDERS_QUERY);
  if (loading) return <p>Loading...</p>;
  if (error) return <DisplayError error={error} />;

  const { allOrders } = data;
  return (
    <div>
      <Head>
        <title>Your Orders ({allOrders.length})</title>
      </Head>
      <h2>You have {allOrders.length} orders</h2>
      <OrderUl>
        {allOrders.map((order) => {
          const itemCount = countOrderItems(order);
          return (
            <OrderItemStyles key={order.id}>
              <Link href={`/order/${order.id}`}>
                <a>
                  <div className="order-meta">
                    <p>
                      {itemCount} Item
                      {itemCount === 1 ? '' : 's'}
                    </p>
                    <p>
                      {order.items.length} Product
                      {order.items.length === 1 ? '' : 's'}
                    </p>
                    <p>{formatMoney(order.total)}</p>
                  </div>
                  <div className="images">
                    {order.items.map((item) => (
                      <img
                        key={item.id}
                        src={item.photo.image.publicUrlTransformed}
                        alt={item.photo.altText}
                      />
                    ))}
                  </div>
                </a>
              </Link>
            </OrderItemStyles>
          );
        })}
      </OrderUl>
    </div>
  );
}
