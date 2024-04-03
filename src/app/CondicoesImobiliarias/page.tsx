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
  Skeleton,
  IconButton,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import ButtonCadCondicaoImob from "@/components/ButtonCadCondicaoImob";
import HeaderTable from "@/components/HeaderTable";
import ModalCadCondicao from "@/components/ModalCadBonificacao";
import styles from "./condicoesImobiliarias.module.css";
import ButtonBonificacoesGeradas from "@/components/ButtonBonificacoesGeradas";
import { useSearchParams } from 'next/navigation'

interface DadosTable {
  id: number;
  titulo: string;
  imobiliaria: string;
  data: string;
  comissao: string;
  empreendimento: string;
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

export default function CondicoesImobiliarias() {
  const [pesquisa, setPesquisa] = useState<string>("");
  const [pagina, setPagina] = useState<number>(0);
  const [linhasPorPagina, setLinhasPorPagina] = useState<number>(5);
  const [ordenacaoColuna, setOrdenacaoColuna] = useState<ColunaOrdenacao>("titulo");
  const [ordenacaoDirecao, setOrdenacaoDirecao] = useState<Ordem>("asc");
  const [openModalCadBonificacao, setOpenModalCadBonificacao] = useState<boolean>(false);
  const [refreshTable, setRefreshTable] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [dados, setDados] = useState<DadosTable[]>([]);

  const router = useSearchParams()
  const id_grupo = router.get('id')

  useEffect(() => {
    const fetchDados = async () => {
      setIsLoading(true)
      setDados([])
      try {
        const response = await axiosInstance.post('/bonificacao/getCondPorImobiliarias', {
            id_grupo: id_grupo 
        });
        const dadosTratados = response.data.data.map((item: any) => {
          const dataISO = new Date(item.data_inicial).toISOString().substring(0, 10);
          const [ano, mes, dia] = dataISO.split('-');
          const dataFormatada = [dia, mes, ano].join('/');

          return {
            id: item.id_condicao_imob,
            titulo: !item.titulo ? "Sem titulo informado" : item.titulo,
            imobiliaria: item.nome_imobiliaria,
            data: dataFormatada,
            comissao: !item.valor_bonificacao ? "" : "R$ " + item.valor_bonificacao,
            empreendimento: item.empreendimento,
            quant_propostas: item.qtd_propostas,
          };
        });

        setDados(dadosTratados);
        setIsLoading(false)
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchDados();
  }, [refreshTable]);

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

  // Função adcionada ao clicar no botão Adicionar condição
  const handleCadastrarCondicaoImob = () => {
    handleOpenModalCadBonificacao();
    //Logica para cadastrar bonificações, possivelmente a abertura do modal
  };

  // Função para abrir o modal
  const handleOpenModalCadBonificacao = () => {
    setOpenModalCadBonificacao(true)
  };

  // Função para fechar o modal
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
      axiosInstance.delete(`/bonificacao/deleteCondicaoImobiliarias`, { data: { id_condicao: id } })
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
        {/* <CardTitulo buttonGoBack={false}>Bonificação por Imobiliarias</CardTitulo> */}
        <Paper className={styles.table}>
          <HeaderTable title="Relação da Condição" subheader="Condições ativas até o momento" />
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
          <TableContainer style={{ height: "60vh", marginTop: 12 }}>
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
                  <TableCell key="empreendimento" className={styles.tableHeadCell}>
                    <TableSortLabel
                      active={ordenacaoColuna === "empreendimento"}
                      direction={ordenacaoColuna === "empreendimento" ? ordenacaoDirecao : "asc"}
                      onClick={() => handleSort("empreendimento")}
                    >
                      Empreendimento
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
                      Propostas
                    </TableSortLabel>
                  </TableCell>
                  <TableCell key="opcoes" className={styles.tableHeadCell}>
                    Opçoes
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dadosOrdenados.slice(pagina * linhasPorPagina, pagina * linhasPorPagina + linhasPorPagina).map((row, index) => (
                  <TableRow
                    key={index} className={styles.tableRowHover}>
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
            rowsPerPage={linhasPorPagina}
            page={pagina}
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
