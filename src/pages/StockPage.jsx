import React from 'react';
import { NavBar } from '../shared/NavBar';
import { ListadoStock } from '../components/Stock/ListadoStock';
import { stockPageStyles as layoutStyles } from '../styles/stock/stockPageStyles';

export const StockPage = () => {
  const handleSearch = () => {};

  return (
    <section style={layoutStyles.page}>
      <NavBar
        title="Stock"
        onSearch={handleSearch}
        menuTitle="Menú lateral"
        searchPlaceholder="Buscar en stock"
        renderMenuContent={() => (
          <p style={layoutStyles.listTitle}>Contenido menú lateral</p>
        )}
        styleOverrides={{
          wrapper: layoutStyles.headerRow,
          title: layoutStyles.headerTitle,
          searchWrapper: layoutStyles.searchWrapper,
          searchInput: layoutStyles.searchInput,
          menuButton: layoutStyles.menuIconButton,
          menuOverlay: layoutStyles.sideMenuOverlay,
          menuPanel: layoutStyles.sideMenuPanel,
          menuTitle: layoutStyles.listTitle,
        }}
      />

      <div style={layoutStyles.listsWrapper}>


        <ListadoStock
          title="Listado de stock"
          titleStyle={layoutStyles.listTitle}
          containerStyle={layoutStyles.listContainer}
        />
      </div>
    </section>
  );
};

export default StockPage;
