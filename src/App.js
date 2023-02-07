
import { useReducer } from 'react';
import './App.css';
import './calculator.css';
import DigitButton from './components/DigitButton';
import OperationButton from './components/OperationButton';

const ACTIONS = {
  ADD_DIGIT: "add_digit",
  CLEAR: "clear",
  DELETE: "delete",
  CHOOSE_OPERATION: "operation",
  EVALUATE: "evaluate"
}

const INTEGER_FORMATTER = new Intl.NumberFormat('en-us',{
  maximumFractionDigits: 0
});


function formatter(operand)
{
  if(operand == null)
    return;
  const [integer,decimal] = operand.split('.');
  if(decimal == null) return `${INTEGER_FORMATTER.format(integer)}`;
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}
function evaluate({previousOperand,currentOperand,operation})
{
  const current = parseFloat(currentOperand);
  const previous = parseFloat(previousOperand);
  switch(operation)
  {
    case "+":
      return `${previous + current}`;
      case "-":
        return `${previous - current}`;
        case "*":
      return `${previous * current}`;
      case "/":
      return `${previous / current}`;

  }
}

function reducer(state,{type,payload})
{
  switch(type)
  {
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite)
      {
        return {...state,currentOperand:payload.digit,overwrite:false};
      }
      if(payload.digit === "0" && state.currentOperand === "0") return state;
      if(payload.digit === "." && state.currentOperand.includes(".")) return state;
    return {...state,currentOperand:`${state.currentOperand||""}${payload.digit}`};
      
    case ACTIONS.CLEAR:
      {
        return {};
      }
      
    case ACTIONS.CHOOSE_OPERATION:
      {
        if(state.currentOperand == null && state.previousOperand == null)
        {
          return state;
        }
        if(state.currentOperand == null)
        {
          return {...state,operation:payload.operation}
        }
        if(state.previousOperand == null)
        {
          return {...state,operation: payload.operation,previousOperand: state.currentOperand, currentOperand: null}
        }
        return {...state,previousOperand: evaluate(state), operation: payload.operation,currentOperand: null}
      }
      case ACTIONS.EVALUATE:
        {
          if(state.operation == null || state.previousOperand == null || state.currentOperand == null)
          {
            return state;
          }
          return {...state,overwrite: true,currentOperand: evaluate(state),previousOperand: null,operation:null}
        }
        case ACTIONS.DELETE:
          {
            if(state.currentOperand == null)
            {
              return state;
            }
            if(state.currentOperand.length === 1)
            {
              return {...state,currentOperand: null};
            }
            return {...state,currentOperand: state.currentOperand.slice(0,-1)};
          }
  }
};

function App() {

  

  const[{currentOperand,previousOperand,operation},dispatch] = useReducer(reducer,{});


  return (
   <div className="calculator-grid">
     <div className="output">
       <div className="previous-operand">
         {formatter(previousOperand)}{operation}
       </div>
       <div className="current-operand">
         {formatter(currentOperand)}
       </div>
     </div>
     <button className="span-2" onClick={()=> dispatch({type:ACTIONS.CLEAR,payload:{}})}>AC</button>
     <button className="span-2" onClick={()=> dispatch({type:ACTIONS.DELETE,payload:{}})}>DEL</button>
     <DigitButton dispatch={dispatch} digit="0"/>
     <DigitButton dispatch={dispatch} digit="1"/>
     <DigitButton dispatch={dispatch} digit="2"/>
     <DigitButton dispatch={dispatch} digit="3"/>
     <DigitButton dispatch={dispatch} digit="4"/>
     <DigitButton dispatch={dispatch} digit="5"/>
     <DigitButton dispatch={dispatch} digit="6"/>
     <DigitButton dispatch={dispatch} digit="7"/>
     <DigitButton dispatch={dispatch} digit="8"/>
     <DigitButton dispatch={dispatch} digit="9"/>
     <OperationButton dispatch={dispatch} operation="+"/>
     <OperationButton dispatch={dispatch} operation="-"/>
     <OperationButton dispatch={dispatch} operation="*"/>
     <OperationButton dispatch={dispatch} operation="/"/>
     <button onClick={()=> dispatch({type:ACTIONS.EVALUATE,payload:{}})}>=</button>
     <DigitButton dispatch={dispatch} digit="."/>
     </div>
     
  )
}

export default App;
