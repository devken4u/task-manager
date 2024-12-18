import Layout from "../components/Layout";
import Authenticate from "../components/Authenticate";

function UserDashboard() {
  return (
    <Authenticate unauthenticatedPath="/" redirectIfAuthenticated={false}>
      <Layout>
        <div>UserDashboard</div>
      </Layout>
    </Authenticate>
  );
}

export default UserDashboard;
