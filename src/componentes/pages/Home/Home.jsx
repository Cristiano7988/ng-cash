import { Typography } from "@mui/material";

const Home = () => {
  return (
    <section>
        <Typography
            variant="h4"
            component="h1"
            children="Home"
        />
        <Typography
            component="p"
            children="Somos o app financeiro da Nova Geração! Uma plataforma tecnológica com tudo o que é necessário para dar início à uma vida financeira responsável e controlada. Nosso propósito é fazer com que a GenZ se torne a geração mais independente com relação ao seu dinheiro, estando preparada para enfrentar todo e qualquer desafio que venha a aparecer!"
        />
    </section>
  )
};

export default Home;
