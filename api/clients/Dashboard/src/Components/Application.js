'use strict';

var React = require('react');

var Panel =  React.createFactory(require('./Panel.js'));
var MapComponent =  React.createFactory(require('./MapComponent.js'));

/*

interface MeasurementHistory{
    date: Date
    value: number
}

interface Place{
    name: string,
    id: placeId,
    lon: number,
    lat: number,
    max: number,
    latest: number,
    measurements : MeasurementHistory[]
}


interface ApplicationProps{
    mapBoxToken: string,
    mapId,
    mapCenter,
    placeMap: Map (placeId => Place),
    getPlaceMeasurements: (placeId) => Promise<MeasurementHistory[]>,
    updatingIDs: [int],
    day: string
}

interface ApplicationState{
    selectedPlaceMap: Map ( id => Place )
}
*/

module.exports = React.createClass({

    getInitialState: function(){
        return {};
    },
    
    componentWillReceiveProps: function(newProps){

        this.setState({
            selectedPlaceMap: newProps.selectedPlaceMap
        });
    },

    render: function() {
        var self = this;
        var props = this.props;
        var state = this.state;
        
        var panel = new Panel({
            placeMap: state.selectedPlaceMap,
            day: props.day
        });

        // build Map
        var map = new MapComponent({
            mapBoxToken: props.mapBoxToken,
            mapId: props.mapId,
            mapCenter: props.mapCenter,
            placeMap: props.placeMap,
            selectedPlaceMap: state.selectedPlaceMap,
            updatingIDs: props.updatingIDs,
            onPlaceSelected: function(place){
                if (place.measurements){
                    console.log('1');
                    if (state.selectedPlaceMap && state.selectedPlaceMap.has(place.id)){
                        state.selectedPlaceMap.delete(place.id);
                        console.log('2');
                        self.setState({
                            selectedPlaceMap: state.selectedPlaceMap
                        });
                    } else {
                        console.log('3');
                        state.selectedPlaceMap.set(place.id, place);

                        self.setState({
                            selectedPlaceMap: state.selectedPlaceMap
                        });
                    }
                }
                else{
                    console.log('6');
                    props.getPlaceMeasurements(place, ['wifi']); 
                }
            }
        });

        return React.DOM.div({id: 'app'},
            panel,
            map
        );

    }
});
