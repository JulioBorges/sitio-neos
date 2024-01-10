import { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ConnectedTvIcon from "@mui/icons-material/ConnectedTv";
import "./App.css";
import { Box } from "@mui/material";
import { SocketServer } from "./socket-server";

function App() {
  const [serverIp, setServerIp] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("....");
  const [isConnected, setIsConnected] = useState(false);
  let socketServer;

  const handleClickConnect = () => {
    if (!!serverIp) {
      socketServer = new SocketServer(
        serverIp,
        () => {
          setIsConnected(true);
        },
        () => {
          setIsConnected(false);
        },
        (status) => {
          setStatus(status);
        }
      );

      !!socketServer && socketServer.connect();
    }
  };

  const handleClickDisconnect = () => {
    !!socketServer && socketServer.disconnect();
  };

  const handleClickSend = () => {
    !!message && !!socketServer && socketServer.sendMessage(message);
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
                <Input id='ip-input' type='ip' value={serverIp} onChange={(e) => setServerIp(e.target.value)} />
              </FormControl>
              <Button variant='contained' size='medium' endIcon={<ConnectedTvIcon />} onClick={handleClickConnect}>
                Conectar
              </Button>
            </Stack>
          )) || (
            <Stack sx={{ pt: 4 }} direction='column' spacing={2} justifyContent='center'>
              <FormControl sx={{ m: 1 }} variant='standard'>
                <InputLabel htmlFor='message-input'>Palavra:</InputLabel>
                <Input id='message-input' type='ip' value={message} onChange={(e) => setMessage(e.target.value)} />
              </FormControl>
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
