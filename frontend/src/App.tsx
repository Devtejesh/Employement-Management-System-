
import { useEffect, useRef, useState } from 'react'
import './App.css'
import Login from './Login'
import Chatbot from './Chatbot'

type AuthUser = {
  id: number
  name: string
  email: string
  role: string
}

type Employee = {
  id: number
  name: string
  age: number
  mail: string
}

type PublicPage =
  | 'Home'
  | 'Products'
  | 'Services'
  | 'Careers'
  | 'About'
  | 'Contact'

type WorkspacePage =
  | 'Dashboard'
  | 'Employees'
  | 'Jobs'
  | 'Applications'
  | 'Profile'
  | 'PDF Upload'

const API_URL = 'http://localhost:8081'

function App() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [showLogin, setShowLogin] = useState(false)
  const [publicPage, setPublicPage] = useState<PublicPage>('Home')
  const [workspacePage, setWorkspacePage] =
    useState<WorkspacePage>('Dashboard')

  const [employees, setEmployees] = useState<Employee[]>([])
  const [loadingEmployees, setLoadingEmployees] = useState(false)
  const [employeeError, setEmployeeError] = useState('')

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')
  const [uploadError, setUploadError] = useState('')

  const [menuOpen, setMenuOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isAdmin = user?.role?.toLowerCase() === 'admin'

  const isEmployee =
    user?.role?.toLowerCase() === 'employee' || isAdmin

  useEffect(() => {
    const savedUser = sessionStorage.getItem('authUser')
    const savedToken = sessionStorage.getItem('authToken')

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        sessionStorage.removeItem('authUser')
        sessionStorage.removeItem('authToken')
      }
    }
  }, [])

  useEffect(() => {
    if (!user || !isEmployee) return

    const fetchEmployees = async () => {
      setLoadingEmployees(true)
      setEmployeeError('')

      try {
        const token = sessionStorage.getItem('authToken')

        const response = await fetch(`${API_URL}/employees`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Unable to load employee records.')
        }

        const data = await response.json()
        setEmployees(Array.isArray(data) ? data : [])
      } catch (error) {
        setEmployeeError(
          error instanceof Error
            ? error.message
            : 'Something went wrong.',
        )
      } finally {
        setLoadingEmployees(false)
      }
    }

    fetchEmployees()
  }, [user, isEmployee])

  const handleLogin = (token: string, loggedInUser: AuthUser) => {
    sessionStorage.setItem('authToken', token)
    sessionStorage.setItem('authUser', JSON.stringify(loggedInUser))

    setUser(loggedInUser)
    setShowLogin(false)
    setWorkspacePage('Dashboard')
  }

  const handleLogout = () => {
    sessionStorage.removeItem('authToken')
    sessionStorage.removeItem('authUser')

    setUser(null)
    setEmployees([])
    setSelectedFiles([])
    setShowLogin(false)
    setPublicPage('Home')
    setMenuOpen(false)
  }

  const openLogin = () => {
    setShowLogin(true)
    setMenuOpen(false)
  }

  const openPublicPage = (page: PublicPage) => {
    setPublicPage(page)
    setShowLogin(false)
    setMenuOpen(false)
  }

  const openWorkspacePage = (page: WorkspacePage) => {
    setWorkspacePage(page)
    setUploadMessage('')
    setUploadError('')
    setMenuOpen(false)
  }

  const handleFileSelection = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files || [])

    setUploadMessage('')
    setUploadError('')

    if (files.some((file) => file.type !== 'application/pdf')) {
      setUploadError('Please select PDF files only.')
      setSelectedFiles([])
      event.target.value = ''
      return
    }

    const totalSize = files.reduce((total, file) => total + file.size, 0)

    if (totalSize > 100 * 1024 * 1024) {
      setUploadError('Total file size must not exceed 100 MB.')
      setSelectedFiles([])
      event.target.value = ''
      return
    }

    setSelectedFiles(files)
  }

  const handlePDFUpload = async () => {
    if (!isAdmin) {
      setUploadError('Only administrators can upload PDFs.')
      return
    }

    if (selectedFiles.length === 0) {
      setUploadError('Please select at least one PDF file.')
      return
    }

    setUploading(true)
    setUploadMessage('')
    setUploadError('')

    try {
      const token = sessionStorage.getItem('authToken')
      const formData = new FormData()

      selectedFiles.forEach((file) => {
        formData.append('files', file)
      })

      const response = await fetch(
        `${API_URL}/admin/knowledge/upload`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      )

      const responseText = await response.text()

      if (!response.ok) {
        throw new Error(
          responseText || 'PDF upload failed. Please try again.',
        )
      }

      setUploadMessage(
        responseText || 'PDF files uploaded successfully.',
      )
      setSelectedFiles([])

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      setUploadError(
        error instanceof Error
          ? error.message
          : 'Something went wrong during upload.',
      )
    } finally {
      setUploading(false)
    }
  }

  const publicNavigation: PublicPage[] = [
    'Home',
    'Products',
    'Services',
    'Careers',
    'About',
    'Contact',
  ]

  const workspaceNavigation: WorkspacePage[] = [
    'Dashboard',
    ...(isEmployee ? ['Employees' as WorkspacePage] : []),
    'Jobs',
    'Applications',
    'Profile',
    ...(isAdmin ? ['PDF Upload' as WorkspacePage] : []),
  ]

  if (showLogin) {
    return <Login onLogin={handleLogin} />
  }

  if (user) {
    return (
      <div className="workspace-layout">
        <aside className="workspace-sidebar">
          <div className="public-brand">
            <span>B</span>
            Bluehouse
          </div>

          <p className="workspace-label">WORKSPACE</p>

          <nav className="workspace-navigation">
            {workspaceNavigation.map((page) => (
              <button
                key={page}
                className={`workspace-nav ${
                  workspacePage === page ? 'active' : ''
                }`}
                onClick={() => openWorkspacePage(page)}
              >
                <span>
                  {page === 'Dashboard' && '⌂'}
                  {page === 'Employees' && '♙'}
                  {page === 'Jobs' && '▤'}
                  {page === 'Applications' && '▣'}
                  {page === 'Profile' && '◎'}
                  {page === 'PDF Upload' && '⇧'}
                </span>
                {page}
              </button>
            ))}
          </nav>

          <div className="workspace-sidebar-bottom">
            <div className="workspace-user">
              <div className="workspace-avatar">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <strong>{user.name}</strong>
                <span>{user.role}</span>
              </div>
            </div>

            <button
              className="workspace-logout"
              onClick={handleLogout}
            >
              ↪ Sign out
            </button>
          </div>
        </aside>

        <main className="workspace-main">
          <header className="workspace-topbar">
            <span>Bluehouse Technology / {workspacePage}</span>
            <span className="workspace-role">{user.role}</span>
          </header>

          <div className="workspace-content">
            {workspacePage === 'Dashboard' && (
              <>
                <p className="public-eyebrow">
                  YOUR BLUEHOUSE WORKSPACE
                </p>

                <h1 className="workspace-heading">
                  Welcome, {user.name}
                </h1>

                <p className="workspace-description">
                  Your workspace for opportunities, updates and
                  company information.
                </p>

                <section className="workspace-welcome-card">
                  <div>
                    <p className="public-eyebrow">
                      BLUEHOUSE TECHNOLOGY
                    </p>
                    <h2>Build your next chapter with us.</h2>
                    <p>
                      Explore opportunities, stay connected and
                      discover what is happening at Bluehouse.
                    </p>
                  </div>
                  <div className="workspace-welcome-symbol">B</div>
                </section>

                <div className="workspace-shortcuts">
                  <button onClick={() => openWorkspacePage('Jobs')}>
                    <span>▤</span>
                    <strong>Explore Jobs</strong>
                    <small>Discover opportunities</small>
                  </button>

                  <button
                    onClick={() =>
                      openWorkspacePage('Applications')
                    }
                  >
                    <span>▣</span>
                    <strong>My Applications</strong>
                    <small>Track your applications</small>
                  </button>

                  {isEmployee && (
                    <button
                      onClick={() =>
                        openWorkspacePage('Employees')
                      }
                    >
                      <span>♙</span>
                      <strong>Employees</strong>
                      <small>View company directory</small>
                    </button>
                  )}

                  <button
                    onClick={() => openWorkspacePage('Profile')}
                  >
                    <span>◎</span>
                    <strong>My Profile</strong>
                    <small>View your account</small>
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() =>
                        openWorkspacePage('PDF Upload')
                      }
                    >
                      <span>⇧</span>
                      <strong>Knowledge Upload</strong>
                      <small>Upload company PDFs</small>
                    </button>
                  )}
                </div>
              </>
            )}

            {workspacePage === 'Employees' && isEmployee && (
              <>
                <p className="public-eyebrow">COMPANY DIRECTORY</p>
                <h1 className="workspace-heading">Our Employees</h1>

                <p className="workspace-description">
                  Employee records available in the company database.
                </p>

                {loadingEmployees && <p>Loading employees...</p>}

                {employeeError && (
                  <div className="workspace-error">
                    {employeeError}
                  </div>
                )}

                {!loadingEmployees &&
                  !employeeError &&
                  employees.length === 0 && (
                    <div className="workspace-empty">
                      No employee records found.
                    </div>
                  )}

                {!loadingEmployees && employees.length > 0 && (
                  <div className="workspace-table-wrapper">
                    <table className="workspace-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>NAME</th>
                          <th>EMAIL</th>
                          <th>AGE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees.map((employee) => (
                          <tr key={employee.id}>
                            <td>{employee.id}</td>
                            <td>{employee.name}</td>
                            <td>{employee.mail}</td>
                            <td>{employee.age}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}

            {workspacePage === 'PDF Upload' && isAdmin && (
              <>
                <p className="public-eyebrow">
                  ADMINISTRATION
                </p>

                <h1 className="workspace-heading">
                  Knowledge Base Upload
                </h1>

                <p className="workspace-description">
                  Upload official Bluehouse company documents
                  to make them available to the AI assistant.
                </p>

                <section className="workspace-profile-card">
                  <h2>Upload PDF Documents</h2>

                  <p>
                    Selected documents will be processed by the AI
                    agent and stored in the Bluehouse knowledge
                    collection.
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    multiple
                    onChange={handleFileSelection}
                  />

                  {selectedFiles.length > 0 && (
                    <div>
                      <h3>Selected files</h3>

                      {selectedFiles.map((file, index) => (
                        <p key={`${file.name}-${index}`}>
                          📄 {file.name} (
                          {(file.size / (1024 * 1024)).toFixed(2)} MB)
                        </p>
                      ))}
                    </div>
                  )}

                  {uploadError && (
                    <div className="workspace-error">
                      {uploadError}
                    </div>
                  )}

                  {uploadMessage && (
                    <div className="workspace-success">
                      {uploadMessage}
                    </div>
                  )}

                  <button
                    className="public-primary-button"
                    onClick={handlePDFUpload}
                    disabled={
                      uploading || selectedFiles.length === 0
                    }
                  >
                    {uploading
                      ? 'Uploading and processing...'
                      : 'Upload to Knowledge Base'}
                  </button>

                  <p>
                    Maximum total upload size: 100 MB.
                    PDF files only.
                  </p>
                </section>
              </>
            )}

            {workspacePage === 'Jobs' && (
              <>
                <p className="public-eyebrow">
                  CAREER OPPORTUNITIES
                </p>
                <h1 className="workspace-heading">Explore Jobs</h1>
                <p className="workspace-description">
                  Discover opportunities at Bluehouse Technology.
                </p>
                <div className="workspace-empty">
                  Job listings will appear here when the jobs API
                  is connected.
                </div>
              </>
            )}

            {workspacePage === 'Applications' && (
              <>
                <p className="public-eyebrow">
                  YOUR CAREER JOURNEY
                </p>
                <h1 className="workspace-heading">
                  My Applications
                </h1>
                <p className="workspace-description">
                  Track the status of your job applications.
                </p>
                <div className="workspace-empty">
                  Your applications will appear here when the
                  applications API is connected.
                </div>
              </>
            )}

            {workspacePage === 'Profile' && (
              <>
                <p className="public-eyebrow">ACCOUNT SETTINGS</p>
                <h1 className="workspace-heading">My Profile</h1>
                <p className="workspace-description">
                  Your account information.
                </p>

                <div className="workspace-profile-card">
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Role:</strong> {user.role}</p>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="public-site">
      <header className="public-header">
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>

        <button
          className="public-brand"
          onClick={() => openPublicPage('Home')}
        >
          <span>B</span>
          Bluehouse
        </button>

        <nav className={`public-navigation ${menuOpen ? 'open' : ''}`}>
          {publicNavigation.map((page) => (
            <button
              key={page}
              className={`public-nav-link ${
                publicPage === page ? 'active' : ''
              }`}
              onClick={() => openPublicPage(page)}
            >
              {page}
            </button>
          ))}
        </nav>

        <div className="public-header-actions">
          <button onClick={openLogin}>Sign In</button>
          <button
            className="public-primary-button"
            onClick={openLogin}
          >
            Get Started →
          </button>
        </div>
      </header>

      {publicPage === 'Home' && (
        <>
          <section className="public-hero">
            <div className="public-hero-content">
              <span className="public-eyebrow">
                ● MISSION-CRITICAL SOFTWARE SOLUTIONS
              </span>

              <h1>
                Building Mission-Critical Software for a
                <br />
                <span>Connected World.</span>
              </h1>

              <p>
                Bespoke software development with proven expertise
                in telecoms, gaming, and ecommerce.
              </p>

              <p>
                We build and maintain software that businesses
                depend on every day. From telecoms infrastructure
                to regulatory compliance systems, we deliver
                solutions that can't afford to fail.
              </p>

              <div className="public-hero-actions">
                <button
                  className="public-primary-button"
                  onClick={() => openPublicPage('Products')}
                >
                  Explore Our Products →
                </button>

                <button
                  className="public-secondary-button"
                  onClick={() => openPublicPage('Services')}
                >
                  Discover Our Services
                </button>
              </div>
            </div>

            <div className="public-hero-visual">
              <img
                src="/assets/Group%20769.svg"
                alt="Bluehouse global technology network"
              />
            </div>
          </section>

          <section className="public-home-cards">
            <article className="public-home-card">
              <div className="home-card-icon blue">〈/〉</div>
              <div>
                <h3>Our Products</h3>
                <p>
                  Proven technology products built for real-world
                  business requirements.
                </p>
                <button
                  onClick={() => openPublicPage('Products')}
                >
                  Explore Products →
                </button>
              </div>
            </article>

            <article className="public-home-card">
              <div className="home-card-icon purple">⚙</div>
              <div>
                <h3>Our Services</h3>
                <p>
                  Full-stack software development and complete
                  lifecycle management.
                </p>
                <button
                  onClick={() => openPublicPage('Services')}
                >
                  Discover Services →
                </button>
              </div>
            </article>

            <article className="public-home-card">
              <div className="home-card-icon green">▣</div>
              <div>
                <h3>Our Expertise</h3>
                <p>
                  Deep domain knowledge in telecoms, gaming and
                  ecommerce.
                </p>
                <button
                  onClick={() => openPublicPage('About')}
                >
                  Learn More →
                </button>
              </div>
            </article>
          </section>

          <section className="public-inner-page">
            <p className="public-eyebrow">BLUEHOUSE TECHNOLOGY</p>
            <h2>Systems that businesses depend on.</h2>
            <p>
              We don't just write code. We build systems that
              businesses depend on every day. That responsibility
              drives everything we do.
            </p>
          </section>

          <Chatbot />
        </>
      )}

      {publicPage !== 'Home' && (
        <section className="public-inner-page">
          <p className="public-eyebrow">BLUEHOUSE TECHNOLOGY</p>

          <h1>
            {publicPage === 'Products' &&
              'Technology Products'}
            {publicPage === 'Services' &&
              'Software Development Services'}
            {publicPage === 'Careers' &&
              'Build Your Future With Bluehouse'}
            {publicPage === 'About' &&
              'Building Mission-Critical Software'}
            {publicPage === 'Contact' &&
              'Let’s Build Something Together'}
          </h1>

          <p>
            {publicPage === 'Products' &&
              'Explore our telecom software products and business solutions.'}
            {publicPage === 'Services' &&
              'Full-stack software development with complete lifecycle management.'}
            {publicPage === 'Careers' &&
              'Explore career opportunities and become part of our team.'}
            {publicPage === 'About' &&
              'Bluehouse Technology builds software solutions for businesses that cannot afford to fail.'}
            {publicPage === 'Contact' &&
              'Connect with the Bluehouse Technology team to discuss your project.'}
          </p>

          {publicPage === 'Careers' && (
            <button
              className="public-primary-button"
              onClick={openLogin}
            >
              Sign in to Apply →
            </button>
          )}

          {publicPage === 'Contact' && (
            <div>
              <p>115c Milton Road, Cambridge CB4 1XE, United Kingdom</p>
              <p>info@bluehouse-technology.co.uk</p>
            </div>
          )}

          <button
            className="public-back-button"
            onClick={() => openPublicPage('Home')}
          >
            ← Back to Home
          </button>
        </section>
      )}

      <footer className="public-footer">
        <div className="public-brand">
          <span>B</span>
          Bluehouse Technology
        </div>

        <p>
          Building software that businesses depend on.
        </p>

        <div className="public-footer-bottom">
          © {new Date().getFullYear()} Bluehouse Technology.
          All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default App
