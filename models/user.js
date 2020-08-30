var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');


var userSchema = new Schema(
	{
		firstName: {
			type: String,
			required: true,
			minlength: 4,
        },

        lastName: {
			type: String,
			required: true,
			minlength: 4,
        },
    
		email: {
			type: String,
			unique: true,
			required: true,
			match: /@/,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
		userType:{
			type:String,
			required:true
		}
	},
	{ timestamps: true }
);

userSchema.pre('save', function (next) {
	if (this.password && this.isModified('password')) {
		this.password = bcrypt.hashSync(this.password, 10);
	}
	next();
});

userSchema.methods.verifyPassword = function (password) {
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);