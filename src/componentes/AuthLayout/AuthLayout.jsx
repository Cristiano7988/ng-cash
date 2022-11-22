import { Suspense } from "react";
import { useOutlet, Await } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import Alert from "@mui/material/Alert";
import { AuthProvider } from "../../hooks/useAuth";

const AuthLayout = () => {
  const outlet = useOutlet();

  return (
    <Suspense fallback={<LinearProgress />}>
      <Await
        errorElement={<Alert severity="error">Algo deu errado!</Alert>}
        children={(user) => (
          <AuthProvider userData={user}>{outlet}</AuthProvider>
        )}
      />
    </Suspense>
  );
};

export default AuthLayout;
