import expect from 'expect';
import React from 'react';
import { shallow, mount } from 'enzyme';
import { Menu } from '../../src/components/menu';

function setup() {
    const props = {
        authenticate: function() {},
        authenticated: false
    };

    const enzymeWrapper = shallow(<Menu {...props} />);

    return {
        props,
        enzymeWrapper
    };
}

export default function() {
    describe('Menu', () => {
        it('should render itself', () => {
            const { enzymeWrapper } = setup();
            expect(enzymeWrapper.find('#Menu').length).toEqual(1);
        });
    });
}
