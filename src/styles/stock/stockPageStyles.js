export const stockPageStyles = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    padding: '24px',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  headerTitle: {
    fontSize: '24px',
    fontWeight: 600,
    marginRight: 'auto',
  },
  searchWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: '0 0 360px',
  },
  searchInput: {
    flex: 1,
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #d9d9d9',
    fontSize: '14px',
  },
  menuIconButton: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    border: '1px solid #d9d9d9',
    backgroundColor: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  sideMenuOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sideMenuPanel: {
    position: 'fixed',
    top: 0,
    right: 0,
    width: '280px',
    height: '100vh',
    backgroundColor: '#fff',
    borderLeft: '1px solid #d9d9d9',
    padding: '24px',
    boxShadow: '-4px 0 12px rgba(0,0,0,0.08)',
  },
  listsWrapper: {
    display: 'flex',
    gap: '24px',
    alignItems: 'stretch',
  },
  menuContainer: {
    width: '240px',
    minWidth: '200px',
    border: '1px solid #d9d9d9',
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: '#fff',
  },
  listContainer: {
    flex: 1,
    minHeight: '320px',
    border: '1px solid #d9d9d9',
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: '#fff',
  },
  listTitle: {
    fontSize: '16px',
    fontWeight: 500,
    marginBottom: '12px',
  },
};

export default stockPageStyles;

