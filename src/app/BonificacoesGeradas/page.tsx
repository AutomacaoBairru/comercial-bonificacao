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
import HeaderTable from "@/components/HeaderTable";

import styles from "./bonificacoesgeradas.module.css";

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

export default function BonificacoesGeradas() {
  const [pesquisa, setPesquisa] = useState<string>("");
  const [pagina, setPagina] = useState<number>(0);
  const [linhasPorPagina, setLinhasPorPagina] = useState<number>(5);
  const [ordenacaoColuna, setOrdenacaoColuna] = useState<ColunaOrdenacao>("titulo");
  const [ordenacaoDirecao, setOrdenacaoDirecao] = useState<Ordem>("asc");
  const [openModalCadBonificacao, setOpenModalCadBonificacao] = useState<boolean>(false);


  const dados: DadosTable[] = [
    { id: 1, titulo: "Bairru Imobiliária", imobiliaria: "Categoria 1", data: "02/02/2023", comissao: "R$1200", quant_propostas: 5 },
    { id: 2, titulo: "Imobiliaria 2", imobiliaria: "Categoria 2", data: "02/02/2023", comissao: "R$1200", quant_propostas: 5 },
    { id: 3, titulo: "Imob 3", imobiliaria: "Categoria 2", data: "02/02/2023", comissao: "R$1200", quant_propostas: 5 },
    { id: 4, titulo: "Bairru Empreeendimentos", imobiliaria: "Categoria 2", data: "02/02/2023", comissao: "R$1200", quant_propostas: 5 },
    // Adicione mais dados conforme necessário
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

  return (
    <Fragment>
      <div className={styles.container}>
        <CardTitulo>Bonificação por Imobiliarias</CardTitulo>
        <Paper className={styles.table}>
          <HeaderTable title="Bonificações Geradas" subheader="Relação de todas as bonificações geradas pelo sistema" />
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
              {/* Opção para adicionar elemento ao grid */}
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
        
      </div>
    </Fragment>
  );
}
