const Organization = require('../models/organization');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN
    }
});


exports.getAllOrganizations = async (req, res) => {
    try {
        await Organization
        .find()
        .populate('organization_members')
        .then(organizations => {
            res.json(organizations)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getOrganization = async (req, res) => {
    try {
        const organization = await Organization.findById(req.params.id);
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }
        await organization
        .populate('organization_members','name email access_level -_id')
        .then(organization => {
            res.json(organization)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createOrganization = async (req, res) => {
    
    const organization = new Organization({
        name: req.body.name,
        description: req.body.description
        });
    try {
        const newOrganization = await organization.save();
        res.status(201).json({organization_id:newOrganization._id});
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteOrganization = async (req, res) => {
    try {
        const organization = await Organization.findById(req.params.id);
        if (!organization) {
        return res.status(404).json({ message: 'Organization not found' });
        }
        await organization.deleteOne();
        res.json({ message: 'Organization deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
  
exports.updateOrganization = async (req, res) => {
    try {
        const organization = await Organization.findById(req.params.id);
        if (!organization) {
        return res.status(404).json({ message: 'Organization not found' });
        }
        const newOrganization = await Organization.findByIdAndUpdate(req.params.id, req.body, { new: true });

        res.json({  organization_id: newOrganization._id,
                    name: newOrganization.name,
                    description: newOrganization.description});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.inviteUser = async (req,res) => {
    try{
        const organization = await Organization.findById(req.params.id);
        if (!organization) {
        return res.status(404).json({ message: 'Organization not found' });
        }

        var mailOptions = {
            from: process.env.EMAIL,
            to: req.body.user_email,
            subject: 'Invitation to an Organization',
            text: 'Hey, Here is an invitation to join an Organization'
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Email sent: ' + info.response });
            }
          });

    } catch(err) {
        res.status(500).json({ message: err.message });
    }
}