"use client"
import React, { Fragment, useState, useEffect } from "react";
import axiosInstance from "../../services/axios";
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
  Skeleton,
  IconButton,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import ButtonCadCondicaoImob from "@/components/ButtonCadCondicaoImob";
import HeaderTable from "@/components/HeaderTable";
import ModalCadCondicao from "@/components/ModalCadBonificacao";
import styles from "./condicoes.module.css";
import ButtonBonificacoesGeradas from "@/components/ButtonBonificacoesGeradas";
import { useRouter } from "next/navigation";

interface DadosTable {
  id: number;
  titulo: string;
  empreendimento: string;
  quant_imobiliarias: string;
}
type DadosTabelaKey = keyof DadosTable;
type Ordem = "asc" | "desc";

interface OrdenacaoState {
  coluna: DadosTabelaKey | null;
  direcao: Ordem;
  linhasPorPaginas: number;
  pagina: number;
}

function ordenarArray(array: DadosTable[], coluna: DadosTabelaKey, direcao: Ordem): DadosTable[] {
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

export default function Condicoes() {
  const [pesquisa, setPesquisa] = useState<string>("");
  const [configTabela, setConfigTabela] = useState<OrdenacaoState>({ coluna: "titulo", direcao: "asc", linhasPorPaginas: 5, pagina: 0 });
  const [openModalCadBonificacao, setOpenModalCadBonificacao] = useState<boolean>(false);
  const [refreshTable, setRefreshTable] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dados, setDados] = useState<DadosTable[]>([]);

  const navigation = useRouter();

  useEffect(() => {
    fetchDados();
  }, [refreshTable]);

  const fetchDados = async () => {
    try {
      setIsLoading(true);
      setDados([]);
      const response = await axiosInstance.get('/bonificacao/getGruposImobiliarias');
      const dadosTratados = response.data.data.map((item: any) => ({
        id: item.id_grupo,
        titulo: !item.titulo ? "Sem titulo informado" : item.titulo,
        empreendimento: item.empreendimento,
        quant_imobiliarias: item.quantidade_imobiliarias,
      }));

      setDados(dadosTratados);
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  const handleSort = (coluna: keyof DadosTable) => {
    const isAsc = configTabela.coluna === coluna && configTabela.direcao === "asc";
    setConfigTabela({...configTabela, coluna, direcao: isAsc ? "desc" : "asc" });
  };

  const dadosFiltrados = dados.filter(item => item.titulo.toLowerCase().includes(pesquisa.toLowerCase()));
  const dadosOrdenados = configTabela.coluna ? ordenarArray(dadosFiltrados, configTabela.coluna, configTabela.direcao) : dadosFiltrados;

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, novaPagina: number): void => {
    setConfigTabela({...configTabela, pagina: novaPagina})
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setConfigTabela({...configTabela, linhasPorPaginas: parseInt(event.target.value, 10), pagina: 0})
  };

  const handleCadastrarCondicaoImob = () => {
    handleOpenModalCadBonificacao();
  };

  const handleOpenModalCadBonificacao = () => {
    setOpenModalCadBonificacao(true)
  };

  const handleCloseModalCadBonificacao = () => {
    setOpenModalCadBonificacao(false)
  };

  const onRefrehTable = () => {
    setRefreshTable(!refreshTable)
  }

  const handleRemoveItemTable = (id: number) => {    
    const confirmation = confirm("Deseja remover a condição?");

    if (confirmation) {
      setDados([])
      setIsLoading(true)
      axiosInstance.delete(`/bonificacao/deleteGrupoImobiliarias`, { data: { id_grupo: id } })
        .then(response => {
          onRefrehTable();
        })
        .catch(error => {
          console.error("Erro ao remover condição:", error);
          alert("Houve um erro ao tentar remover a condição.");
        });
    }
  }

  return (
    <Fragment>
      <div className={styles.container}>
        <Paper className={styles.table}>
          <HeaderTable title="Condição Bonificação" subheader="Clique sobre um item para visualizar as condições por imobiliarias" />
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
          </Grid>
          <TableContainer style={{ height: "60vh", marginTop: 12 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell key="id" style={{ display: 'none' }}>
                    <TableSortLabel
                      active={configTabela.coluna === "id"}
                      direction={configTabela.coluna === "id" ? configTabela.direcao : "asc"}
                      onClick={() => handleSort("id")}>
                      ID
                    </TableSortLabel>
                  </TableCell>
                  <TableCell key="titulo" className={styles.tableHeadCell}>
                    <TableSortLabel
                      active={configTabela.coluna === "titulo"}
                      direction={configTabela.coluna === "titulo" ? configTabela.direcao : "asc"}
                      onClick={() => handleSort("titulo")}>
                      Titulo
                    </TableSortLabel>
                  </TableCell>
                  <TableCell key="titulo" className={styles.tableHeadCell}>
                    <TableSortLabel
                      active={configTabela.coluna === "empreendimento"}
                      direction={configTabela.coluna === "empreendimento" ? configTabela.direcao : "asc"}
                      onClick={() => handleSort("empreendimento")}>
                      Empreendimento
                    </TableSortLabel>
                  </TableCell>
                  <TableCell key="quant_imobiliarias" className={styles.tableHeadCell}>
                    <TableSortLabel
                      active={configTabela.coluna === "quant_imobiliarias"}
                      direction={configTabela.coluna === "quant_imobiliarias" ? configTabela.direcao : "asc"}
                      onClick={() => handleSort("quant_imobiliarias")}>
                      Quantidade Imobiliarias
                    </TableSortLabel>
                  </TableCell>
                  <TableCell key="opcoes" className={styles.tableHeadCell}>
                    Opções
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dadosOrdenados.slice(configTabela.pagina * configTabela.linhasPorPaginas, configTabela.pagina * configTabela.linhasPorPaginas + configTabela.linhasPorPaginas).map((row, index) => (
                  <TableRow
                    key={index} 
                    className={styles.tableRowHover}>
                    <TableCell style={{ display: 'none' }}>{row.id}</TableCell>
                    <TableCell style={{cursor: "pointer"}} onClick={() => navigation.push(`/CondicoesImobiliarias?id=${row.id}`)}>{row.titulo}</TableCell>
                    <TableCell style={{cursor: "pointer"}} onClick={() => navigation.push(`/CondicoesImobiliarias?id=${row.id}`)}>{row.empreendimento}</TableCell>
                    <TableCell style={{cursor: "pointer"}} onClick={() => navigation.push(`/CondicoesImobiliarias?id=${row.id}`)}>{row.quant_imobiliarias}</TableCell>
                    <TableCell>
                      <IconButton aria-label="delete" size="small" onClick={() => { handleRemoveItemTable(row.id) }}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {isLoading && <>
                  <TableRow>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                  </TableRow><TableRow>
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
            rowsPerPage={configTabela.linhasPorPaginas}
            page={configTabela.pagina}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Linhas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </Paper>
        <div className={styles.buttonsFooter}>
          <ButtonCadCondicaoImob onClick={handleCadastrarCondicaoImob} />
          <ButtonBonificacoesGeradas />
        </div>
      </div>
      <ModalCadCondicao open={openModalCadBonificacao} onRefrehTable={onRefrehTable} onClose={handleCloseModalCadBonificacao} />
    </Fragment>
  );
}