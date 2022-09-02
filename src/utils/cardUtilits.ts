export function abreviateMiddleName (fullName: string) {

    let answer:string[] = []
    const cardholderName = fullName.split(' ')

    cardholderName.forEach((nome, index) => {

        if(index === 0) {
            return answer.push(`${nome} `)
        }

        if(index === cardholderName.length - 1) {
            return answer.push(`${nome}`)
        }

        if(nome.length < 3) {
            return 
        }

        else {
            return answer.push(`${nome[0]} `)
        }

    })
    
    return answer.join('').toUpperCase()
}