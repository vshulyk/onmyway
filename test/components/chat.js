import expect from 'expect';
import React from 'react';
import { shallow, mount } from 'enzyme';
import connectedChat, { Chat } from '../../src/components/chat';

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

    const enzymeWrapper = shallow(<Chat {...props} />);

    
   
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
    describe('Chat', () => {
        it('should call componentWillReceiveProps on gps change', () => {
            const spy = expect.spyOn(Chat.prototype, "componentWillReceiveProps");
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