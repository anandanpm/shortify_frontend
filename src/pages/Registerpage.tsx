"use client"

import type React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useUserState } from "../hooks/useAppSelector"
import { setLoading, setError, clearError, loginSuccess } from "../redux/slices/userSlice"
import authAPI from "../services/api.tsx"
import "../styles/AuthPages.scss"

const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
    .required("Name is required"),
  email: Yup.string().email("Please enter a valid email address").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
})

interface RegisterFormValues {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const Register: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, error } = useUserState()

  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())

      console.log("Attempting registration with:", { name: values.name, email: values.email })

      // The API returns the user object directly, not a response with success property
      const user = await authAPI.register(values.name, values.email, values.password)

      console.log("Registration successful, user:", user)

      // Auto-login the user after successful registration
      dispatch(loginSuccess(user))

      // Navigate to dashboard or home page instead of login
      navigate("/dashboard")
    } catch (error: any) {
      console.log("Registration error caught:", error.message)
      dispatch(setError(error.message || "Registration failed. Please try again."))
    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Create Account</h2>
            <p>Sign up to start shortening your URLs</p>
          </div>

          <Formik
            initialValues={{
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={RegisterSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="auth-form">
                {error && (
                  <div className="error-alert" role="alert">
                    {error}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <Field
                    id="name"
                    name="name"
                    type="text"
                    className={errors.name && touched.name ? "error" : ""}
                    placeholder="Enter your full name"
                  />
                  <ErrorMessage name="name" component="span" className="error-text" />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    className={errors.email && touched.email ? "error" : ""}
                    placeholder="Enter your email"
                  />
                  <ErrorMessage name="email" component="span" className="error-text" />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    className={errors.password && touched.password ? "error" : ""}
                    placeholder="Create a password"
                  />
                  <ErrorMessage name="password" component="span" className="error-text" />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <Field
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className={errors.confirmPassword && touched.confirmPassword ? "error" : ""}
                    placeholder="Confirm your password"
                  />
                  <ErrorMessage name="confirmPassword" component="span" className="error-text" />
                </div>

                <button type="submit" className="btn btn-primary full-width" disabled={loading}>
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </Form>
            )}
          </Formik>

          <div className="auth-footer">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="auth-link">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
