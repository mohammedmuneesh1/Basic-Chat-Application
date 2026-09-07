import express from 'express'
import { accessChatOneToOne, AddMembersToGroup, createGroupChat, fetchAllUserByIdChats, getChatById, removeMembersFromGroup, renameGroupChat, } from './controller';
import tryCatch from '../../middleware/customMiddleware/tryCatch';
import { checkUserAuth } from '../../middleware/customMiddleware/userAuth';


export const router = express.Router();

//-------------------  WE WILL GET ALL THE USER BY ID CHATS ---------------------------------------
router.route('/').get(checkUserAuth,tryCatch(fetchAllUserByIdChats));  // fetching user all chats;
// router.route('/').get(checkUserAuth,tryCatch(fetchAllUserByIdChats));  // fetching user all chats;
//-------------------  API FOR ACCESSING ONE TO ONE CHAT OR CREATE ONE TO ONE IF NOT EXIST ---------------------------------------
router.route('/one-to-one').post(checkUserAuth,tryCatch( accessChatOneToOne)); //  which will be for acessing chat or creating chat 
//------------------- API FOR CREATING GROUP CHAT -------------------
router.route('/group').post(checkUserAuth,tryCatch(createGroupChat));
//------------------- RENAMING GROUP CHAT -------------------
router.route('/group/rename').put(checkUserAuth,tryCatch(renameGroupChat));
//------------------- ADD MEMBERS TO GROUP -------------------
router.route('/group/members/add').put(checkUserAuth,tryCatch(AddMembersToGroup));
//------------------- REMOVE MEMBERS TO GROUP -------------------
router.route('/group/members/remove').put(checkUserAuth,tryCatch(removeMembersFromGroup));
//------------------- FETCH CHAT BY ID -------------------
router.route('/:chatId').get(checkUserAuth, tryCatch(getChatById));








// router.route('/:id').get(checkUserAuth,tryCatch(GET_CHAT_BY_ID)); // get all the chat from database for that particular database
//router.route('/group').get(checkUserAuth,tryCatch(CREATE_GROUP_CHAT))  // creation of group
// router.route("/rename").put(checkUserAuth,tryCatch(renameGroup)); // API FOR RENAMING THE GROUP
//router.route("/groupadd").put(checkUserAuth,addToGroup); // API FOR ADDING USER IN GROUP



// router.route('/:id').get(tryCatch(GET_CHAT_BY_ID));



