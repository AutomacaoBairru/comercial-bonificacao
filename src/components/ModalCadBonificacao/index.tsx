import React, { Fragment, useState, useEffect } from 'react';
import axiosInstance from '../../services/axios';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Grid,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  SelectChangeEvent,
} from '@mui/material';


interface Props {
  open: boolean;
  onClose: () => void;
  onRefrehTable: () => void;
}

interface ListaImobiliarias {
  id: string;
  titulo: string;
}

export default function ModalCadCondicao({ open, onClose, onRefrehTable }: Props) {
  const [titulo, setTitulo] = useState<string>('');
  const [imobiliarias, setImobiliarias] = useState<string[]>([]);
  const [tipo, setTipo] = useState<string>('');
  const [propostas, setPropostas] = useState<string>()
  const [valorReceber, setValorReceber] = useState<string>('')
  const [listImobiliarias, setListImobiliarias] = useState<ListaImobiliarias[]>([])

  const [isLoading, setIsLoading] = useState<boolean>(true)

  const handleChangeImobiliarias = (event: SelectChangeEvent<typeof imobiliarias[number][]>) => {
    const value = event.target.value;
    setImobiliarias(
      typeof value === 'string' ? [value] : value,
    );
  };

  const handleChangeTipo = (event: SelectChangeEvent) => {
    setTipo(event.target.value as string);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      // Verifica se os valores necessários estão presentes
      if (!titulo || !propostas || !valorReceber || !imobiliarias) {
        alert('Preencha todos os campos.');
        return;
      }

      // Prepara o corpo da requisição
      const body = {
        titulo: titulo,
        id_imobiliaria: imobiliarias,
        quant_propostas: parseInt(propostas, 10), // Garante que propostas seja um número
        percentual: "0",
        valor_fixo: valorReceber
      };

      // Faz a requisição POST
      const response = await axiosInstance.post('/bonificacao/postCondicaoImobiliarias', body);
      if (response.data.status) {
        alert('Condição cadastrada com sucesso!');
        onRefrehTable() //Atualiza a tabela Lista de Condições no componente Pai
        onClose(); //Fecha o modal se tudo ocorrer bem

        //Limpa todos os campos após fechar a janela
        setTitulo('');
        setPropostas('');
        setValorReceber('')
        setTipo('')
        setImobiliarias([])
      }
      else {
        alert('Ocorreu um erro ao cadastrar a condição.');
      }

    } catch (error) {
      console.error('Erro ao cadastrar condição:', error);
      alert('Erro ao cadastrar condição. Tente novamente.');
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    const fetchDados = async () => {
      setIsLoading(true)
      try {
        const response = await axiosInstance.get('/bonificacao/getImobiliarias');
        const dadosTratados = response.data.data.map((item: any) => {

          return {
            id: item.id,
            titulo: item.nome
          };
        });

        setListImobiliarias(dadosTratados)

        setIsLoading(false)
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setIsLoading(false)
      }
    };

    fetchDados();
  }, []);


  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
          style: {
            width: '580px', // Define a largura fixa para o modal
          },
        }}>
        <DialogTitle>Cadastrar Nova Condição</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="titulo"
            label="Titulo"
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            fullWidth
            disabled={isLoading}
            InputLabelProps={{
              shrink: true,
            }}
            style={{ marginBottom: 8 }}
          />
          <FormControl fullWidth margin="dense" style={{ marginBottom: 8 }}>
            <InputLabel id="imobiliarias-label">{isLoading ? "Carregando..." : "Selecione a imobiliaria"}</InputLabel>
            <Select
              labelId="imobiliarias"
              id="imobiliaria"
              disabled={isLoading}
              multiple
              value={imobiliarias}
              onChange={handleChangeImobiliarias}
              input={<OutlinedInput label="Selecione a imobiliaria" />}
              renderValue={(selected) => (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) =>
                    listImobiliarias
                      .filter((imobiliaria) => imobiliaria.id === value)
                      .map((imobiliaria) => (
                        <Chip key={imobiliaria.id} label={imobiliaria.titulo} />
                      ))
                  )}
                </div>
              )}
            >
              {listImobiliarias.map((opcao) => (
                <MenuItem key={opcao.id} value={opcao.id}>
                  {opcao.titulo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense" style={{ marginBottom: 8 }} >
            <InputLabel id="tipo">Tipo de Bonificação</InputLabel>
            <Select
              labelId="tipo"
              id="tipo"
              value={tipo}
              disabled={isLoading}
              onChange={handleChangeTipo}
              input={<OutlinedInput label="Tipo de Bonificação" />}
            >
              <MenuItem value="propostas">
                Quantidade de Propostas
              </MenuItem>
              <MenuItem value="percentual" disabled>
                Percentual de Vendas
              </MenuItem>
            </Select>
          </FormControl>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Propóstas"
                id="propostas"
                type="number"
                margin='dense'
                fullWidth
                disabled={isLoading}
                InputLabelProps={{
                  shrink: true,
                }}
                value={propostas}
                onChange={(e) => { setPropostas(e.target.value) }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Valor a Receber"
                id="valor_a_receber"
                margin='dense'
                fullWidth
                disabled={isLoading}
                value={valorReceber}
                onChange={(e) => setValorReceber(e.target.value)}
                InputLabelProps={{ shrink: true, }}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>

          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
