import { StatusCodes } from 'http-status-codes'
import express from 'express'
import Joi from 'joi'

const createNew = async (req, res, next) => {
  const correctcondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      'string.base': 'Title must be a string',
      'string.empty': 'Title cannot be empty',
      'string.min': 'Title must have at least {#limit} characters',
      'string.max': 'Title cannot exceed {#limit} characters',
      'string.trim': 'Title cannot have whitespace at the beginning or end',
      'any.required': 'Title is a required field'
    }),
    description: Joi.string().required().min(3).max(256).trim().strict().messages({
      'string.base': 'Description must be a string',
      'string.empty': 'Description cannot be empty',
      'string.min': 'Description must have at least {#limit} characters',
      'string.max': 'Description cannot exceed {#limit} characters',
      'string.trim': 'Description cannot have whitespace at the beginning or end',
      'any.required': 'Description is a required field'
    })
  })


  try {
    // console.log(req.body)
    // abortEarly: false là để liệt kê ra tất cả các lỗi khi có error
    await correctcondition.validateAsync(req.body, { abortEarly: false })
    res.status(StatusCodes.CREATED).json({ massage: 'Create New board success'})
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: new Error(error).message})
  }
}

export const boardValidation = {
  createNew
}