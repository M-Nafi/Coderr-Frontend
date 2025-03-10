function getGreetingBoxTemplate(name){
    if (!name ) {
        return `
            <div>
                Es ist ein Fehler aufgetreten
            </div>`;
    }
    return `<h1 class="font_prime_color">Hallo ${name},</h1>
            <h1 class="font_white_color">schön, dass du wieder da bist!</h1>`
}