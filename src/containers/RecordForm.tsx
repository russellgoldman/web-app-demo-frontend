import { useState, FormEvent } from 'react';
import { Alert, AlertTitle, Box, Button, Paper, Typography } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Epoch, RecordSearchParam } from '../common';
import RecordTable from '../components/RecordTable';
import { Dayjs } from 'dayjs';

interface RecordFormData {
  startEpoch: number | null,
  endEpoch: number | null,
  recordSearchParam?: RecordSearchParam | null,
  recordSearchValue?: string | null,
}
interface RecordFormError {
  startEpoch: string | null,
  endEpoch: string | null
}
const RecordForm = () => {
  const [formData, setFormData] = useState<RecordFormData>({
    startEpoch: null,
    endEpoch: null,
    recordSearchParam: null,
    recordSearchValue: null,
  })
  const [formError, setFormError] = useState<RecordFormError>({
    startEpoch: null,
    endEpoch: null,
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleStartDateChange = (startDate: Dayjs | null) => {
    const startEpoch = Epoch.dateToEpoch(startDate)
    setFormData({ ...formData, startEpoch })
    setFormError({ ...formError, startEpoch: null })
    setIsSubmitted(false)
  }

  const handleEndDateChange = (endDate: Dayjs | null) => {
    const endEpoch = Epoch.dateToEpoch(endDate);
    setFormData({ ...formData, endEpoch })
    setFormError({ ...formError, endEpoch: null })
    setIsSubmitted(false)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    let formHasErrors = false
    const newFormError: RecordFormError = {
      startEpoch: null,
      endEpoch: null,
    }

    if (formData.startEpoch == null) {
      newFormError.startEpoch = 'Start DateTime is a required field'
      formHasErrors = true
    }
    if (formData.endEpoch == null) {
      newFormError.endEpoch = 'End DateTime is a required field'
      formHasErrors = true
    }
    if (formData.startEpoch && formData.endEpoch && formData.startEpoch >= formData.endEpoch) {
      newFormError.startEpoch = 'Start DateTime must take place before the End DateTime.'
      newFormError.endEpoch = 'End DateTime must take place after the Start DateTime.'
      formHasErrors = true
    }

    setFormError(newFormError)

    if (formHasErrors) {
      setIsSubmitted(false)
      setSubmitError('Please correct the listed errors and try again')
      return
    } else {
      setIsSubmitted(true)
      setSubmitError(null)
    }
  }

  return (
    <>
      <Paper elevation={3} sx={{ padding: 2, margin: 2 }}>
        <Typography variant="h6" gutterBottom>
          Search Records
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            component="form"
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            onSubmit={handleSubmit}
          >
            <DateTimePicker
              label="Start DateTime"
              value={Epoch.epochToDate(formData.startEpoch)}
              onChange={handleStartDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: formError.startEpoch !== '' && formError.startEpoch !== null,
                  helperText: formError.startEpoch,
                }
              }}
            />
            <DateTimePicker
              label="End DateTime"
              value={Epoch.epochToDate(formData.endEpoch)}
              onChange={handleEndDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: formError.endEpoch !== '' && formError.endEpoch !== null,
                  helperText: formError.endEpoch,
                }
              }}
            />
            <Button type="submit" variant="contained" color="primary">
                Submit
            </Button>
            {submitError && (
              <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                {submitError}
              </Alert>
            )}
          </Box>
        </LocalizationProvider>
      </Paper>
      {isSubmitted && formData.startEpoch && formData.endEpoch &&
        <RecordTable
          startEpoch={formData.startEpoch}
          endEpoch={formData.endEpoch}
        />
      }
    </>
  )
}

export default RecordForm
