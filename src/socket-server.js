export class SocketServer {
  constructor(ip, onConnect, onDisconnect, onStatus) {
    this.ip = ip;
    this.onConnect = onConnect;
    this.onDisconnect = onDisconnect;
    this.onStatus = onStatus;
  }


}
