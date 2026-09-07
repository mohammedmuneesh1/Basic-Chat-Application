import express, { Request, Response } from 'express'
import { checkUserAuth } from '../../middleware/customMiddleware/userAuth';
import { searchUserProfile } from './controller';
import tryCatch from '../../middleware/customMiddleware/tryCatch';

export const router = express.Router();


// router.route('/search/profile').
// get((req:Request,res:Response)=>{
//      console.log('erquest here.')

//     res.status(200)
// });
router.route('/search/profile').get(checkUserAuth,tryCatch(searchUserProfile));



// router.route('/search/profile').get(tryCatch(searchUserProfile));
