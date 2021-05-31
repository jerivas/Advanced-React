import { gql, useMutation } from '@apollo/client';
import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';
import Form from './styles/Form';

const CREATE_USER_MUTATION = gql`
  mutation CREATE_USER_MUTATION(
    $name: String!
    $email: String!
    $password: String!
  ) {
    createUser(data: { name: $name, email: $email, password: $password }) {
      id
    }
  }
`;

export default function SignUp() {
  const { inputs, handleChange } = useForm({
    email: '',
    name: '',
    password: '',
  });

  const [createUser, { data, error, loading }] = useMutation(
    CREATE_USER_MUTATION,
    {
      variables: inputs,
    }
  );

  if (data?.createUser)
    return <p>Successfully signed up! Go ahead and sign in</p>;

  return (
    <Form
      method="POST"
      onSubmit={async (event) => {
        event.preventDefault();
        await createUser().catch(console.error);
      }}
    >
      <DisplayError error={error} />
      <h2>Sign up for an account</h2>
      <fieldset disabled={loading} aria-busy={loading}>
        <label htmlFor="name">
          Name
          <input
            type="text"
            id="name"
            name="name"
            required
            value={inputs.name}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="email">
          Email
          <input
            type="email"
            id="email"
            name="email"
            required
            value={inputs.email}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="password">
          Password
          <input
            type="password"
            id="password"
            name="password"
            required
            value={inputs.password}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Sign Up</button>
      </fieldset>
    </Form>
  );
}
