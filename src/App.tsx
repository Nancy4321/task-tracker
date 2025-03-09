import MainPage from '@/components/MainPage'
import { TaskProvider } from '@/contexts/TaskContext'

function App() {
  return (
    <TaskProvider>
      <MainPage />
    </TaskProvider>
  )
}

export default App
