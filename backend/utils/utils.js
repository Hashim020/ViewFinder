function generateRandomUsername(inputString) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let username = '';

    username += inputString.replace(/\s/g, '');

    while (username.length < 10) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        username += characters.charAt(randomIndex);
    }

    username = username.slice(0, 10);

    return username;
}


export{
    generateRandomUsername,
}