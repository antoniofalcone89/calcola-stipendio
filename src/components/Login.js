import { useState } from "react";
import { Box } from "./ui/layout";
import { Button } from "./ui/buttons";
import { Typography } from "./ui/data-display";
import { Paper } from "./ui/surfaces";
import { Google as GoogleIcon } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const { signInWithGoogle } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      setLoading(true);
      await signInWithGoogle();
    } catch (err) {
      setError(err.message || "Errore durante il login. Riprova.");
      setLoading(false);
    }
  };

  return (
    <Box
      className="login-container"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `
          linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1)),
          url('${process.env.PUBLIC_URL}/images/3.webp')
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        padding: "16px",
      }}
    >
      <Paper
        elevation="md"
        className="paper-container"
        style={{
          padding: "32px",
          maxWidth: "400px",
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderRadius: "12px",
        }}
      >
        <Box className="text-center mb-3">
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            className="text-primary font-bold"
            style={{ marginBottom: "8px" }}
          >
            Calcolatore Stipendio
          </Typography>
          <Typography
            variant="body1"
            className="text-secondary"
            style={{ marginBottom: "24px" }}
          >
            Accedi per continuare
          </Typography>
        </Box>

        {error && (
          <div
            className="alert alert-error"
            style={{
              marginBottom: "16px",
              padding: "12px",
              backgroundColor: "rgba(220, 53, 69, 0.1)",
              color: "#dc3545",
              borderRadius: "4px",
              border: "1px solid #dc3545",
            }}
          >
            {error}
          </div>
        )}

        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="button-google"
          style={{
            marginTop: "16px",
            padding: "12px 16px",
            background: "linear-gradient(135deg, #4285F4, #34A853)",
            color: "#fff",
            fontWeight: "600",
            textTransform: "none",
            fontSize: "1rem",
          }}
        >
          {loading ? (
            <>
              <div
                className="spinner"
                style={{ width: "16px", height: "16px", marginRight: "8px" }}
              />
              Accesso in corso...
            </>
          ) : (
            <>
              <GoogleIcon style={{ marginRight: "8px" }} />
              Accedi con Google
            </>
          )}
        </Button>

        <Typography
          variant="caption"
          display="block"
          className="text-secondary"
          style={{
            marginTop: "24px",
            textAlign: "center",
            fontSize: "0.75rem",
          }}
        >
          Utilizzando Google, accetti i termini di servizio
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
