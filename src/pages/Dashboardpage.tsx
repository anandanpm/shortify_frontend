
import type React from "react"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useUserState, useUrlsState } from "../hooks/useAppSelector"
import {
  setUrlsLoading,
  setShorteningLoading,
  setUrlsError,
  clearUrlsError,
  setUrls,
  addUrl,
} from "../redux/slices/urlSlice"
import api from "../services/api"
import "../styles/Dashboard.scss"

const UrlSchema = Yup.object().shape({
  originalUrl: Yup.string()
    .url("Please enter a valid URL (include http:// or https://)")
    .required("Please enter a URL"),
})

interface UrlFormValues {
  originalUrl: string
}

const Dashboard: React.FC = () => {
  const dispatch = useDispatch()
  const { user } = useUserState() // Assuming this returns user data
  const { urls, loading, error, totalUrls, shorteningInProgress } = useUrlsState()
  const [successMessage, setSuccessMessage] = useState<string>("")

  useEffect(() => {
    fetchUrls()
  }, [])

  // Prevent back button navigation when user is authenticated
  useEffect(() => {
    if (user) {
      // Add a dummy history entry to prevent going back
      window.history.pushState(null, '', window.location.href)
      
      const handlePopState = (_event: PopStateEvent) => {
        // Push the current state again to prevent navigation
        window.history.pushState(null, '', window.location.href)
        
        // Optional: Show a message to user
        setSuccessMessage("Please use the logout button to exit the dashboard")
        setTimeout(() => setSuccessMessage(""), 3000)
      }

      // Listen for back button events
      window.addEventListener('popstate', handlePopState)

      // Cleanup event listener
      return () => {
        window.removeEventListener('popstate', handlePopState)
      }
    }
  }, [user])

  useEffect(() => {
    if (user) {
    }
  }, [user])

  const fetchUrls = async () => {
    try {
      dispatch(setUrlsLoading(true))
      dispatch(clearUrlsError())

      const response = await api.getUserUrls()
      dispatch(setUrls(response))
    } catch (error: any) {
      dispatch(setUrlsError(error.message || "Failed to fetch URLs"))
    }
  }

  const handleShortenUrl = async (values: UrlFormValues, { resetForm }: any) => {
    try {
      dispatch(setShorteningLoading(true))
      dispatch(clearUrlsError())

      const response = await api.shortenUrl(values.originalUrl)

      if (response.success && response.data) {
        const newUrl = {
          id: response.data.shortCode,
          originalUrl: response.data.originalUrl,
          shortUrl: response.data.shortUrl,
          shortCode: response.data.shortCode,
          createdAt: new Date().toISOString(),
        }

        dispatch(addUrl(newUrl))
        resetForm()
        setSuccessMessage(response.message || "URL shortened successfully!")
        setTimeout(() => setSuccessMessage(""), 3000)
      }
    } catch (error: any) {
      dispatch(setUrlsError(error.message || "Failed to shorten URL"))
    } finally {
      dispatch(setShorteningLoading(false))
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setSuccessMessage("URL copied to clipboard!")
      setTimeout(() => setSuccessMessage(""), 2000)
    } catch (error) {
      console.error("Failed to copy URL")
      setSuccessMessage("Failed to copy URL")
      setTimeout(() => setSuccessMessage(""), 2000)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleRefresh = () => {
    fetchUrls()
    setSuccessMessage("URLs refreshed!")
    setTimeout(() => setSuccessMessage(""), 2000)
  }

  // Function to handle direct navigation to shortened URL
  const handleOpenShortUrl = (shortUrl: string) => {
    // This will directly navigate to the backend endpoint which will redirect
    window.open(shortUrl, "_blank")
  }

  return (
    <div className="dashboard">
      <div className="container">
        {/* Global Messages */}
        {successMessage && <div className="global-message success">{successMessage}</div>}
        {error && <div className="global-message error">{error}</div>}

        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <div className="user-stats">
            <span className="stat">
              <strong>{totalUrls}</strong> URLs Created
            </span>
            <button onClick={handleRefresh} className="btn" disabled={loading}>
              {loading ? "🔄 Refreshing..." : "🔄 Refresh"}
            </button>
          </div>
        </div>

        {/* URL Shortening Form */}
        <div className="url-form-section">
          <div className="card">
            <div className="card-header">
              <h2>Shorten a New URL</h2>
              <p>Enter a long URL to create a shortened version</p>
            </div>
            <div className="card-content">
              <Formik
                initialValues={{
                  originalUrl: "",
                }}
                validationSchema={UrlSchema}
                onSubmit={handleShortenUrl}
              >
                {({ isSubmitting, errors, touched }) => (
                  <Form className="url-form">
                    <div className="form-group">
                      <label htmlFor="originalUrl">Original URL</label>
                      <div className="url-input-group">
                        <div className="url-input-wrapper">
                          <Field
                            id="originalUrl"
                            name="originalUrl"
                            type="url"
                            className={errors.originalUrl && touched.originalUrl ? "error" : ""}
                            placeholder="https://example.com/very-long-url"
                            disabled={shorteningInProgress}
                          />
                          <ErrorMessage name="originalUrl" component="span" className="error-text" />
                        </div>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={isSubmitting || shorteningInProgress}
                        >
                          {shorteningInProgress ? "Shortening..." : "Shorten URL"}
                        </button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>

        {/* URLs List */}
        <div className="urls-section">
          <div className="card">
            <div className="card-header">
              <h2>Your Shortened URLs ({totalUrls})</h2>
              <p>Manage and track all your shortened URLs</p>
            </div>
            <div className="card-content">
              {loading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <span>Loading your URLs...</span>
                </div>
              ) : urls.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🔗</div>
                  <h3>No URLs yet</h3>
                  <p>Start by shortening your first URL above!</p>
                </div>
              ) : (
                <div className="urls-list">
                  {urls.map((url, index) => (
                    <div key={url.id} className="url-item">
                      <div className="url-info">
                        <div className="url-meta">
                          <span className="short-code">{url.shortCode}</span>
                          <span className="date">{formatDate(url.createdAt)}</span>
                        </div>

                        <div className="url-details">
                          <div className="url-row">
                            <strong>Short URL:</strong>
                            <div className="url-actions">
                              <code className="short-url">{url.shortUrl}</code>
                              <button
                                onClick={() => copyToClipboard(url.shortUrl)}
                                className="btn btn-small"
                                title="Copy to clipboard"
                              >
                                📋
                              </button>
                              <button
                                onClick={() => handleOpenShortUrl(url.shortUrl)}
                                className="btn btn-small"
                                title="Open in new tab"
                              >
                                🔗
                              </button>
                            </div>
                          </div>

                          <div className="url-row">
                            <strong>Original URL:</strong>
                            <span className="original-url" title={url.originalUrl}>
                              {url.originalUrl.length > 60 ? `${url.originalUrl.substring(0, 60)}...` : url.originalUrl}
                            </span>
                          </div>
                        </div>
                      </div>
                      {index < urls.length - 1 && <div className="url-separator"></div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard