import axios from 'axios'

const baseUrl = 'http://localhost:3000/students'

export const getStudents = async () => {
    const response = await axios.get(baseUrl)
    console.log(response.data)
    return response.data
}
