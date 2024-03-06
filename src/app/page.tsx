"use client"
import React, { Fragment, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  TablePagination,
  TableSortLabel,
  Grid,
  Button,
} from "@mui/material";
import CardTitulo from "@/components/CardTitulo/index.";
import ButtonCadCondicaoImob from "@/components/ButtonCadCondicaoImob";
import HeaderTable from "@/components/HeaderTable";
import MenuOpcoes from "@/components/MenuOpcoes";
import ModalCadCondicao from "@/components/ModalCadBonificacao";

import styles from "./page.module.css";

interface DadosTable {
  id: number;
  titulo: string;
  imobiliaria: string;
  data: string;
  comissao: string;
  quant_propostas: number;
}

type Ordem = "asc" | "desc";
type ColunaOrdenacao = keyof DadosTable | null;

function ordenarArray(array: DadosTable[], coluna: keyof DadosTable, direcao: Ordem): DadosTable[] {
  return array.sort((a, b) => {
    if (a[coluna] < b[coluna]) {
      return direcao === "asc" ? -1 : 1;
    }
    if (a[coluna] > b[coluna]) {
      return direcao === "asc" ? 1 : -1;
    }
    return 0;
  });
}

export default function Home() {
  const [pesquisa, setPesquisa] = useState<string>("");
  const [pagina, setPagina] = useState<number>(0);
  const [linhasPorPagina, setLinhasPorPagina] = useState<number>(5);
  const [ordenacaoColuna, setOrdenacaoColuna] = useState<ColunaOrdenacao>("titulo");
  const [ordenacaoDirecao, setOrdenacaoDirecao] = useState<Ordem>("asc");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); //Controla a abertura e fechamento do menu de opções
  const [openModalCadBonificacao, setOpenModalCadBonificacao] = useState<boolean>(false);


  const dados: DadosTable[] = [
    { id: 1, titulo: "Titulo 1", imobiliaria: "Bairru Imobiliaria", data: "02/02/2023", comissao: "R$1200", quant_propostas: 2 },
    { id: 2, titulo: "Titulo 2", imobiliaria: "Empreendimentos Bairru", data: "02/02/2023", comissao: "R$1200", quant_propostas: 3 },
    { id: 3, titulo: "Titulo 3", imobiliaria: "Imob Teste 1", data: "02/02/2023", comissao: "R$1300", quant_propostas: 2 },
    { id: 4, titulo: "Titulo 4", imobiliaria: "Imob Teste 2", data: "02/02/2023", comissao: "R$2400", quant_propostas: 2 },
  ];

  const handleSort = (coluna: keyof DadosTable) => {
    const isAsc = ordenacaoColuna === coluna && ordenacaoDirecao === "asc";
    setOrdenacaoDirecao(isAsc ? "desc" : "asc");
    setOrdenacaoColuna(coluna);
  };

  const dadosFiltrados = dados.filter((item) => item.titulo.toLowerCase().includes(pesquisa.toLowerCase()));
  const dadosOrdenados = ordenacaoColuna ? ordenarArray(dadosFiltrados, ordenacaoColuna, ordenacaoDirecao) : dadosFiltrados;

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, novaPagina: number): void => {
    setPagina(novaPagina);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setLinhasPorPagina(parseInt(event.target.value, 10));
    setPagina(0);
  };

  // Função adcionada ao clicar no botão Adicionar condição
  const handleCadastrarCondicaoImob = () => {
    handleOpenModalCadBonificacao();
    //Logica para cadastrar bonificações, possivelmente a abertura do modal
  };

  // Função para abrir o modal
  const handleOpenModalCadBonificacao = () => setOpenModalCadBonificacao(true);

  // Função para fechar o modal
  const handleCloseModalCadBonificacao = () => setOpenModalCadBonificacao(false);


  //Função para abrir o menu de opções
  const handleOpenMenu: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    setAnchorEl(event.currentTarget);
  };

  //Função para fechar o menu de opções
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Fragment>
      <div className={styles.container}>
        <CardTitulo>Bonificação por Imobiliarias</CardTitulo>
        <Paper className={styles.table}>
          <HeaderTable title="Lista de Condições" subheader="Condições ativas até o momento" />
          <Grid container spacing={2} alignItems="flex-end" style={{ marginTop: 20, marginLeft: 10 }}>
            <Grid item xs>
              <TextField
                label="Pesquisar"
                style={{ width: 380 }}
                placeholder="Digite o titulo...."
                InputLabelProps={{
                  shrink: true,
                }}
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
              />
            </Grid>
            <Grid item>
              <Button variant="contained" size="large" onClick={handleOpenMenu} style={{ marginRight: 60, backgroundColor: "#7B1FA2" }}>Opções</Button>
              <MenuOpcoes anchorEl={anchorEl} onClose={handleCloseMenu} />
            </Grid>
          </Grid>
          <TableContainer style={{ height: "50vh", marginTop: 12 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell key="id" style={{ display: 'none' }}>
                    <TableSortLabel
                      active={ordenacaoColuna === "id"}
                      direction={ordenacaoColuna === "id" ? ordenacaoDirecao : "asc"}
                      onClick={() => handleSort("id")}
                    >
                      ID
                    </TableSortLabel>
                  </TableCell>
                  <TableCell key="titulo" className={styles.tableHeadCell}>
                    <TableSortLabel
                      active={ordenacaoColuna === "titulo"}
                      direction={ordenacaoColuna === "titulo" ? ordenacaoDirecao : "asc"}
                      onClick={() => handleSort("titulo")}
                    >
                      Titulo
                    </TableSortLabel>
                  </TableCell>
                  <TableCell key="imobiliaria" className={styles.tableHeadCell}>
                    <TableSortLabel
                      active={ordenacaoColuna === "imobiliaria"}
                      direction={ordenacaoColuna === "imobiliaria" ? ordenacaoDirecao : "asc"}
                      onClick={() => handleSort("imobiliaria")}
                    >
                      Imobiliaria
                    </TableSortLabel>
                  </TableCell>
                  <TableCell key="data" className={styles.tableHeadCell}>
                    <TableSortLabel
                      active={ordenacaoColuna === "data"}
                      direction={ordenacaoColuna === "data" ? ordenacaoDirecao : "asc"}
                      onClick={() => handleSort("data")}
                    >
                      Data
                    </TableSortLabel>
                  </TableCell>
                  <TableCell key="comissao" className={styles.tableHeadCell}>
                    <TableSortLabel
                      active={ordenacaoColuna === "comissao"}
                      direction={ordenacaoColuna === "comissao" ? ordenacaoDirecao : "asc"}
                      onClick={() => handleSort("comissao")}
                    >
                      Comissão
                    </TableSortLabel>
                  </TableCell>
                  <TableCell key="quant_propostas" className={styles.tableHeadCell}>
                    <TableSortLabel
                      active={ordenacaoColuna === "quant_propostas"}
                      direction={ordenacaoColuna === "quant_propostas" ? ordenacaoDirecao : "asc"}
                      onClick={() => handleSort("quant_propostas")}
                    >
                      Propóstas
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dadosOrdenados.slice(pagina * linhasPorPagina, pagina * linhasPorPagina + linhasPorPagina).map((row, index) => (
                  <TableRow key={index}>
                    <TableCell style={{ display: 'none' }}>{row.id}</TableCell>
                    <TableCell>{row.titulo}</TableCell>
                    <TableCell>{row.imobiliaria}</TableCell>
                    <TableCell>{row.data}</TableCell>
                    <TableCell>{row.comissao}</TableCell>
                    <TableCell>{row.quant_propostas}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={dadosFiltrados.length}
            rowsPerPage={linhasPorPagina}
            page={pagina}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Linhas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </Paper>
        <ButtonCadCondicaoImob onClick={handleCadastrarCondicaoImob} />
      </div>
      <ModalCadCondicao open={openModalCadBonificacao} onClose={handleCloseModalCadBonificacao} />
    </Fragment>
  );
}
