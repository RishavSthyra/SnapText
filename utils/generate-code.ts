export function generateCode() {

    const LENGTH_OF_GENERATED_CODE = 6;
    let GENERATED_STRING: string = ""

    for (let i = 0; i < LENGTH_OF_GENERATED_CODE; i++) {
        let num = Math.floor(Math.random() * 10)
        GENERATED_STRING = GENERATED_STRING + num;
    }

    return GENERATED_STRING

}