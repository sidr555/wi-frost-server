// Use Dispatcher to connect and handle WebSocket messages
module.exports = function() {
    let ws = null;
    let listeners = {};

    this.on = (event, listener) => {
        // console.log("add listener", event)
        listeners[event] = listener;
    };

    this.connect = (fn) => {
        if (typeof fn === "function") {
            this.connector = fn;
        }
        if (typeof this.connector === "function") {
            console.log("listeners", Object.keys(listeners))
            this.connector((socket) => {
                console.log("reinit WS routine")
                ws = socket;
                ws.on('open', () => {
                    console.log("WS connected");
                    this.handle("connect");
                });

                ws.on('close', () => {
                    console.log('WS closed');
                    delete ws;
                    this.handle("close");
                });

                ws.on('error', (err) => {
                    console.log('WS error', err);
                    //this.handle("connect", err);
                })

                ws.on('message', (msg) => {
                    // console.log("WS MSG: " + msg);
                    // TODO prevent JS injection!
                    let arr = JSON.parse(msg);
                    this.handle(arr[0], arr[1]);
                });
            });
        }
    }

    this.send = (event, obj) => {
        if (ws) {
            console.log("WS send", event, obj)
            ws.send(JSON.stringify([event, obj || ""]));
        } else {
            console.log("WS cannot send")
        }
    };

    this.handle = (event, data) => {
        if (typeof listeners[event] === "function") {
            return typeof data === "undefined" ? listeners[event]() : listeners[event](data);
        }
    }

}


