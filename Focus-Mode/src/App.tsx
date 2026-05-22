import homePage from './assets/Home-Page (1).png'
import './App.css'

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <img src={homePage} alt="Home Page" style={{ maxWidth: '100%' }} />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
        <input
          type="text"
          placeholder="Enter link(s)"
          style={{
            width: '420px',
            padding: '18px 28px',
            borderRadius: '999px',
            border: 'none',
            backgroundColor: '#c8c8c8',
            fontSize: '20px',
            outline: 'none',
          }}
        />
        <div
          style={{
            width: '420px',
            padding: '18px 28px',
            borderRadius: '999px',
            backgroundColor: '#c8c8c8',
            fontSize: '20px',
            color: '#222',
          }}
        >
          00:00:00
        </div>
      </div>
    </div>
  )
}

export default App
