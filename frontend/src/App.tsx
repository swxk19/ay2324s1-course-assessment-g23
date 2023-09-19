import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Questions from './pages/Questions.tsx'
import Users from './pages/Users.tsx'
import Login from './pages/Login.tsx'
import { Route, Routes } from 'react-router-dom'
import Signup from './pages/Signup.tsx'

const queryClient = new QueryClient()
const App: React.FC = () => {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <div className='container'>
                    <Routes>
                        <Route path='/' element={<Login />} />
                        <Route path='/signup' element={<Signup />} />
                        <Route path='/questions' element={<Questions />} />
                        <Route path='/users' element={<Users />} />
                    </Routes>
                </div>
            </QueryClientProvider>
        </>
    )
}

export default App
