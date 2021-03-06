'use strict';

var React = require('react');

/*

interface PlacePickerProps{
    placeIDMap: Map(),
    placeId: int,
    sensorSim: int,
    currentPlaceId: int
    onChange: function()
}
interface PlacePickerState{
}

*/

var PlacePicker = React.createClass({
    displayName: 'PlacePicker',

    render: function() {
        // var self = this;
        var props = this.props;
        // var state = this.state;

        // console.log('PlacePicker props', props);
        // console.log('PlacePicker state', state);

        var listID = [];

        var lis = [];
        props.placeIDMap.forEach(function (value, key) {

            var objDb = [{
                'field': 'installed_at',
                'sim': props.sensorSim,
                'value': value
            }];
            
            lis.push(React.DOM.li({
                    key: key,
                    onClick: function(){
                        console.log('ID', value);
                        props.onChange(objDb);
                    }
                },
                key
            ));
        });
        listID = React.DOM.ul({}, lis);

        return React.DOM.div({className: 'place-picker selector'},
            listID
        );
    }
});

module.exports = PlacePicker;
