const express = require("express")

const { getAllUrls, postLinks, postExternals, test} = require('../controllers/urls.controller');
const router = express.Router();

router.get("/urls/all", getAllUrls);
router.post('/urls/links', postLinks);
router.post('/urls/externals', postExternals);
router.post('/urls/test', test);
// router.post('/urls/checker',checker)

module.exports = router;