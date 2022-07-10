import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface DeviceInfoInt {
    device_id: string
    is_active: boolean
}

const initialState = { device_id: "", is_active: false } as DeviceInfoInt

const deviceInfoSlice = createSlice({
    name: "DeviceInfo",
    initialState,
    reducers: {
        setDeviceId(state, action: PayloadAction<string>) {
            state.device_id = action.payload
        },
        setIsActive(state, action: PayloadAction<boolean>) {
            state.is_active = action.payload
        }
    }
})

export const { setDeviceId, setIsActive } = deviceInfoSlice.actions
export default deviceInfoSlice