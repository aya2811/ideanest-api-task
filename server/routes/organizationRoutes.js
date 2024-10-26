const express = require('express');
const router = express.Router();
const { 
  getAllOrganizations,
  getOrganization,
  createOrganization,
  updateOrganization,
  deleteOrganization, 
  inviteUser} = require('../controller/organizationController');
const { verifyToken } = require('../config/isAuth');

router.get('/', verifyToken, getAllOrganizations);
router.get('/:id', verifyToken, getOrganization);
router.post('/', verifyToken, createOrganization);
router.put('/:id', verifyToken, updateOrganization);
router.delete('/:id', verifyToken, deleteOrganization);
router.post('/:id/invite', verifyToken, inviteUser)

module.exports = router;