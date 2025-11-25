import React, { useState } from 'react';
import { menuLateralStyles } from '../../../styles/navbar/menuLateralStyles';

const mergeStyles = (defaults, custom) => ({ ...defaults, ...(custom || {}) });

export const MenuLateral = ({
  title = 'Menú lateral',
  buttonAriaLabel = 'Abrir menú lateral',
  buttonContent = '☰',
  buttonStyle,
  overlayStyle,
  panelStyle,
  titleStyle,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  const triggerContent =
    typeof buttonContent === 'function'
      ? buttonContent({ isOpen, toggle })
      : buttonContent;

  const panelChildren =
    typeof children === 'function' ? children({ close }) : children;

  return (
    <>
      <button
        type='button'
        aria-label={buttonAriaLabel}
        style={mergeStyles(menuLateralStyles.button, buttonStyle)}
        onClick={toggle}
      >
        {triggerContent}
      </button>

      {isOpen && (
        <>
          <div
            role='presentation'
            style={mergeStyles(menuLateralStyles.overlay, overlayStyle)}
            onClick={close}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                close();
              }
            }}
          />
          <aside
            role='dialog'
            aria-modal='true'
            style={mergeStyles(menuLateralStyles.panel, panelStyle)}
          >
            {!!title && (
              <p style={mergeStyles(menuLateralStyles.title, titleStyle)}>{title}</p>
            )}
            {panelChildren}
          </aside>
        </>
      )}
    </>
  );
};

export default MenuLateral;

