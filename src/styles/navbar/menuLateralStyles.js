export const menuLateralStyles = {
  button: {
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
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  panel: {
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
  title: {
    fontSize: '16px',
    fontWeight: 500,
    marginBottom: '12px',
  },
};

export default menuLateralStyles;

