
import { useEffect, useState } from 'react'
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

type PublicPage = 'Home' | 'Products' | 'Services' | 'Careers' | 'About' | 'Contact'

type WorkspacePage = 'Dashboard' | 'Employees' | 'Jobs' | 'Applications' | 'Profile'

const API_URL = 'http://localhost:8081'

function App() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [showLogin, setShowLogin] = useState(false)
  const [publicPage, setPublicPage] = useState<PublicPage>('Home')
  const [workspacePage, setWorkspacePage] = useState<WorkspacePage>('Dashboard')
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loadingEmployees, setLoadingEmployees] = useState(false)
  const [employeeError, setEmployeeError] = useState('')

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
          error instanceof Error ? error.message : 'Something went wrong.',
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
    setShowLogin(false)
    setPublicPage('Home')
  }

  const openLogin = () => {
    setShowLogin(true)
  }

  const openPublicPage = (page: PublicPage) => {
    setPublicPage(page)
    setShowLogin(false)
  }

  const openWorkspacePage = (page: WorkspacePage) => {
    setWorkspacePage(page)
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

            <button className="workspace-logout" onClick={handleLogout}>
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
                <p className="public-eyebrow">YOUR BLUEHOUSE WORKSPACE</p>
                <h1 className="workspace-heading">
                  Welcome, {user.name}
                </h1>
                <p className="workspace-description">
                  Your workspace for opportunities, updates and company
                  information.
                </p>

                <section className="workspace-welcome-card">
                  <div>
                    <p className="public-eyebrow">BLUEHOUSE TECHNOLOGY</p>
                    <h2>Build your next chapter with us.</h2>
                    <p>
                      Explore opportunities, stay connected and discover
                      what is happening at Bluehouse.
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

                  <button onClick={() => openWorkspacePage('Applications')}>
                    <span>▣</span>
                    <strong>My Applications</strong>
                    <small>Track your applications</small>
                  </button>

                  {isEmployee && (
                    <button onClick={() => openWorkspacePage('Employees')}>
                      <span>♙</span>
                      <strong>Employees</strong>
                      <small>View company directory</small>
                    </button>
                  )}

                  <button onClick={() => openWorkspacePage('Profile')}>
                    <span>◎</span>
                    <strong>My Profile</strong>
                    <small>View your account</small>
                  </button>
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
                  <div className="workspace-error">{employeeError}</div>
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

            {workspacePage === 'Jobs' && (
              <>
                <p className="public-eyebrow">CAREER OPPORTUNITIES</p>
                <h1 className="workspace-heading">Explore Jobs</h1>
                <p className="workspace-description">
                  Discover opportunities at Bluehouse Technology.
                </p>
                <div className="workspace-empty">
                  Job listings will appear here when the jobs API is connected.
                </div>
              </>
            )}

            {workspacePage === 'Applications' && (
              <>
                <p className="public-eyebrow">YOUR CAREER JOURNEY</p>
                <h1 className="workspace-heading">My Applications</h1>
                <p className="workspace-description">
                  Track the status of your job applications.
                </p>
                <div className="workspace-empty">
                  Your applications will appear here when the applications
                  API is connected.
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
                  <p><strong>Name</strong> {user.name}</p>
                  <p><strong>Email</strong> {user.email}</p>
                  <p><strong>Role</strong> {user.role}</p>
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
          className="public-brand"
          onClick={() => openPublicPage('Home')}
        >
          <span>⌂</span>
          Bluehouse
        </button>

        <nav className="public-navigation">
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
          <button className="public-primary-button" onClick={openLogin}>
            Get Started →
          </button>
        </div>
      </header>

      {publicPage === 'Home' && (
        <>
          <section className="public-hero">
            <div className="public-hero-content">
              <span className="public-eyebrow">
                ● Innovating for a Smarter Tomorrow
              </span>

              <h1>
                Build. Innovate.
                <br />
                <span>Grow Together.</span>
              </h1>

              <p>
                Bluehouse Technology empowers businesses with cutting-edge
                solutions, modern products and a culture of innovation.
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
                  onClick={() => openPublicPage('About')}
                >
                  ◉ &nbsp; Learn More
                </button>
              </div>
            </div>

            <div className="public-hero-visual">
              <div className="visual-orbit">
                <div className="orbit-item">⌂</div>
                <div className="orbit-item">▥</div>
                <div className="orbit-item">⚙</div>
                <div className="orbit-item">✦</div>

                <div className="visual-core">B</div>
              </div>

              <div className="hero-dashboard-card">
                <div className="hero-dashboard-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="hero-dashboard-title">
                  Business Overview
                </div>
                <div className="hero-chart">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <div className="hero-chart-footer">
                  <div />
                  <div />
                </div>
              </div>

              <div className="hero-growth-card">
                <span>▥</span>
                <p>Business Growth</p>
                <strong>+235% ↗</strong>
              </div>
            </div>
          </section>

          <section className="public-home-cards">
            <article className="public-home-card">
              <div className="home-card-icon blue">〈/〉</div>
              <div>
                <h3>Our Products</h3>
                <p>
                  Powerful and scalable products built for the next generation.
                </p>
                <button onClick={() => openPublicPage('Products')}>
                  Explore Products →
                </button>
              </div>
            </article>

            <article className="public-home-card">
              <div className="home-card-icon purple">🚀</div>
              <div>
                <h3>Our Services</h3>
                <p>
                  End-to-end technology services to accelerate your growth.
                </p>
                <button onClick={() => openPublicPage('Services')}>
                  Discover Services →
                </button>
              </div>
            </article>

            <article className="public-home-card">
              <div className="home-card-icon green">▣</div>
              <div>
                <h3>Careers</h3>
                <p>
                  Be a part of our journey and build a successful career with us.
                </p>
                <button onClick={() => openPublicPage('Careers')}>
                  View Openings →
                </button>
              </div>
            </article>
          </section>

          <div className="public-scroll-indicator">⌄</div>

          {/* AI chatbot appears only on the public homepage */}
          <Chatbot />
        </>
      )}

      {publicPage !== 'Home' && (
        <section className="public-inner-page">
          <p className="public-eyebrow">BLUEHOUSE TECHNOLOGY</p>

          <h1>
            {publicPage === 'Products' && 'Products built for tomorrow.'}
            {publicPage === 'Services' && 'Technology services that move you forward.'}
            {publicPage === 'Careers' && 'Build your future with Bluehouse.'}
            {publicPage === 'About' && 'Innovation with purpose.'}
            {publicPage === 'Contact' && 'Let’s build something together.'}
          </h1>

          <p>
            {publicPage === 'Products' &&
              'Discover our technology products and digital solutions.'}
            {publicPage === 'Services' &&
              'Explore software development, AI and technology services.'}
            {publicPage === 'Careers' &&
              'Explore career opportunities and become part of our team.'}
            {publicPage === 'About' &&
              'Bluehouse Technology focuses on building modern digital solutions for businesses.'}
            {publicPage === 'Contact' &&
              'Connect with the Bluehouse Technology team to start a conversation.'}
          </p>

          {publicPage === 'Careers' && (
            <button className="public-primary-button" onClick={openLogin}>
              Sign in to Apply →
            </button>
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
          <span>⌂</span>
          Bluehouse
        </div>
        <p>Building smarter digital experiences for a better tomorrow.</p>
        <div className="public-footer-bottom">
          © {new Date().getFullYear()} Bluehouse Technology. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default App
