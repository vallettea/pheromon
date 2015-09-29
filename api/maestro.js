'use strict';

// maestro: mqtt client on the API side of Pheromon
var mqtt = require('mqtt');
var utils = require('./utils/maestro.js');
var debug = require('../tools/debug');
var database = require('../database');

var sim2sensor;

module.exports = function(authToken){    
    var self = this;

    var maestro = mqtt.connect('mqtt://broker:1883', {
        username: "maestro",
        password: authToken,
        clientId: "maestro"
    });

    maestro.on('connect', function () {

        utils.importSensors()
        .then(function(object){
            sim2sensor = object;

            maestro.subscribe('init/#');
            maestro.subscribe('status/#');
            maestro.subscribe('measurement/#');

            // wrapper of the mqtt.publish() function
            maestro.distribute = function(message){

                if (message.to.length === Object.keys(sim2sensor).length)
                    maestro.publish('all', message.command);
                else
                    message.to.forEach(function(sim){
                        maestro.publish(sim, message.command);
                    });
            };

            maestro.on("message", function(topic, message) {

                var subtopics = topic.split("/");

                var main = subtopics[0];
                var sim = subtopics[1];
                var type = subtopics[2];

                debug('Maestro received:', main, sim, type);

                // maybe add a function to check topics

                utils.checkSensor(sim, sim2sensor)
                .then(function(){
                    var sensor = sim2sensor[sim];

                    switch(main){
                        case "init":
                            var date = new Date();
                            var cmd = ['init', sensor.period, sensor.start_hour, sensor.stop_hour, date.toISOString()].join(" ");
                            maestro.publish(sim, cmd);
                            break;

                        case "status":
                            var delta = {};
                            delta[type + "_status"] = message;

                            database.Sensors.update({
                                id: sensor.id,
                                delta: delta
                            })
                            .then(function(updated) {
                                sim2sensor[sim] = updated;
                                // TODO: socket IO emitter
                                console.log(type + "status data updated for sensor" + "");
                            })
                            .catch(function(err) {
                                console.log('error : cannot store measurement in DB :', err)
                            });
                            break;

                        case "measurement":
                            var data = JSON.parse(message);

                            debug('Measurement to register', data);

                            database.Measurements.create({
                                sensor_sim: sim,
                                type: type,
                                value: data.signal_strength,
                                date: data.datetime 
                            })
                            .then(function() {
                                // socket IO emitter
                                console.log("wifi data updated");
                            })
                            .catch(function(err) {
                                console.log('error : cannot store measurement in DB :', err)
                            });                        
                            break; 
                    }
                })          
            });

            console.log("Maestro ready");
        });
    });
}