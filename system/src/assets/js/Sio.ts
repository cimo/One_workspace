import { io } from "socket.io-client";

import * as Config from "./Config";
import * as Interface from "./Interface";

const socketIo: any = io(Config.data.websocket.url);

export const sendMessage = (tag: string, command: object, time: number = 0): number | null => {
    if (time > 0) {
        return setInterval(() => {
            socketIo.emit(tag, command);
        }, time);
    } else {
        socketIo.emit(tag, command);
    }

    return null;
};

export const readMessage = (tag: string, callback: Interface.CallbackSocket): void => {
    socketIo.on(tag, (data: Interface.Socket) => {
        callback(data);
    });
};

export const stopRead = (tag: string): void => {
    socketIo.off(tag);
};
