import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { QuestionTable } from './components/QuestionTable.tsx'

const queryClient = new QueryClient()
const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <QuestionTable />
        </QueryClientProvider>
    )
}

export default App
