import React from 'react';
import { Fab } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { styled } from '@mui/material/styles';
import { useRouter } from "next/navigation";

const StyledFab = styled(Fab)({
  backgroundColor: '#7B1FA2', 
  color: '#FFFFFF', 
  borderRadius: '20px', 
  boxShadow: '0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12)',
  '&:hover': {
    backgroundColor: '#7E57C2' 
  },
  width: 280, 
  height: 56, 
  textTransform: 'uppercase', 
  fontSize: 16
});

const ButtonBonificacoesGeradas: React.FC = () => {
  const navigation = useRouter()

  return (
    <div >
      <StyledFab
        aria-label="Bonificações Geradas"
        onClick={() => navigation.push("BonificacoesGeradas")}
      >
        Bonificações Geradas <AddCircleIcon style={{ fontSize: '20', marginLeft: 8 }} />
      </StyledFab>
    </div>
  );
};

export default ButtonBonificacoesGeradas;
