import React, { Fragment, useState } from 'react';
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
  isEdit: boolean;
  onClose: () => void;
}

export default function ModalCadCondicao({ open, isEdit, onClose }: Props) {
  const [titulo, setTitulo] = useState<string>('');
  const [imobiliarias, setImobiliarias] = useState<string[]>([]);
  const [tipo, setTipo] = useState<string>('');
  const [propostas, setPropostas] = useState<number>()
  const [valorReceber, setValorReceber] = useState<string>('')

  const handleChangeImobiliarias = (event: SelectChangeEvent<typeof imobiliarias[number][]>) => {
    const value = event.target.value;
    setImobiliarias(
      typeof value === 'string' ? [value] : value,
    );
  };

  const handleChangeTipo = (event: SelectChangeEvent) => {
    setTipo(event.target.value as string);
  };

  const handleSubmit = () => {
    alert("Envio dos dados para API");
    console.log({ titulo, imobiliarias, tipo });
    onClose();
  };

  const listImobiliarias = [
    { id: '1', titulo: 'Imobiliária 1' },
    { id: '2', titulo: 'Imobiliária 2' },
    { id: '3', titulo: 'Imobiliária 3' },
  ];

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
        <DialogTitle>{!isEdit ? "Cadastrar Nova Condição" : "Editar Condição"}</DialogTitle>
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
            InputLabelProps={{
              shrink: true,
            }}
            style={{ marginBottom: 8 }}
          />
          <FormControl fullWidth margin="dense" style={{ marginBottom: 8 }}>
            <InputLabel id="imobiliarias-label">Selecione a Imobiliária</InputLabel>
            <Select
              labelId="imobiliarias"
              id="imobiliaria"
              multiple
              value={imobiliarias}
              onChange={handleChangeImobiliarias}
              input={<OutlinedInput label="Selecione a Imobiliária" />}
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
                InputLabelProps={{
                  shrink: true,
                }}
                value={propostas}
                onChange={(e) => setPropostas(e.target.value ? parseInt(e.target.value, 10) : 0)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Valor a Receber"
                id="valor_a_receber"
                margin='dense'
                fullWidth
                InputLabelProps={{ shrink: true, }}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          {isEdit && <Button color='error'>Remover</Button>}
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
