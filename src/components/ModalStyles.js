const modalStyles = {
  formContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'rgba(255,255,255,0.5)',
    backgroundSize: '600% 600%',
    animation: 'gradientBackground 18s ease infinite',
    overflow:'hidden'
  },
  dialogBox: {
    padding: "16px",
    textAlign: 'center',
    height: '100vh',
    pb: 8,
    background:'linear-gradient(95deg, #1e272e, #233799, #333)',
    color: '#ffffff', // White font color for text contrast
  },
  dialogPaper:{
    background:'linear-gradient(135deg, #787dd1, #233799, #333)',
    color:'#FFF'
  },
  textField: {
    mt: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark background for text fields
    borderRadius: '4px',
    '& .MuiInputBase-input': {
      color: '#ffffff', // White text color for readability
    },
    '& .MuiInputLabel-root': {
      color: '#ffffff', // White label color
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#ffffff', // White border color for focus and hover states
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#ffffff',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#ffffff',
    },
    '& .MuiSvgIcon-root': {
      color: '#ffffff', // White icon color
    },
    '& .MuiInputLabel-root': {
      color: '#ffffff !important', // White label color
    },
  },
  buttonPrimary: {
    width: '100%',
    py: 2,
    fontSize: '1rem',
    backgroundColor: '#1a73e8',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#1765cc',
    }
  },
  buttonOutlined: {
    mb: 2,
    color: '#ffffff',
    borderColor: 'transparent',
    margin: "16px 0",
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)', // Hover effect for buttons
    },
  },
  fixedCloseButton: {
    position: 'fixed',
    color: '#FFF',
    bottom: 16,
    left: 0,
    right: 0,
    px: 3,
  },
};

export default modalStyles;
