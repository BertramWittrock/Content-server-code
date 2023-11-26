async function fetchWithImport(url) {
    const fetch = (await import('node-fetch')).default;
    return fetch(url);
}

async function auth(req, res, next) {
    try {
        let token = req.headers.authorization;
        
        // Check if the Authorization header is in the correct format
        if (token && token.startsWith('Bearer ')) {
            // Extract the token part from the Authorization header
            token = token.slice(7, token.length);
        } else {
            // Handle the error if the token is not in the correct format
            return res.status(401).send('Bearer token not provided');
        }

        const url = `http://207.154.248.204/accessToken/${token}`;
        console.log(token); // This will now log just the token without 'Bearer'

        const response = await fetchWithImport(url);
        const data = await response.json();

        console.log(data);

        if (data == true) {
            res.status(401).send('Invalid or expired token');
        } else {
            next();
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error during authentication');
    }

    console.log("auth middleware");
}

module.exports = auth;
