import React, { useState } from 'react';
import { MenuLateral } from './MenuLateral/MenuLateral';
import { navBarStyles } from '../../styles/navbar/navBarStyles';

const mergeStyles = (key, overrides) => ({
  ...navBarStyles[key],
  ...(overrides?.[key] || {}),
});

export const NavBar = ({
  title,
  onSearch,
  searchPlaceholder = 'Buscar',
  menuTitle = 'Menú lateral',
  renderMenuContent,
  styleOverrides,
}) => {
  const [query, setQuery] = useState('');

  const handleChange = (event) => {
    const value = event.target.value;
    setQuery(value);
    if (typeof onSearch === 'function') {
      onSearch(value);
    }
  };

  return (
    <header style={mergeStyles('wrapper', styleOverrides)}>
      <h1 style={mergeStyles('title', styleOverrides)}>{title}</h1>

      <div style={mergeStyles('searchWrapper', styleOverrides)}>
        <input
          type='search'
          placeholder={searchPlaceholder}
          value={query}
          onChange={handleChange}
          style={mergeStyles('searchInput', styleOverrides)}
        />

        <MenuLateral
          title={menuTitle}
          buttonStyle={styleOverrides?.menuButton}
          overlayStyle={styleOverrides?.menuOverlay}
          panelStyle={styleOverrides?.menuPanel}
          titleStyle={styleOverrides?.menuTitle}
        >
          {renderMenuContent}
        </MenuLateral>
      </div>
    </header>
  );
};

export default NavBar;

