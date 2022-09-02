export function abreviateMiddleName (fullName: string) {

    let answer:string[] = []

    fullName.split(' ').forEach((nome, index) => {

        if(index === 0) {
            return answer.push(`${nome} `)
        }

        if(index === fullName.length - 1) {
            return answer.push(`${nome}`)
        }

        if(nome[0] === "d") {
            return 
        }

        else {
            return answer.push(`${nome[0]} `)
        }

    })
    
    return answer.join('').toUpperCase()
}