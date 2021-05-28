import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

const DELETE_PRODUCT_MUTATION = gql`
  mutation DELETE_PRODUCT_MUTATION($id: ID!) {
    deleteProduct(id: $id) {
      id
    }
  }
`;

export default function DeleteProduct({ id, children }) {
  const [deleteProduct, { loading }] = useMutation(DELETE_PRODUCT_MUTATION, {
    variables: { id },
  });

  const handleClick = () => {
    if (window.confirm('Are you sure you want to delete this item')) {
      deleteProduct().catch((err) => alert(err.message));
    }
  };

  return (
    <button type="button" disabled={Boolean(loading)} onClick={handleClick}>
      {children}
    </button>
  );
}
