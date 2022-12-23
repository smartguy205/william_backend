const getUniqueCode = (size) => {
    const MASK = 0x3d
    const LETTERS = 'abcdefghijklmnopqrstuvwxyz'
    const NUMBERS = '1234567890'
    const charset = `${NUMBERS}${LETTERS}${LETTERS.toUpperCase()}_-`.split('')

    let uniqueCode = ""
    for(let i=0; i<8; i++){
        uniqueCode += charset[Math.floor(Math.random() * charset.length)]
    }
    return uniqueCode
}

export default getUniqueCode;
