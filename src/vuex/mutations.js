import * as types from './mutation-type'

export default {
    [types.ADD_CROSSING](state, crossing) {
        state.crossing.push(crossing)
    },
    [types.SET_CROSSING](state, crossing) {
        state.crossing = crossing
    },
}
