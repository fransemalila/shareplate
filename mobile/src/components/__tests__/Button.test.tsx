import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../Button';

describe('Button', () => {
  it('renders correctly with default props', () => {
    const { getByText } = render(<Button title="Press me" onPress={() => {}} />);
    const buttonElement = getByText('Press me');
    expect(buttonElement).toBeTruthy();
  });

  it('calls onPress handler when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<Button title="Press me" onPress={onPressMock} />);
    
    const buttonElement = getByText('Press me');
    fireEvent.press(buttonElement);
    
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('renders correctly when disabled', () => {
    const { getByText } = render(
      <Button title="Press me" onPress={() => {}} disabled={true} />
    );
    const buttonElement = getByText('Press me');
    expect(buttonElement.props.accessibilityState.disabled).toBe(true);
  });

  it('applies custom styles correctly', () => {
    const customStyle = { backgroundColor: 'red' };
    const { getByTestId } = render(
      <Button 
        title="Press me" 
        onPress={() => {}} 
        style={customStyle}
        testID="custom-button"
      />
    );
    
    const buttonElement = getByTestId('custom-button');
    expect(buttonElement.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining(customStyle)
      ])
    );
  });
}); 