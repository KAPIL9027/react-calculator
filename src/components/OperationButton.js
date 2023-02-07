import React from 'react'

export default function OperationButton({dispatch,operation}) {
  return (
    <button onClick={()=> dispatch({type:"operation",payload:{operation}})}>{operation}</button>
  )
}