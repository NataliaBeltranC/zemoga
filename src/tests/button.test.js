import React from 'react';
import { render } from '@testing-library/react';
import Button from '../../src/components/button/button';

describe('Button', () => {
    it('Should renders Button with text', () => {
        const component = render(<Button modifier="dark" text="test" vote={jest.fn()} disabled={true} />);
        expect(component.getByText("test")).toBeDefined();
    })
})
