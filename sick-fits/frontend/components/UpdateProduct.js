import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import useForm from '../lib/useForm';
import Form from './styles/Form';
import DisplayError from './ErrorMessage';

const UPDATE_PRODUCT_MUTATION = gql`
  mutation UPDATE_PRODUCT_MUTATION(
    $id: ID!
    $name: String!
    $price: Int!
    $description: String!
  ) {
    updateProduct(
      id: $id
      data: {
        name: $name
        description: $description
        price: $price
        status: "AVAILABLE"
      }
    ) {
      id
    }
  }
`;

const SINGLE_PRODUCT_QUERY = gql`
  query SINGLE_PRODUCT_QUERY($id: ID!) {
    Product(where: { id: $id }) {
      name
      description
      price
      photo {
        altText
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

export default function UpdateProductForm({ id }) {
  const { data, error, loading } = useQuery(SINGLE_PRODUCT_QUERY, {
    variables: { id },
  });

  const { inputs, handleChange } = useForm({
    name: data?.Product.name,
    price: data?.Product.price,
    description: data?.Product.description,
  });

  const [
    updateProduct,
    { error: updateError, loading: updateLoading },
  ] = useMutation(UPDATE_PRODUCT_MUTATION, {
    variables: { id, ...inputs },
  });

  if (loading) return <p>Loading...</p>;
  return (
    <Form
      onSubmit={async (event) => {
        event.preventDefault();
        await updateProduct();
      }}
    >
      <h1>{data?.Product?.name || ''}</h1>
      <DisplayError error={error} />
      <DisplayError error={updateError} />
      <fieldset disabled={updateLoading} aria-busy={updateLoading}>
        <img
          src={data.Product.photo.image.publicUrlTransformed}
          alt={data.Product.photo.altText}
          style={{ maxWidth: '40%', display: 'block' }}
        />
        <label htmlFor="name">
          Name
          <input
            type="text"
            id="name"
            name="name"
            value={inputs.name}
            onChange={handleChange}
            required
          />
        </label>
        <label htmlFor="price">
          Price
          <input
            type="number"
            id="price"
            name="price"
            value={inputs.price}
            onChange={handleChange}
            required
          />
        </label>
        <label htmlFor="description">
          Description
          <textarea
            id="description"
            name="description"
            value={inputs.description}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Update Product</button>
      </fieldset>
    </Form>
  );
}
