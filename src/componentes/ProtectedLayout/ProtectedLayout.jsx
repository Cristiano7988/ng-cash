import { useContext } from "react";
import { Link, Navigate, useOutlet } from "react-router-dom";
import { AuthContext, useAuth } from "../../hooks/useAuth";

const ProtectedLayout = () => {
  const { user } = useAuth();
  const { logout } = useContext(AuthContext);
  const outlet = useOutlet();

  if (!user) return <Navigate to="/" />;

  return (
    <div>
      <nav>
        <Link to="/dashboard/profile">Profile</Link>
        <Link onClick={() => logout()}>Logout</Link>
      </nav>
      {outlet}
    </div>
  );
};

export default ProtectedLayout;
