import Layout from "../components/Layout";
import Authenticate from "../components/Authenticate";
import {
  emailVerificationMutation,
  checkEmailVerificationCodeMutation,
} from "../api/mutations/VerificationMutation";

function VerifyEmailPage() {
  const emailVerification = emailVerificationMutation();
  const checkEmailVerification = checkEmailVerificationCodeMutation();

  // console.log(emailVerification.data?.data);
  // console.log(emailVerification.error?.response?.data);

  // console.log(checkEmailVerification.data?.data);
  // console.log(checkEmailVerification.error?.response?.data);

  return (
    <Authenticate redirectIfAuthenticated={false} unauthenticatedPath="/">
      <Layout>
        <h1>Verify Email</h1>
        <button
          className="p-2 bg-blue-500 rounded-md"
          onClick={() => {
            emailVerification.mutate();
          }}
        >
          send code
        </button>
        <br />
        <button
          className="p-2 bg-blue-500 rounded-md"
          onClick={() => {
            checkEmailVerification.mutate("3896");
          }}
        >
          check code
        </button>
      </Layout>
    </Authenticate>
  );
}

export default VerifyEmailPage;
