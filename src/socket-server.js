export class SocketServer {
  constructor(ip, onConnect, onDisconnect, onStatus) {
    this.ip = ip;
    this.onConnect = onConnect;
    this.onDisconnect = onDisconnect;
    this.onStatus = onStatus;
  }

  connect() {
    const port = "15345";
    const server = "ws://" + ip + ":" + port;
    socket = new WebSocket(server);

    const sendStatus = (msg) => {
      console.log(msg);
      this.onStatus(msg);
    };

    socket.onopen = function (response) {
      sendStatus(`conectado no server: ${server}`);
      this.onConnect();
    };

    socket.onclose = function () {
      sendStatus(`desconectado do server: ${server}`);
      this.onDisconnect();
    };

    socket.onerror = (error) => {
      sendStatus(error);
      this.onDisconnect();
    };
  }

  disconnect() {
    if (!!socket) socket.close();
  }

  sendMessage(message) {
    if (!!socket) socket.send(`msg:${message}`);
  }
}
