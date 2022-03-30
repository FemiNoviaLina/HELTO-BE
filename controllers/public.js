import { supabase } from "../index.js"
import { statusCode } from "../helpers/constant.js"

export const getStaticFile = async (req, res) => {
    const filename = req.params.filename
    const { data, error } = await supabase.storage.from('helto-storage').download('public/'  + filename)
    if(error) return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, 'Tidak dapat menghubungi storage'))
    
    const buffer = Buffer.from( await data.arrayBuffer(), 'base64')
    const contentType = filename.split('.').pop() == 'jpg' ? 'jpeg' :  filename.split('.').pop();
    res.header('Content-Type', 'image/' + contentType)
    res.send(buffer)
} 