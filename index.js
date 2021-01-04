const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// const db = require("./redis_client");
// const fs = require("fs");

const Device = require("./device");

const app = express();

let id = "fr530@1";

var corsOptions = {
    // origin: "http://localhost:8081"
    origin: "http://localhost:3000"
};

app.use(cors(corsOptions));
// app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Wi-Frost application." });
});




app.get("/config", (req, res) => {
    console.log("get config", id);
    let device = new Device(id);
    device.getFullConfig((config, err) => {
        // console.log("index full config", id, config);
        if (err) {
            res.json({error: err});
        } else {
            res.json(config);
        }
    });
});

app.get("/state", (req, res) => {
    console.log("get state", id);
    let device = new Device(id);

    device.state.get((state, err) => {
        console.log("send state", id, state);
        if (err) {
            console.log("ERROR", err)
            res.json({error: err});
        } else {
            res.json(state);
        }
    });
});

app.get("/uptask/", (req, res) => {
    console.log("up task", req.query);

    let device = new Device(id);

    device.state.upTask(req.query.task, (err) => {
        if (err) {
            res.json({error: err});
        } else {
            res.json({});
        }
    });
});

app.get("/uptemp/", (req, res) => {
    console.log("up temp", req.query);

    let device = new Device(id);

    device.state.upTemp(req.query, (err) => {
        if (err) {
            res.json({error: err});
        } else {
            res.json({});
        }
    });
});

app.get("/sensors/", (req, res) => {
    console.log("get sensors", req.query);

    let device = new Device(id);

    device.getSensors((sensors, err) => {
        if (err) {
            res.json({error: err});
        } else {
            res.json(sensors);
        }
    });
});

app.post("/sensors/", (req, res) => {
    console.log("get sensors", req.body);

    let device = new Device(id);

    device.setSensors(req.body, (err) => {
        if (err) {
            res.json({error: err});
        } else {
            res.json({});
        }
    });
});

app.get("/limits/", (req, res) => {
    console.log("get limits", req.query);

    let device = new Device(id);

    device.getLimits((limits, err) => {
        if (err) {
            res.json({error: err});
        } else {
            res.json(limits);
        }
    });
});
app.post("/limits/", (req, res) => {
    console.log("get sensors", req.body);

    let device = new Device(id);

    device.setLimits(req.body, (err) => {
        if (err) {
            res.json({error: err});
        } else {
            res.json({});
        }
    });
});








// set port, listen for requests
const PORT = process.env.PORT || 8050;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);

    setTimeout(()=> {
    }, 1000)
});
