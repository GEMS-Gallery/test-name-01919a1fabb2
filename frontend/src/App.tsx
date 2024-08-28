import React, { useState } from 'react';
import { Container, Grid, Button, TextField, Paper, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { backend } from 'declarations/backend';

const CalculatorContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginTop: theme.spacing(4),
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
}));

const DisplayTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiInputBase-input': {
    fontSize: '1.5rem',
    textAlign: 'right',
  },
}));

const CalcButton = styled(Button)(({ theme }) => ({
  fontSize: '1.25rem',
  minWidth: '64px',
  margin: theme.spacing(0.5),
}));

const App: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay('0.');
      setWaitingForSecondOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const performOperation = async (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      setLoading(true);
      try {
        const result = await backend.calculate(operator, firstOperand, inputValue);
        setDisplay(result.toString());
        setFirstOperand(result);
      } catch (error) {
        setDisplay('Error');
      } finally {
        setLoading(false);
      }
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '=', '+'
  ];

  return (
    <Container maxWidth="sm">
      <CalculatorContainer>
        <DisplayTextField
          fullWidth
          variant="outlined"
          value={display}
          InputProps={{
            readOnly: true,
            endAdornment: loading && <CircularProgress size={20} />,
          }}
        />
        <Grid container spacing={1}>
          {buttons.map((btn) => (
            <Grid item xs={3} key={btn}>
              <CalcButton
                fullWidth
                variant="contained"
                color={['/', '*', '-', '+'].includes(btn) ? 'primary' : btn === '=' ? 'success' : 'secondary'}
                onClick={() => {
                  if (btn === '=') {
                    performOperation('=');
                  } else if (['+', '-', '*', '/'].includes(btn)) {
                    performOperation(btn);
                  } else if (btn === '.') {
                    inputDecimal();
                  } else {
                    inputDigit(btn);
                  }
                }}
                disabled={loading}
              >
                {btn}
              </CalcButton>
            </Grid>
          ))}
        </Grid>
        <Grid container justifyContent="center" style={{ marginTop: '16px' }}>
          <CalcButton
            variant="outlined"
            color="primary"
            onClick={clear}
            disabled={loading}
          >
            Clear
          </CalcButton>
        </Grid>
      </CalculatorContainer>
    </Container>
  );
};

export default App;