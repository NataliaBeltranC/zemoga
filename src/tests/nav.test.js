import React from 'react';
import { render } from '@testing-library/react';
import Nav from '../../src/components/nav/nav';

describe('Nav', () => {
    it('Should renders Nav with logo', () => {
        const { getByText } = render(<Nav />);
        expect(getByText("Rule of thumb.")).toBeDefined();
    })
})
