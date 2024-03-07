"use client"
import React, { Fragment, useState, useEffect } from "react";
import axiosInstance from "../../services/axios"
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
  Skeleton
} from "@mui/material";
import CardTitulo from "@/components/CardTitulo/index.";
import HeaderTable from "@/components/HeaderTable";

import styles from "./bonificacoesgeradas.module.css";

interface DadosTable {
  id: number;
  ids_propostas: string;
  imobiliaria: string;
  data: string;
  valor_receber: string;
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
  const [ordenacaoColuna, setOrdenacaoColuna] = useState<ColunaOrdenacao>("imobiliaria");
  const [ordenacaoDirecao, setOrdenacaoDirecao] = useState<Ordem>("asc");
  const [isLoading, setIsLoading] = useState<boolean>(true) //Controla o estado da tabela enquanto ocorre o carregamento

  const [dados, setDados] = useState<DadosTable[]>([]); // Alterado para armazenar dados da API

  useEffect(() => {
    const fetchDados = async () => {
      setIsLoading(true)
      try {

        const response = await axiosInstance.get('/bonificacao/getBonificacao');

        const dadosTratados = response.data.data.map((item: any) => {
          const dataFormatada = new Date(item.data_criacao).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });

          return {
            id: item.id,
            ids_propostas: "Verificar",
            imobiliaria: item.nome_imobiliaria,
            data: dataFormatada,
            valor_receber: `R$ ${item.valor_bonificacao}`,
            quant_propostas: item.quant_propostas,
          };
        });

        setDados(dadosTratados);
        setIsLoading(false)
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchDados();
  }, []);

  const handleSort = (coluna: keyof DadosTable) => {
    const isAsc = ordenacaoColuna === coluna && ordenacaoDirecao === "asc";
    setOrdenacaoDirecao(isAsc ? "desc" : "asc");
    setOrdenacaoColuna(coluna);
  };

  const dadosFiltrados = dados.filter((item) => item.imobiliaria.toLowerCase().includes(pesquisa.toLowerCase()));
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
        <CardTitulo buttonGoBack={true}>Bonificação por Imobiliarias</CardTitulo>
        <Paper className={styles.table}>
          <HeaderTable title="Bonificações Geradas" subheader="Relação de todas as bonificações geradas pelo sistema" />
          <Grid container spacing={2} alignItems="flex-end" style={{ marginTop: 20, marginLeft: 10 }}>
            <Grid item xs>
              <TextField
                label="Pesquisar"
                style={{ width: 380 }}
                placeholder="Digite a Imobiliaria...."
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
                  <TableCell key="titulo" className={styles.tableHeadCell}>
                    <TableSortLabel
                      active={ordenacaoColuna === "ids_propostas"}
                      direction={ordenacaoColuna === "ids_propostas" ? ordenacaoDirecao : "asc"}
                      onClick={() => handleSort("ids_propostas")}
                    >
                      Ids Propostas
                    </TableSortLabel>
                  </TableCell>
                  <TableCell key="comissao" className={styles.tableHeadCell}>
                    <TableSortLabel
                      active={ordenacaoColuna === "valor_receber"}
                      direction={ordenacaoColuna === "valor_receber" ? ordenacaoDirecao : "asc"}
                      onClick={() => handleSort("valor_receber")}
                    >
                      Valor a Receber
                    </TableSortLabel>
                  </TableCell>

                  <TableCell key="quant_propostas" className={styles.tableHeadCell}>
                    <TableSortLabel
                      active={ordenacaoColuna === "quant_propostas"}
                      direction={ordenacaoColuna === "quant_propostas" ? ordenacaoDirecao : "asc"}
                      onClick={() => handleSort("quant_propostas")}
                    >
                      Quant. Propóstas
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dadosOrdenados.slice(pagina * linhasPorPagina, pagina * linhasPorPagina + linhasPorPagina).map((row, index) => (
                  <TableRow key={index} className={styles.tableRowHover}>
                    <TableCell style={{ display: 'none' }}>{row.id}</TableCell>
                    <TableCell>{row.imobiliaria}</TableCell>
                    <TableCell>{row.data}</TableCell>
                    <TableCell>{row.ids_propostas}</TableCell>
                    <TableCell>{row.valor_receber}</TableCell>
                    <TableCell>{row.quant_propostas}</TableCell>
                  </TableRow>
                ))}
                {/* Exibe duas linhas com  Skeleton Loading até a consulta ser finalizada*/}
                {isLoading && <>
                  <TableRow>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                  </TableRow><TableRow>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                  </TableRow> </>}
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
        botao voltar
      </div>
    </Fragment>
  );
}
