import { http } from '@/utils'
import { makeAutoObservable } from 'mobx'

class ChannelStore {
    ChannelList = []
    constructor() {
        makeAutoObservable(this)
    }

    loadChannelList = async () => {
        const res = await http.get('/channels')
        this.ChannelList = res.data.data.channels
    }
}

export default ChannelStore