// src/validation/authSchema.js
const { z } = require('zod');

const signupSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).min(3, { message: 'Name must be at least 3 characters long' }),
  mobile_no: z.string().length(10, { message: 'Mobile number must be 10 digits' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  age: z.number().int().positive().optional(),
  email: z.string().email({ message: 'Invalid email address' }).optional(),
  region_of_commute: z.string().optional(),
});
const loginSchema = z.object({
  mobile_no: z.string().length(10, { message: 'Mobile number must be 10 digits' }),
  password: z.string().min(1, { message: 'Password cannot be empty' }),
});

module.exports = {
  signupSchema,
  loginSchema, // <-- EXPORT THE NEW SCHEMA
};