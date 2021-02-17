import * as Interface from "./Interface";
import * as Config from "./Config";
import { io } from "socket.io-client";

const socketIo: any = io(Config.setting.websocket.url);

export const sendMessage = (socketTag: string, command: object, time: number): number | null => {
    if (time > 0) {
        return setInterval(() => {
            socketIo.emit(socketTag, command);
        }, time);
    } else {
        socketIo.emit(socketTag, command);
    }

    return null;
};

export const readMessage = (socketTag: string, callback: Interface.Callback): void => {
    socketIo.on(socketTag, (data: any) => {
        callback(data);
    });
};

export const stopRead = (socketTag: string): void => {
    socketIo.off(socketTag);
};
