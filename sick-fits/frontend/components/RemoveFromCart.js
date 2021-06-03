import { gql, useMutation } from '@apollo/client';
import styled from 'styled-components';

const evict = (cache, payload) =>
  cache.evict(cache.identify(payload.data.deleteCartItem));

const DELETE_CART_ITEM_MUTATION = gql`
  mutation DELETE_CART_ITEM_MUTATION($id: ID!) {
    deleteCartItem(id: $id) {
      id
    }
  }
`;

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: var(--red);
    cursor: pointer;
  }
`;

export default function RemoveFromCart({ id }) {
  const [deleteItem, { loading }] = useMutation(DELETE_CART_ITEM_MUTATION, {
    variables: { id },
    update: evict,
  });
  return (
    <BigButton
      type="button"
      title="Remove from cart"
      onClick={deleteItem}
      disabled={loading}
    >
      &times;
    </BigButton>
  );
}
