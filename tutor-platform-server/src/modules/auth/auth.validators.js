const { z } = require("zod");

const email = z.string().email();
const password = z.string().min(6, "Password must be at least 6 characters");
const fullName = z.string().min(2, "Full name is required");

const registerFamilySchema = z.object({
  full_name: fullName,
  email,
  phone: z.string().min(7).max(30).optional(),
  password,
});

const registerTutorSchema = z.object({
  full_name: fullName,
  email,
  phone: z.string().min(7).max(30),
  password,

  // tutor profile basics (you can expand later)
  bio: z.string().max(2000).optional(),
  location_city: z.string().max(80),
  capable_location_area: z.string().max(80),
  education: z.string().max(150),
  experience_years: z.number().int().min(0).max(60),
  hourly_rate: z.number().min(0),
});

const loginSchema = z.object({
  email,
  password,
});

module.exports = {
  registerFamilySchema,
  registerTutorSchema,
  loginSchema,
};
