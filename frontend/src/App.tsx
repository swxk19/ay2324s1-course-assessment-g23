import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Navbar from './components/Navbar.tsx'
import Questions from './pages/Questions.tsx'
import Users from './pages/Users.tsx'
import Home from './pages/Home.tsx'
import { Route, Routes } from 'react-router-dom'

const queryClient = new QueryClient()
const App: React.FC = () => {
    return (
        <>
            <Navbar />
            <QueryClientProvider client={queryClient}>
                <div className='container'>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/questions' element={<Questions />} />
                        <Route path='/users' element={<Users />} />
                    </Routes>
                </div>
            </QueryClientProvider>
        </>
    )
}

export default App
