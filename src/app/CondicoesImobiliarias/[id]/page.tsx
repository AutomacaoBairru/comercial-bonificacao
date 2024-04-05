"use client"
import React, { Fragment, useState, useEffect } from 'react';
import axiosInstance from '../../../services/axios';
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
  Skeleton,
  Grid,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ButtonCadCondicaoImob from '@/components/ButtonCadCondicaoImob';
import HeaderTable from '@/components/HeaderTable';
import ModalCadCondicao from '@/components/ModalCadBonificacao';
import styles from './condicoesImobiliarias.module.css';
import ButtonBonificacoesGeradas from '@/components/ButtonBonificacoesGeradas';

interface Props {
  params: {id: string}
}

interface DadosTable {
  id: number;
  titulo: string;
  imobiliaria: string;
  data: string;
  comissao: string;
  empreendimento: string;
  quant_propostas: number;
}
type DadosTabelaKey = keyof DadosTable;
type Ordem = 'asc' | 'desc';

interface OrdenacaoState {
  coluna: DadosTabelaKey | null;
  direcao: Ordem;
  linhasPorPaginas: number;
  pagina: number;
}

function ordenarArray(array: DadosTable[], coluna: DadosTabelaKey, direcao: Ordem): DadosTable[] {
  return array.sort((a, b) => {
    if (a[coluna] < b[coluna]) {
      return direcao === 'asc' ? -1 : 1;
    }
    if (a[coluna] > b[coluna]) {
      return direcao === 'asc' ? 1 : -1;
    }
    return 0;
  });
}

export default function CondicoesImobiliarias({params}: Props) {
  const [pesquisa, setPesquisa] = useState<string>('');
  const [configTabela, setConfigTabela] = useState<OrdenacaoState>({ coluna: 'titulo', direcao: 'asc', linhasPorPaginas: 5, pagina: 0 });
  const [openModalCadBonificacao, setOpenModalCadBonificacao] = useState<boolean>(false);
  const [refreshTable, setRefreshTable] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dados, setDados] = useState<DadosTable[]>([]);

  const id_grupo = params.id

  const fetchDados = async () => {
    setIsLoading(true);
    setDados([]);
    try {
      const response = await axiosInstance.post('/bonificacao/getCondPorImobiliarias', {
        id_grupo: id_grupo,
      });
      const dadosTratados = response.data.data.map((item: any) => {
        const dataISO = new Date(item.data_inicial).toISOString().substring(0, 10);
        const [ano, mes, dia] = dataISO.split('-');
        const dataFormatada = [dia, mes, ano].join('/');

        return {
          id: item.id_condicao_imob,
          titulo: item.titulo || 'Sem titulo informado',
          imobiliaria: item.nome_imobiliaria,
          data: dataFormatada,
          comissao: item.valor_bonificacao ? `R$ ${item.valor_bonificacao}` : '',
          empreendimento: item.empreendimento,
          quant_propostas: item.qtd_propostas,
        };
      });

      setDados(dadosTratados);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDados();
  }, [refreshTable]);

  const handleSort = (coluna: keyof DadosTable) => {
    const isAsc = configTabela.coluna === coluna && configTabela.direcao === 'asc';
    setConfigTabela({ ...configTabela, coluna, direcao: isAsc ? 'desc' : 'asc' });
  };

  const dadosFiltrados = dados.filter((item) => item.imobiliaria.toLowerCase().includes(pesquisa.toLowerCase()));
  const dadosOrdenados = configTabela.coluna ? ordenarArray(dadosFiltrados, configTabela.coluna, configTabela.direcao) : dadosFiltrados;

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, novaPagina: number): void => {
    setConfigTabela({ ...configTabela, pagina: novaPagina })
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setConfigTabela({ ...configTabela, linhasPorPaginas: parseInt(event.target.value, 10), pagina: 0 })
  };

  const handleCadastrarCondicaoImob = () => {
    handleOpenModalCadBonificacao();
  };

  const handleOpenModalCadBonificacao = () => {
    setOpenModalCadBonificacao(true);
  };

  const handleCloseModalCadBonificacao = () => {
    setOpenModalCadBonificacao(false);
  };

  const onRefreshTable = () => {
    setRefreshTable(!refreshTable);
  };

  const handleRemoveItemTable = (id: number) => {
    const confirmation = confirm('Deseja remover a condição?');
    if (confirmation) {
      setIsLoading(true);
      setDados([]);
      axiosInstance
        .delete(`/bonificacao/deleteCondicaoImobiliarias`, { data: { id_condicao: id } })
        .then(() => {
          onRefreshTable();
        })
        .catch((error) => {
          console.error('Erro ao remover condição:', error);
          alert('Houve um erro ao tentar remover a condição.');
        });
    }
  };

  const onRefrehTable = () => {
    setRefreshTable(!refreshTable)
  }

  return (
    <Fragment>
      <div className={styles.container}>
        <Paper className={styles.table}>
          <HeaderTable
            title="Relação da Condição"
            subheader="Condições ativas até o momento"
            buttonBack={true} />
          <Grid container spacing={2} alignItems="flex-end" style={{ marginTop: 20, marginLeft: 10 }}>
            <Grid item xs>
              <TextField
                label="Pesquisar Imobiliária"
                style={{ width: 380 }}
                placeholder="Digite o nome da imobiliária"
                InputLabelProps={{
                  shrink: true,
                }}
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
              />
            </Grid>
          </Grid>
          <TableContainer className={styles.tableContainer}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    key="id"
                    style={{ display: 'none' }}>
                    <TableSortLabel
                      active={configTabela.coluna === "id"}
                      direction={configTabela.coluna === "id" ? configTabela.direcao : "asc"}
                      onClick={() => handleSort("id")}
                    >
                      ID
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    key="imobiliaria"
                    className={styles.tableHeadCell}>
                    <TableSortLabel
                      active={configTabela.coluna === "imobiliaria"}
                      direction={configTabela.coluna === "imobiliaria" ? configTabela.direcao : "asc"}
                      onClick={() => handleSort("imobiliaria")}
                    >
                      Imobiliaria
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    key="empreendimento"
                    className={styles.tableHeadCell}>
                    <TableSortLabel
                      active={configTabela.coluna === "empreendimento"}
                      direction={configTabela.coluna === "empreendimento" ? configTabela.direcao : "asc"}
                      onClick={() => handleSort("empreendimento")}
                    >
                      Empreendimento
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    key="data"
                    className={styles.tableHeadCell}>
                    <TableSortLabel
                      active={configTabela.coluna === "data"}
                      direction={configTabela.coluna === "data" ? configTabela.direcao : "asc"}
                      onClick={() => handleSort("data")}
                    >
                      Data
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    key="comissao"
                    className={styles.tableHeadCell}>
                    <TableSortLabel
                      active={configTabela.coluna === "comissao"}
                      direction={configTabela.coluna === "comissao" ? configTabela.direcao : "asc"}
                      onClick={() => handleSort("comissao")}
                    >
                      Comissão
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    key="quant_propostas"
                    className={styles.tableHeadCell}>
                    <TableSortLabel
                      active={configTabela.coluna === "quant_propostas"}
                      direction={configTabela.coluna === "quant_propostas" ? configTabela.direcao : "asc"}
                      onClick={() => handleSort("quant_propostas")}
                    >
                      Propostas
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    key="opcoes"
                    className={styles.tableHeadCell}>
                    Opçoes
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dadosOrdenados.slice(configTabela.pagina * configTabela.linhasPorPaginas, configTabela.pagina * configTabela.linhasPorPaginas + configTabela.linhasPorPaginas).map((row, index) => (
                  <TableRow
                    key={index}
                    className={styles.tableRowHover}>
                    <TableCell style={{ display: 'none' }}>{row.id}</TableCell>
                    <TableCell>{row.imobiliaria}</TableCell>
                    <TableCell>{row.empreendimento}</TableCell>
                    <TableCell>{row.data}</TableCell>
                    <TableCell>{row.comissao}</TableCell>
                    <TableCell>{row.quant_propostas}</TableCell>
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
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                  </TableRow><TableRow>
                    <TableCell><Skeleton /></TableCell>
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
            rowsPerPage={configTabela.linhasPorPaginas}
            page={configTabela.pagina}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Linhas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </Paper>
        <div className={styles.buttonsFooter}>
          <ButtonCadCondicaoImob
            onClick={handleCadastrarCondicaoImob} />
          <ButtonBonificacoesGeradas />
        </div>
      </div>
      <ModalCadCondicao
        open={openModalCadBonificacao}
        onRefrehTable={onRefrehTable}
        onClose={handleCloseModalCadBonificacao} />
    </Fragment>
  );
}
