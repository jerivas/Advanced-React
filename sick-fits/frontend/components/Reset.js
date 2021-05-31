import { gql, useMutation } from '@apollo/client';
import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';
import Form from './styles/Form';

const RESET_PASSWORD_MUTATION = gql`
  mutation RESET_PASSWORD_MUTATION(
    $email: String!
    $password: String!
    $token: String!
  ) {
    redeemUserPasswordResetToken(
      email: $email
      password: $password
      token: $token
    ) {
      message
    }
  }
`;

export default function Reset({ token }) {
  const { inputs, handleChange } = useForm({
    email: '',
    password: '',
    token,
  });

  const [resetPassword, { data, error, loading }] = useMutation(
    RESET_PASSWORD_MUTATION,
    {
      variables: inputs,
    }
  );

  if (data?.redeemUserPasswordResetToken === null)
    return <p>Success! You can now sign in with your new password</p>;

  return (
    <Form
      method="POST"
      onSubmit={async (event) => {
        event.preventDefault();
        await resetPassword().catch(console.error);
      }}
    >
      <h2>Reset your password</h2>
      <DisplayError error={error} />
      <DisplayError error={data?.redeemUserPasswordResetToken} />
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
        <label htmlFor="password">
          New Password
          <input
            type="password"
            id="password"
            name="password"
            required
            value={inputs.password}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Reset password</button>
      </fieldset>
    </Form>
  );
}
