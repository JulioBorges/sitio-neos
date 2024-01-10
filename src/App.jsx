import ConnectedTvIcon from "@mui/icons-material/ConnectedTv";
import SendIcon from "@mui/icons-material/Send";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useRef, useState } from "react";
import "./App.css";

function App() {
  const [serverIp, setServerIp] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("....");
  const [time, setTime] = useState(15);
  const [isConnected, setIsConnected] = useState(false);
  const connection = useRef(null);
  
  const handleClickConnect = () => {
    if (!!serverIp) {
      setStatus(`conectando no servidor ${serverIp}:15345`);
      const ws = new WebSocket(`ws://${serverIp}:15345`);

      ws.onopen = (event) => {
        ws.send('opened');
        console.log('Websocket openned');
        setStatus(`conexão realizada com sucesso`);
        setIsConnected(true);
      };

      ws.onmessage = (message) => {
        setStatus(message);
      };

      ws.onclose = (event) => {
        console.log('WebSocket closed');
        setStatus(`conexão fechada com sucesso`);
        setIsConnected(false);
      }

      ws.onerror = (error) => {
        console.error(error);
        setStatus(`erro na conexão`);
        setIsConnected(false);
      }

      connection.current = ws;
    }
  };

  const handleClickDisconnect = () => {
    if (!!serverIp) {
      if (!!connection.current) {
        connection.current.close();
      }
    }
  };

  const handleClickSend = () => {
    if (!!connection.current) {
      if (!!message) {
        connection.current.send(`msg:${message}:${time}`);
        setMessage('');
      }
    }
  };

  return (
    <>
      <main>
        <Container maxWidth='lg'>
          <Typography component='h1' variant='h2' align='center' color='text.primary' gutterBottom>
            Sítio NEOS
          </Typography>

          <Typography variant='h5' align='center' color='text.secondary' paragraph>
            Esta app visa interagir com a tela da mensagem que está sendo transmitida. Conecte-se ao servidor e depois
            envie palavras para exibir na tela da transmissão.
          </Typography>

          <Box>
            <Typography>
              Status do servidor:{" "}
              {(isConnected && <span className='isConnected'>Conectado</span>) || (
                <span className='disconnected'>Desconectado</span>
              )}
            </Typography>
            <Typography sx={{ fontSize: "small" }}>{status}</Typography>
          </Box>

          {(!isConnected && (
            <Stack sx={{ pt: 4 }} direction='column' spacing={2} justifyContent='center'>
              <FormControl sx={{ m: 1 }} variant='standard'>
                <InputLabel htmlFor='ip-input'>IP do servidor:</InputLabel>
                <Input id='ip-input' type='text' value={serverIp} onChange={(e) => setServerIp(e.target.value)} />
              </FormControl>
              <Button variant='contained' size='medium' endIcon={<ConnectedTvIcon />} onClick={handleClickConnect}>
                Conectar
              </Button>
            </Stack>
          )) || (
            <Stack sx={{ pt: 4 }} direction='column' spacing={2} justifyContent='center'>
              <Stack sx={{ pt: 4 }} direction='column' spacing={2} justifyContent='center'>
                <FormControl sx={{ m: 1 }} variant='standard'>
                  <InputLabel htmlFor='message-input'>Palavra:</InputLabel>
                  <Input id='message-input' type='text' value={message} onChange={(e) => setMessage(e.target.value)} />
                </FormControl>
                <FormControl sx={{ m: 1 }} variant='standard'>
                  <InputLabel htmlFor='time-input'>Tempo (s):</InputLabel>
                  <Input id='time-input' type='number' value={time} onChange={(e) => setTime(e.target.value)} />
                </FormControl>
              </Stack>
              
              <Stack direction='row' spacing={2} justifyContent={"center"}>
                <Button
                  variant='contained'
                  color='error'
                  size='medium'
                  endIcon={<SendIcon />}
                  onClick={handleClickDisconnect}
                >
                  Desconectar
                </Button>
                <Button
                  variant='contained'
                  color='success'
                  size='medium'
                  endIcon={<SendIcon />}
                  onClick={handleClickSend}
                >
                  Enviar Palavra
                </Button>
              </Stack>
            </Stack>
          )}
        </Container>
      </main>
    </>
  );
}

export default App;
