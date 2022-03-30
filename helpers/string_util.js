const getUsername = email => {
    return email.split('@')[0]
}

const getKey = (length = 5) => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

const toDate = date => {
    const [day, month, year] = date.split("-")
    return new Date(year, month - 1, parseInt(day) + 1).toISOString().toLocaleString('zh-TW')
}

export { getUsername, getKey, toDate }