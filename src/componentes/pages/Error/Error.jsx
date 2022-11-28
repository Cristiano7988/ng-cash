import { ThemeContext } from "@emotion/react";
import { Button, Typography } from "@mui/material";
import { useContext } from "react";
import { useNavigate } from "react-router";

const Error = () => {
    const { palette } = useContext(ThemeContext);
    const navigate = useNavigate();

    return <section>
        <Typography
            variant="h4"
            component="h1"
            children="Página não encontrada"
        />
        <Button
            children="Home"
            onClick={() => navigate("/")}
            style={{
                background: palette.background.default,
                color: palette.text.primary,
                marginRight: 6
            }}
        />
        <Button
            children="Voltar"
            onClick={() => navigate(-1)}
            style={{
                background: palette.background.default,
                color: palette.text.primary
            }}
        />
    </section>
}

export default Error;
