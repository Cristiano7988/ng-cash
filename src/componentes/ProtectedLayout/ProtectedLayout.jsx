import { Link, Navigate, useOutlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ProtectedLayout = () => {
  const { user } = useAuth();
  const outlet = useOutlet();

  if (!user) return <Navigate to="/" />;

  return (
    <div>
      <nav>
        <Link to="/dashboard/profile">Profile</Link>
      </nav>
      {outlet}
    </div>
  );
};

export default ProtectedLayout;
