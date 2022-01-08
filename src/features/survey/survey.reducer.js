import { API, STATUS, setEndpoint } from "../freelances/freelances.reducer"
import { createSlice } from "@reduxjs/toolkit"
import { selectSurvey } from "../../common/utils/selector"

//slice
const { actions, reducer } = createSlice({
    name: 'survey',
    initialState: {
        status: STATUS[0],
        data: null,
        error: null
    },
    reducers: {
        fetchingSurvey: (draft, action) => {
            const currentStatus = draft.status
            // status state must be on void or error or resolved
            // status is on void : set it to pending
            if (currentStatus === STATUS[0])
                draft.status = STATUS[1]
            // status is on error : reset error and set it to pending
            else if (currentStatus === STATUS[3]) {
                draft.error = null
                draft.status = STATUS[1]
            } //status is on resolved : set it to updating
            else if (currentStatus === STATUS[2])
                draft.status = STATUS[4]
            return
        },
        resolvingSurvey: (draft, action) => {
            // status must be on pending or updating
            if ([STATUS[1], STATUS[4]].indexOf(draft.status) >= 0) {
                draft.status = STATUS[2]
                draft.data = action.payload
            }
            return
        },
        rejectingSurvey: (draft, action) => {
            // status must be on pending or updating
            if ([STATUS[1], STATUS[4]].indexOf(draft.status) >= 0) {
                draft.status = STATUS[2]
                draft.data = null
                draft.error = action.payload
            }
            return
        }
    }
})
//actions
const { fetchingSurvey, resolvingSurvey, rejectingSurvey } = actions
//thunk
export const fetchSurvey = (dispatch, getState) => {
    const status = selectSurvey(getState()).status
    if ([STATUS[1], STATUS[4]].indexOf(status) >= 0) return
    const endpoint = setEndpoint(API.SERVER, '/survey')
    dispatch(fetchingSurvey())
    try {
        fetch(endpoint)
            .then(response => response.json())
            .then(data => dispatch(resolvingSurvey(data)))
    } catch (error) {
        dispatch(rejectingSurvey(error))
    }
}

//reducer
export default reducer