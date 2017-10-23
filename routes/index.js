const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');

router.use( function( req, res, next ) {
    // this middleware will call for each requested
    // and we checked for the requested query properties
    // if _method was existed
    // then we know, clients need to call DELETE request instead
    if ( req.query._method == 'DELETE' ) {
        // change the original METHOD
        // into DELETE method
        req.method = 'DELETE';
        // and set requested url to /user/12
        req.url = req.path;
    }
    else if ( req.query._method == 'UPDATE' ) {
        // change the original METHOD
        // into DELETE method
        req.method = 'PUT';
        // and set requested url to /user/12
        req.url = req.path;
    }
    next();
});

// Do work here
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/add', authController.isLoggedIn, storeController.addStore);

router.post('/add',
    storeController.upload,
    catchErrors(storeController.resize),
    catchErrors(storeController.createStore)
);
router.post('/add/:id',
    storeController.upload,
    catchErrors(storeController.resize),
    catchErrors(storeController.updateStore)
);
/*router.put('/store/:id', async (req, res) => {
    res.status(200).end();
});*/
/*router.delete('/store/:id', async (req, res) => {
    res.status(200).end();
});*/
/*router.post('/store', async (req, res) => {
    //res.send('hi');
    res.status(201).end();
    //res.header(store);
});*/
router.get('/store/:id/edit', catchErrors(storeController.editStore));

//routing to updated store
router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));

router.get('/tags', catchErrors(storeController.getStoresByTags));
router.get('/tags/:tag', catchErrors(storeController.getStoresByTags));

router.get('/login', userController.loginForm);
router.post('/login', authController.login);

router.get('/register', userController.registerForm);

router.delete('/store/:id', catchErrors(storeController.deleteStore));
// 1. Validate the registration data
// 2. register the user
// 3. we need to log them in
router.post('/register',
    userController.validateRegister,
    userController.register,
    authController.login
);
router.get('/logout', authController.logout);


router.get('/account', authController.isLoggedIn, userController.account);
router.post('/account', catchErrors(userController.updateAccount));
router.post('/account/forgot', authController.forgot);
router.get('/account/reset/:token', catchErrors(authController.reset));
router.post('/account/reset/:token',
    authController.confirmedPasswords,
    catchErrors(authController.update));


/*
    API
 */

router.get('/api/search', catchErrors(storeController.searchStores));

module.exports = router;
