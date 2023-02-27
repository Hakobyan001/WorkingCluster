const express = require("express")

const {  test,addLinks,deleteUrls,addChange ,getLiveUrls,getCrawled, fullOnlyStatus,getFailed, getCrawledById, getCrawledLinksCountById} = require('../controllers/urls.controller');
const router = express.Router();

router.get('/urls/live',getLiveUrls)
router.post('/urls/links', addLinks);
router.post('/urls/test',test);
router.delete('/urls',deleteUrls);
router.get('/urls/crawled',getCrawled)
router.get('/urls/crawled/:id',getCrawledById)
router.get('/urls/crawled/count/links/:id',getCrawledLinksCountById)
router.get('/urls/getFailed',getFailed)
router.post('/urls/freeRequest', fullOnlyStatus)
router.post('/urls/change', addChange)

module.exports = router;