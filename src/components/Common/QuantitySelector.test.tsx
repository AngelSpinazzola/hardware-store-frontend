import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuantitySelector from './QuantitySelector';

describe('QuantitySelector', () => {
  // Test 1: Verificar que se renderiza correctamente
  it('renderiza con la cantidad inicial', () => {
    render(
      <QuantitySelector
        quantity={5}
        maxQuantity={10}
        onIncrement={() => {}}
        onDecrement={() => {}}
        onChange={() => {}}
      />
    );

    // Buscar el input y verificar que tiene el valor correcto
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveValue(5);
  });

  // Test 2: Verificar que el botón de incrementar funciona
  it('llama a onIncrement cuando se hace click en el botón +', async () => {
    const user = userEvent.setup();
    const handleIncrement = vi.fn(); // Mock function (función falsa para testear)

    render(
      <QuantitySelector
        quantity={5}
        maxQuantity={10}
        onIncrement={handleIncrement}
        onDecrement={() => {}}
        onChange={() => {}}
      />
    );

    // Buscar el botón de incrementar (el que tiene el ícono +)
    const incrementButton = screen.getByLabelText('Aumentar cantidad');

    // Hacer click
    await user.click(incrementButton);

    // Verificar que se llamó la función
    expect(handleIncrement).toHaveBeenCalledTimes(1);
  });

  // Test 3: Verificar que el botón de decrementar funciona
  it('llama a onDecrement cuando se hace click en el botón -', async () => {
    const user = userEvent.setup();
    const handleDecrement = vi.fn();

    render(
      <QuantitySelector
        quantity={5}
        maxQuantity={10}
        onIncrement={() => {}}
        onDecrement={handleDecrement}
        onChange={() => {}}
      />
    );

    const decrementButton = screen.getByLabelText('Disminuir cantidad');
    await user.click(decrementButton);

    expect(handleDecrement).toHaveBeenCalledTimes(1);
  });

  // Test 4: Verificar que los botones se deshabilitan correctamente
  it('deshabilita el botón - cuando quantity es 1', () => {
    render(
      <QuantitySelector
        quantity={1}
        maxQuantity={10}
        onIncrement={() => {}}
        onDecrement={() => {}}
        onChange={() => {}}
      />
    );

    const decrementButton = screen.getByLabelText('Disminuir cantidad');
    expect(decrementButton).toBeDisabled();
  });

  it('deshabilita el botón + cuando quantity alcanza maxQuantity', () => {
    render(
      <QuantitySelector
        quantity={10}
        maxQuantity={10}
        onIncrement={() => {}}
        onDecrement={() => {}}
        onChange={() => {}}
      />
    );

    const incrementButton = screen.getByLabelText('Aumentar cantidad');
    expect(incrementButton).toBeDisabled();
  });

  // Test 5: Verificar que se puede cambiar el tamaño
  it('aplica el tamaño correcto (sm vs md)', () => {
    render(
      <QuantitySelector
        quantity={5}
        maxQuantity={10}
        onIncrement={() => {}}
        onDecrement={() => {}}
        onChange={() => {}}
        size="sm"
      />
    );

    const input = screen.getByRole('spinbutton');
    // En tamaño small, el input tiene clase w-12
    expect(input).toHaveClass('w-12');
  });
});
