import express from 'express'
import { checkUserAuth } from '../../middleware/customMiddleware/userAuth';
import { GET_MESSAGES_BY_CHAT_ID_FN, SEND_MESSAGE_FN } from './controller';
import tryCatch from '../../middleware/customMiddleware/tryCatch';


export const router = express.Router();


//SENDING MESSAGES BY CHAT ID ON BODY
router.route('/').post(checkUserAuth,tryCatch(SEND_MESSAGE_FN));
//SENDING MESSAGES BY CHAT ID ON BODY
router.route('/:chatId').get(checkUserAuth,tryCatch(GET_MESSAGES_BY_CHAT_ID_FN))

