import { gql, useMutation } from '@apollo/client';
import { CURRENT_USER_QUERY } from './User';

const SIGN_OUT_MUTATION = gql`
  mutation {
    endSession
  }
`;

export default function SignOut() {
  const [signOut, { loading }] = useMutation(SIGN_OUT_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  return (
    <button onClick={signOut} disabled={loading} type="button">
      Sign Out
    </button>
  );
}
