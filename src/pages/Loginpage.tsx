// "use client"

// import React from "react"
// import { Link, useNavigate } from "react-router-dom"
// import { useDispatch } from "react-redux"
// import type { AppDispatch } from "../redux/store"
// import { Formik, Form, Field, ErrorMessage } from "formik"
// import * as Yup from "yup"
// import { useUserState } from "../hooks/useAppSelector"
// import { loginUser, clearError } from "../redux/slices/userSlice"
// import "../styles/AuthPages.scss"

// const LoginSchema = Yup.object().shape({
//   email: Yup.string().email("Please enter a valid email address").required("Email is required"),
//   password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
// })

// interface LoginFormValues {
//   email: string
//   password: string
// }

// const Login: React.FC = () => {
//   const navigate = useNavigate()
//   const dispatch = useDispatch<AppDispatch>()
//   const { loading, error, isAuthenticated, user } = useUserState()

//   // Clear error when component mounts
//   React.useEffect(() => {
//     dispatch(clearError())
//   }, [dispatch])

//   // Redirect if already authenticated - this is the key fix
//   React.useEffect(() => {
//     console.log("Login component - checking auth state:", { isAuthenticated, user })
//     if (isAuthenticated && user) {
//       console.log("User is already authenticated, redirecting to dashboard...")
//       navigate("/dashboard", { replace: true })
//     }
//   }, [isAuthenticated, user, navigate])

//   const handleSubmit = async (values: LoginFormValues) => {
//     try {
//       dispatch(clearError())
//       console.log("Attempting login with:", { email: values.email })

//       const result = await dispatch(
//         loginUser({
//           email: values.email,
//           password: values.password,
//         }),
//       )

//       console.log("Login dispatch result:", result)

//       if (loginUser.fulfilled.match(result)) {
//         console.log("Login successful, user:", result.payload)
//         // Force navigation after successful login
//         navigate("/dashboard", { replace: true })
//       } else if (loginUser.rejected.match(result)) {
//         console.log("Login failed:", result.payload)
//       }
//     } catch (error: any) {
//       console.log("Unexpected error:", error)
//     }
//   }

//   // If user is authenticated, don't render the login form
//   if (isAuthenticated && user) {
//     return null // or a loading spinner
//   }

//   return (
//     <div className="auth-page">
//       <div className="auth-container">
//         <div className="auth-card">
//           <div className="auth-header">
//             <h2>Welcome Back</h2>
//             <p>Sign in to your account to continue</p>
//           </div>

//           <Formik
//             initialValues={{
//               email: "",
//               password: "",
//             }}
//             validationSchema={LoginSchema}
//             onSubmit={handleSubmit}
//           >
//             {({ errors, touched }) => (
//               <Form className="auth-form">
//                 {error && (
//                   <div className="error-alert" role="alert">
//                     {error}
//                   </div>
//                 )}

//                 <div className="form-group">
//                   <label htmlFor="email">Email Address</label>
//                   <Field
//                     id="email"
//                     name="email"
//                     type="email"
//                     className={errors.email && touched.email ? "error" : ""}
//                     placeholder="Enter your email"
//                   />
//                   <ErrorMessage name="email" component="span" className="error-text" />
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="password">Password</label>
//                   <Field
//                     id="password"
//                     name="password"
//                     type="password"
//                     className={errors.password && touched.password ? "error" : ""}
//                     placeholder="Enter your password"
//                   />
//                   <ErrorMessage name="password" component="span" className="error-text" />
//                 </div>

//                 <button type="submit" className="btn btn-primary full-width" disabled={loading}>
//                   {loading ? "Signing In..." : "Sign In"}
//                 </button>
//               </Form>
//             )}
//           </Formik>

//           <div className="auth-footer">
//             <p>
//               Don't have an account?{" "}
//               <Link to="/register" className="auth-link">
//                 Sign up here
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Login


import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../redux/store"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useUserState } from "../hooks/useAppSelector"
import { loginUser, clearError } from "../redux/slices/userSlice"
import "../styles/AuthPages.scss"

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Please enter a valid email address").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
})

interface LoginFormValues {
  email: string
  password: string
}

const Login: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error, isAuthenticated, user } = useUserState()

  // Clear error when component mounts
  React.useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  // Redirect if already authenticated
  React.useEffect(() => {
    console.log("Login component - checking auth state:", { isAuthenticated, user })
    if (isAuthenticated && user) {
      console.log("User is already authenticated, redirecting to dashboard...")
      navigate("/dashboard", { replace: true })
    }
  }, [isAuthenticated, user, navigate])

  // ✅ Fixed: Properly handle async thunk with await
  const handleSubmit = async (values: LoginFormValues) => {
    try {
      dispatch(clearError())
      console.log("Attempting login with:", { email: values.email })

      // ✅ Use unwrap() to properly handle the async thunk result
      const result = await dispatch(
        loginUser({
          email: values.email,
          password: values.password,
        })
      ).unwrap()

      console.log("Login successful, user:", result)
      // Navigation will happen automatically via useEffect when isAuthenticated changes
      
    } catch (error: any) {
      // ✅ Error is automatically handled by the rejected case in slice
      console.log("Login failed:", error)
      // Error state is already set by the async thunk
    }
  }

  // If user is authenticated, don't render the login form
  if (isAuthenticated && user) {
    return null // or a loading spinner
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your account to continue</p>
          </div>

          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="auth-form">
                {error && (
                  <div className="error-alert" role="alert">
                    {error}
                  </div>
                )}

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
                    placeholder="Enter your password"
                  />
                  <ErrorMessage name="password" component="span" className="error-text" />
                </div>

                {/* ✅ Fixed: Use both Redux loading and Formik isSubmitting */}
                <button 
                  type="submit" 
                  className="btn btn-primary full-width" 
                  disabled={loading || isSubmitting}
                >
                  {loading || isSubmitting ? "Signing In..." : "Sign In"}
                </button>
              </Form>
            )}
          </Formik>

          <div className="auth-footer">
            <p>
              Don't have an account?{" "}
              <Link to="/login" className="auth-link">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
