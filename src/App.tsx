import styled from '@emotion/styled'
import RecordTable from './components/RecordTable'
import RecordForm from './containers/RecordForm'

function App() {
	return (
		<PageContainer>
			<RecordForm />
		</PageContainer>
	)
}

const PageContainer = styled('div')`
	padding: 0 10%;
`

export default App
