import Axios from "axios"
const token = localStorage.getItem("token")
 
export const me = async () => {
  //await delay(500)
  const result = await Axios.get(
    ` http://localhost:8000/getMe/${token}`
  )
  return result.data.user
}