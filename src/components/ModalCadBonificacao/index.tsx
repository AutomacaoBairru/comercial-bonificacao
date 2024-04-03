"use client"
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
  OutlinedInput,
  SelectChangeEvent,
} from '@mui/material';
import { useRouter } from "next/navigation";

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
  const [empreendimento, setEmpreendimento] = useState<string>('');
  const [tipo, setTipo] = useState<string>('');
  const [propostas, setPropostas] = useState<string>();
  const [valorReceber, setValorReceber] = useState<string>('');
  const [listEmpreedimentos, setListEmpreendimentos] = useState<ListaImobiliarias[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const navigation = useRouter();

  const handleChangeImobiliarias = (event: SelectChangeEvent) => {
    setEmpreendimento(event.target.value as string);
  };

  const handleChangeTipo = (event: SelectChangeEvent) => {
    setTipo(event.target.value as string);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      if (!titulo || !propostas || !valorReceber || !empreendimento) {
        alert('Preencha todos os campos.');
        return;
      }

      const body = {
        titulo: titulo,
        id_empreendimento : empreendimento,
        quant_propostas: parseInt(propostas, 10),
        percentual: "0",
        valor_fixo: valorReceber
      };

      const response = await axiosInstance.post('/bonificacao/postCondicaoEmpreendimento', body);
      if (response.data.status) {
        alert('Condição cadastrada com sucesso!');
        onRefrehTable();
        onClose();
        setTitulo('');
        setPropostas('');
        setValorReceber('')
        setTipo('')
        setEmpreendimento('')

        return navigation.replace("/")
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
        const response = await axiosInstance.get('/bonificacao/getEmpreendimentos');
        const dadosTratados = response.data.data.map((item: any) => {
          return {
            id: item.id,
            titulo: item.name
          };
        });

        setListEmpreendimentos(dadosTratados)
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
            width: '580px',
          },
        }}
      >
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
            <InputLabel id="empreendimento-label">
              {isLoading ? "Carregando..." : "Selecione o Empreendimento"}
            </InputLabel>
            <Select
              labelId="empreendimento-label"
              id="empreendimento"
              disabled={isLoading}
              value={empreendimento}
              onChange={handleChangeImobiliarias}
              input={<OutlinedInput label="Selecione o Empreendimento" />}
            >
              {listEmpreedimentos.map((opcao) => (
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
                label="Propostas"
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
