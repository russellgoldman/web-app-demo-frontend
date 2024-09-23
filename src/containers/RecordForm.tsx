import { useState, FormEvent } from 'react';
import { Alert, AlertTitle, Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Epoch, RecordSearchParam } from '../common';
import RecordTable from '../components/RecordTable';
import { Dayjs } from 'dayjs';

interface RecordFormData {
  startEpoch: number | null,
  endEpoch: number | null,
  recordSearchParam: RecordSearchParam,
  recordSearchValue: string,
}
interface RecordFormError {
  startEpoch: string | null,
  endEpoch: string | null,
  recordSearchValue: string | null,
}
const RecordForm = () => {
  const [formData, setFormData] = useState<RecordFormData>({
    startEpoch: null,
    endEpoch: null,
    recordSearchParam: RecordSearchParam.none,
    recordSearchValue: '',
  })
  const [formError, setFormError] = useState<RecordFormError>({
    startEpoch: null,
    endEpoch: null,
    recordSearchValue: null,
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

  const handleDropdownChange = (event: SelectChangeEvent<RecordSearchParam>) => {
    setFormData({ ...formData, recordSearchParam: event.target.value as RecordSearchParam })
    setIsSubmitted(false)
  }

  const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, recordSearchValue: event.target.value })
    setFormError({ ...formError, recordSearchValue: null })
    setIsSubmitted(false)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    let formHasErrors = false
    const newFormError: RecordFormError = {
      startEpoch: null,
      endEpoch: null,
      recordSearchValue: null,
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

    if (formData.recordSearchParam !== RecordSearchParam.none && formData.recordSearchValue === '') {
      newFormError.recordSearchValue = 'Search Value must have a value if Search Parameter is not None'
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
              label="Start DateTime *"
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
              label="End DateTime *"
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
            <FormControl fullWidth>
              <InputLabel id="record-search-param-label">Search Parameter</InputLabel>
              <Select
                labelId="record-search-param-label"
                value={formData.recordSearchParam}
                onChange={handleDropdownChange}
                label="Search Parameter"
              >
                <MenuItem value={`${RecordSearchParam.none}`}>None</MenuItem>
                <MenuItem value={`${RecordSearchParam.clusterId}`}>Cluster ID</MenuItem>
                <MenuItem value={`${RecordSearchParam.userId}`}>User ID</MenuItem>
                <MenuItem value={`${RecordSearchParam.phone}`}>Phone</MenuItem>
                <MenuItem value={`${RecordSearchParam.voicemail}`}>Voicemail</MenuItem>
              </Select>
            </FormControl>
            {formData.recordSearchParam !== RecordSearchParam.none && (
              <TextField
                label="Search Value"
                value={formData.recordSearchValue}
                onChange={handleTextFieldChange}
                fullWidth
                error={formError.recordSearchValue !== '' && formError.recordSearchValue !== null}
                helperText={formError.recordSearchValue}
              />
            )}
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
      {isSubmitted && formData.startEpoch && formData.endEpoch && (
        <RecordTable
          startEpoch={formData.startEpoch}
          endEpoch={formData.endEpoch}
          recordSearchParam={formData.recordSearchParam}
          recordSearchValue={formData.recordSearchValue}
        />
      )}
    </>
  )
}

export default RecordForm
