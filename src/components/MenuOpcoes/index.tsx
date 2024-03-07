import React from "react";
import { Menu, MenuItem } from "@mui/material";
import { useRouter } from "next/navigation";

interface Props {
    anchorEl: null | HTMLElement;
    onClose: () => void;
}

export default function MenuOpcoes({ anchorEl, onClose }: Props) {
    const router = useRouter(); // Hook para trabalhar com a navegação

    // Função para lidar com o clique em "Bonificações Geradas"
    const handleNavigateBonificacoesGeradas = () => {
        onClose(); // Fechar o menu
        router.push('/BonificacoesGeradas');
    };

    return (
        <Menu
            id="options-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={onClose}
        >
            <MenuItem onClick={onClose}>Adicionar Condição</MenuItem>
            {/* Use a função handleBonificacoesClick aqui */}
            <MenuItem onClick={handleNavigateBonificacoesGeradas}>Bonificações Geradas</MenuItem>
        </Menu>
    );
}