import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert, AlertTitle } from '@mui/material';
import styled from '@emotion/styled'
import { Record, RecordSearchParam } from '../common';

interface RecordTableProps {
	startEpoch: number,
	endEpoch: number,
	recordSearchParam?: RecordSearchParam,
	recordSearchValue?: string
}

const RecordTable: React.FC<RecordTableProps> = (props) => {
	const {
		startEpoch,
		endEpoch,
		recordSearchParam,
		recordSearchValue,
	} = props

    const [records, setRecords] = useState<Record[] | null>(null)
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		(async () => {
			const records = await fetchRecords()
			if (records) {
				setRecords(records)
			}
		})()
	}, [
		startEpoch,
		endEpoch,
		recordSearchParam,
		recordSearchValue,
	])

	const fetchRecords = async (): Promise<Record[] | null> => {
		// NOTE: Due to time-constraints, I was unable to create an Nginx reverse proxy.
		// For the purposes of this demo, I will be using React Environment Variables
		const server_url = process.env.REACT_APP_BACKEND_SERVER
		if (!server_url) {
			setError('Backend server url is not defined in env')
			return null
		}
		return await fetch(`${server_url}/mssql/records/${startEpoch}/${endEpoch}`)
			.then(async (res: Response): Promise<Record[]> => {
				if (!res.ok) {
					throw new Error(`HTTP error status: ${res.status}`)
				}
				const records: Record[] = await res.json()
				if (Array.isArray(records)) {
					return records
				} else {
					throw new Error('API response is not an array')
				}
			})
			.catch((err): null => {
				if (err instanceof Error) {
					setError(err.message)
				}
				console.error(err)
				return null
			})
	}
	
	return (
		<>
			{error && (
				<Alert severity="error">
				<AlertTitle>Error</AlertTitle>
				{error}
				</Alert>
			)}
			{records && (
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<BoldTableCell>ID</BoldTableCell>
								<BoldTableCell>Origination Time</BoldTableCell>
								<BoldTableCell>Cluster ID</BoldTableCell>
								<BoldTableCell>User ID</BoldTableCell>
								<BoldTableCell>Phone</BoldTableCell>
								<BoldTableCell>Voicemail</BoldTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{records.map((record) => (
								<TableRow key={record.id}>
									<TableCell>{record.id}</TableCell>
									<TableCell>{record.originationTime}</TableCell>
									<TableCell>{record.clusterId}</TableCell>
									<TableCell>{record.userId}</TableCell>
									<TableCell>{record.phone}</TableCell>
									<TableCell>{record.voicemail}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</>
	)
}

const BoldTableCell = styled(TableCell)`
  font-weight: bold;
`

export default RecordTable
