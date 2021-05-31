import { gql, useMutation } from '@apollo/client';
import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';
import Form from './styles/Form';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    sendUserPasswordResetLink(email: $email) {
      message
    }
  }
`;

export default function RequestReset() {
  const { inputs, handleChange } = useForm({
    email: '',
  });

  const [createUser, { data, error, loading }] = useMutation(
    REQUEST_RESET_MUTATION,
    {
      variables: inputs,
    }
  );

  if (data?.sendUserPasswordResetLink === null)
    return <p>Success! Check your email for a link</p>;

  return (
    <Form
      method="POST"
      onSubmit={async (event) => {
        event.preventDefault();
        await createUser().catch(console.error);
      }}
    >
      <DisplayError error={error} />
      <h2>Request password reset</h2>
      <fieldset disabled={loading} aria-busy={loading}>
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
        <button type="submit">Reset password</button>
      </fieldset>
    </Form>
  );
}
