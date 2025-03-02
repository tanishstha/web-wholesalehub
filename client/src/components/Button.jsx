import React from 'react'
import '../index.css'

const Button = ({buttonText, classes}) => {
  return (
    <button className={`btn__main ${classes}`}>{buttonText}</button>
  )
}

export default Button