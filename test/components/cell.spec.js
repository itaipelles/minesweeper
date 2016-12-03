import React from 'react';
import chai, { expect } from 'chai';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import Cell from '../../app/components/Game/Board/Cell/Cell';
import sinon from 'sinon';
import styles from '../../app/components/Game/Board/Cell/Cell.css';

chai.use(chaiEnzyme())

describe('<Cell />', () => {

    const defaultProps = {xRay: false, revealed: false, flagged: false, isMine: false, adjacentMines: 0, onClick: () => null};

    it('should display mines counter if revealed or xRay', () => {
        const props = {...defaultProps, revealed: true, adjacentMines: 3};
        const wrapper = mount(<Cell {...props} />);
        expect(wrapper.find("td")).to.have.text(3);

        const props2 = {...defaultProps, xRay: true, adjacentMines: 4};
        const wrapper2 = mount(<Cell {...props2} />);
        expect(wrapper2.find("td")).to.have.text(4);
    });

    it('should not display mines counter if is mine', () => {
        const props = {...defaultProps, revealed: true, adjacentMines: 3, isMine: true};
        const wrapper = mount(<Cell {...props} />);
        expect(wrapper.find("td")).to.have.text("");
    });

    it('should display flag if flagged', () => {
        const props = {...defaultProps, flagged: true};
        const wrapper = mount(<Cell {...props} />);
        expect(wrapper.find("td")).to.have.className(styles.flag);
    });

    it('should have revealed class if revealed', () => {
        const props = {...defaultProps, revealed: true};
        const wrapper = mount(<Cell {...props} />);
        expect(wrapper.find("td")).to.have.className(styles.revealed);
    });

    it('should display mine if revealed or xRay is on', () => {
        const props = {...defaultProps, isMine: true, revealed: true};
        const wrapper = mount(<Cell {...props} />);
        expect(wrapper.find("td")).to.have.className(styles.mine);

        const props2 = {...defaultProps, isMine: true, xRay: true};
        const wrapper2 = mount(<Cell {...props2} />);
        expect(wrapper2.find("td")).to.have.className(styles.mine);
    });

    it('should display xRay if xRay is on and cell is not revealed', () => {
        const props = {...defaultProps, xRay: true};
        const wrapper = mount(<Cell {...props} />);
        expect(wrapper.find("td")).to.have.className(styles.xRay);

        const props2 = {...defaultProps, xRay: true, revealed: true};
        const wrapper2 = mount(<Cell {...props2} />);
        expect(wrapper2.find("td")).to.not.have.className(styles.xRay);
    });

    it('should call onclick when clicked', () => {
        const onClick = sinon.spy();
        const props = {...defaultProps, onClick: onClick};
        const wrapper = mount(<Cell {...props} />);
        wrapper.find("td").simulate('click');
        expect(onClick).to.have.property('callCount', 1);
    });
});