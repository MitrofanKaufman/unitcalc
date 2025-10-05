import { keyframes, styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

const fadeOut = keyframes`
  to {
    opacity: 0;
    visibility: hidden;
  }
`;

export const AnimatedHeading = styled(Typography)(() => ({
  right: '40px',
  position: 'absolute',
  fontSize: 'medium',
  fontWeight: 'bold',
  marginTop: '-35px',
  borderBottom: 'dotted 2px',
  opacity: '80%',
  '&.fade-out': {
    opacity: 1,
    animation: `${fadeOut} 3s ease forwards`,
    animationDelay: '5s',
  },
}));
