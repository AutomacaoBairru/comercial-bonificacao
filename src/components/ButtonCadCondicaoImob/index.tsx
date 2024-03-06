import React from 'react';
import { Fab } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { styled } from '@mui/material/styles';

interface ButtonCadCondicaoImobProps {
  onClick: () => void; // Adicione mais props conforme necessário
}

const StyledFab = styled(Fab)({
  backgroundColor: '#7B1FA2', // Fundo roxo
  color: '#FFFFFF', // Texto branco
  borderRadius: '20px', // Bordas mais arredondadas
  boxShadow: '0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12)', // Sombra suave
  '&:hover': {
    backgroundColor: '#7E57C2' // Um roxo um pouco mais claro no hover
  },
  width: 180, // Largura ajustada conforme a imagem
  height: 56, // Altura ajustada conforme a imagem
  textTransform: 'uppercase', // Evita que o texto fique em maiúsculas
  fontSize: 16
});

const ButtonCadCondicaoImob: React.FC<ButtonCadCondicaoImobProps> = ({ onClick }) => {
  return (
    <div style={{display: "flex", justifyContent:"end", marginTop: 12}}>
      <StyledFab
        aria-label="adicionar condições"
        onClick={onClick}
      >
        Condições <AddCircleIcon style={{ fontSize: '20', marginLeft: 8 }} />
      </StyledFab>
    </div>
  );
};

export default ButtonCadCondicaoImob;
