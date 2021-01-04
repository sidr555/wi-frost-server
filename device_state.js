const Db = require('./redis_client');

const defaultState = {
    start_time: null,
    task: "none",
    task_time: null,
    temperature: {
        moroz: null,
        body: null,
        compressor: null,
        unit: null,
        room: null
    }
}


let State = function (device) {
    this.id = device.id;
    this.device = device;
    // Db.client.set("state_" + this.id, JSON.stringify(defaultState));


    this.get = (next) => {
        Db.client.get("state_" + this.id, (err, value) => {
            console.log("DB state", value, err);
            if (typeof next === "function") {
                // next(defaultState);
                next(err ? defaultState : JSON.parse(value), err);
            }
        });
    }

    this.upTask = (task, next) => {
        this.get((state, err) => {
            let now = parseInt((new Date()).getTime() / 1000);
            console.log("upTask db state", state, req.query.task);
            if (state.task !== task) {
                state.task = task;
                state.task_time = now;
                switch (task) {
                    case "sleep":
                        // state.sleep_time = now;
                        break;
                    case "start":
                        state.start_time = now;
                        break;
                }

                Db.client.set("state_" + this.id, JSON.stringify(state), next);
                // if (typeof next === "function") {
                //     next(err);
                // }
            }
        });
    }

    this.upTemp = (temp, next) => {
        this.get((state, err) => {
            let now = parseInt((new Date()).getTime() / 1000);
            console.log("upTemp db state", state);

            state.temperature = temp;
            Db.client.set("state_" + this.id, JSON.stringify(state), next);
        });
    }


}



module.exports = State;


