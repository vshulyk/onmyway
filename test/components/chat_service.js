import expect from 'expect';
import React from 'react';
import { shallow, mount } from 'enzyme';
import connectedChat, { ChatService } from '../../src/components/chat_service';

function setup() {
    const props = {
        changeTeamCoords: expect.createSpy(),
        params: {
            teamId: 1
        },
        gps: {
            lat: 50,
            lng: 30
        },
        team: {}
    };

    const enzymeWrapper = shallow(<ChatService {...props} />);



    enzymeWrapper.socket = {
        emit: function(){console.log('called')}
    }

    // enzymeWrapper.update()

    return {
        props,
        enzymeWrapper
    };
}

export default function() {
    describe('ChatService', () => {
        it('should call componentWillReceiveProps on gps change', () => {
            const spy = expect.spyOn(ChatService.prototype, "componentWillReceiveProps");
            const { enzymeWrapper } = setup();
            enzymeWrapper.setProps({
                gps : {
                    lat: 55,
                    lng: 31
                }
            });
            expect(spy).toHaveBeenCalled();
        });
        // it('should call this.socket.emit on gps change', () => {
        //     const { enzymeWrapper } = setup();
        //     const spy = expect.spyOn(enzymeWrapper.socket, "emit");
        //     // enzymeWrapper.update()
        //     enzymeWrapper.setProps({
        //         gps : {
        //             lat: 52,
        //             lng: 32
        //         }
        //     });
        //     console.log(enzymeWrapper.prop())
        //     expect(spy).toHaveBeenCalled();
        // });
    });
}
