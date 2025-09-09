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

// ✅ Yup schema for search form
const SearchSchema = Yup.object().shape({
  searchQuery: Yup.string()
    .max(200, "Search query is too long")
    .optional(),
})

interface UrlFormValues {
  originalUrl: string
}


const Dashboard: React.FC = () => {
  const dispatch = useDispatch()
  useUserState()
  const { urls, loading, error, totalUrls, shorteningInProgress } = useUrlsState()
  const [successMessage, setSuccessMessage] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("") // ✅ controlled by Formik too

  useEffect(() => {
    fetchUrls()
  }, [])

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

  const handleOpenShortUrl = (shortUrl: string) => {
    window.open(shortUrl, "_blank")
  }

  // ✅ filter URLs based on Formik search query
  const filteredUrls = urls.filter(
    (url) =>
      url.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      url.shortUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      url.originalUrl.toLowerCase().includes(searchQuery.toLowerCase())
  )

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

        {/* ✅ Search Form with Formik */}
        <div className="search-section">
          <Formik
            initialValues={{ searchQuery: "" }}
            validationSchema={SearchSchema}
            onSubmit={(values) => {
              setSearchQuery(values.searchQuery)
            }}
          >
            {({ handleSubmit }) => (
              <Form onSubmit={handleSubmit} className="search-form">
                <div className="form-group">
                  <Field
                    type="text"
                    name="searchQuery"
                    placeholder="Search URLs..."
                    className="search-input"
                  />
                  <ErrorMessage name="searchQuery" component="div" className="error-text" />
                </div>
                <button type="submit" className="btn btn-small">🔍 Search</button>
                <button
                  type="button"
                  className="btn btn-small btn-clear"
                  onClick={() => setSearchQuery("")}
                >
                  ❌ Clear
                </button>
              </Form>
            )}
          </Formik>
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
                initialValues={{ originalUrl: "" }}
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
              <h2>Your Shortened URLs ({filteredUrls.length})</h2>
              <p>Manage and track all your shortened URLs</p>
            </div>
            <div className="card-content">
              {loading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <span>Loading your URLs...</span>
                </div>
              ) : filteredUrls.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🔍</div>
                  <h3>No matching URLs</h3>
                  <p>Try a different search query.</p>
                </div>
              ) : (
                <div className="urls-list">
                  {filteredUrls.map((url, index) => (
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
                              <button onClick={() => copyToClipboard(url.shortUrl)} className="btn btn-small">📋</button>
                              <button onClick={() => handleOpenShortUrl(url.shortUrl)} className="btn btn-small">🔗</button>
                            </div>
                          </div>

                          <div className="url-row">
                            <strong>Original URL:</strong>
                            <span className="original-url" title={url.originalUrl}>
                              {url.originalUrl.length > 60
                                ? `${url.originalUrl.substring(0, 60)}...`
                                : url.originalUrl}
                            </span>
                          </div>
                        </div>
                      </div>
                      {index < filteredUrls.length - 1 && <div className="url-separator"></div>}
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
