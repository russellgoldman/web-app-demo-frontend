import dayjs, { Dayjs } from "dayjs"

export interface Record {
    id: string,
    originationTime: number,
    clusterId: string,
    userId: string,
    phone: string,
    voicemail: string,
}

export enum RecordSearchParam {
    none = 'none',
	phone = 'phone',
	voicemail = 'voicemail',
	userId = 'userId',
	clusterId = 'clusterId',
}

export class Epoch {
    static dateToEpoch(date: Dayjs | null): number | null {
        // Convert Dayjs to epoch in seconds if defined, otherwise null
        return date ? date.unix() : null
    }
    
    static epochToDate(epoch: number | null | undefined): Dayjs | null {
        // Convert epoch in seconds to Dayjs if defined, otherwise null
        return epoch ? dayjs.unix(epoch) : null
    }
}
