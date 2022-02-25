const expressJwt = require('express-jwt');

module.exports = jwt;

function jwt() {
    //console.log(process.env.SECRET)
    return expressJwt({ secret: process.env.SECRET, algorithms: ['sha1', 'RS256', 'HS256'], }
    ).unless({
        path: [
            // public routes that don't require authentication
            '/api/users/authenticate/',
            /\/api\/assembly\/download\/.+/ig,
            /\/api\/assembly\/image\/.+/ig,
            /\/api\/assembly\/edrawing\/.+/ig,
            /\/api\/assembly\/pdf\/.+/ig,
            /\/api\/part\/download\/.+/ig,
            /\/api\/part\/image\/.+/ig,
            /\/api\/part\/edrawing\/.+/ig,
            /\/api\/part\/pdf\/.+/ig,
            /\/api\/bom\/excel\/.+/ig,
            /\/api\/bom\/drawings\/.+/ig,
            /\/api\/bom\/labels\/.+/ig,
            /\/api\/bom\/sustainability\/.+/ig
        ]
    });
}
