import expect from 'expect';
import React from 'react';
import { shallow, mount } from 'enzyme';
import connectedMap, { TrackingMap } from '../../src/components/map';

function setup() {
    const props = {
        changeCoords: expect.createSpy(),
        params: {
            teamId: 1
        },
        gps: {
            lat: 50,
            lng: 30
        },
        team: {},
        user: {}
    };

    const enzymeWrapper = shallow(<TrackingMap {...props} />);

    return {
        props,
        enzymeWrapper
    };
}

export default function() {
    describe('TrackingMap', () => {
        it('should render self and subcomponents', () => {
            const { enzymeWrapper } = setup();
            expect(enzymeWrapper.find('Map').length).toEqual(1);
            expect(enzymeWrapper.find('TileLayer').length).toEqual(1);
            expect(enzymeWrapper.find('Marker').length).toEqual(1);
            expect(enzymeWrapper.find('Connect(ChatService)').length).toEqual(1);
        });

        // it('should ask a name at start', () => {
        //     const { enzymeWrapper2 } = setup();
        //     expect(enzymeWrapper2.find('WhoAreYou').length).toEqual(1);
        // });
    });
}
