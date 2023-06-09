const User = require('../models/user');
const Friendship = require('../models/friendship');

module.exports.toggleUser = async function (req, res) {

    try {
        let toggledUser = await User.findById(req.query.userID).populate('friendships');
        let ourUser = await User.findById(req.user._id).populate('friendships'); 

        
        //if there is a user who we wish to be be friend 
        if(toggledUser){

            let friendshipStatus;

            let friendship_op1 = await Friendship.findOne({
                from_user : req.user._id,
                to_user : req.query.userID 
            })

            let friendship_op2 = await Friendship.findOne({
                from_user : req.query.userID ,
                to_user :  req.user._id
            })

            // console.log("********************* friendship1", friendship_op1)
            // console.log("********************* friendship2", friendship_op2)

            if(friendship_op1){

                //we remove the friedship from both of their arrays of frinds
                await toggledUser.friendships.pull(friendship_op1._id);
                await toggledUser.save();
                await ourUser.friendships.pull(friendship_op1._id);
                await ourUser.save();
                await friendship_op1.deleteOne();   
                friendshipStatus = false;

            }else if(friendship_op2){

                await toggledUser.friendships.pull(friendship_op2._id);
                await toggledUser.save();
                await ourUser.friendships.pull(friendship_op2._id);
                await ourUser.save();
                await friendship_op2.deleteOne();
                friendshipStatus = false;

            } else{

                let newFriendship = await Friendship.create({
                    from_user : req.user._id,
                    to_user :  req.query.userID
                });

                toggledUser.friendships.push(newFriendship._id);
                ourUser.friendships.push(newFriendship._id);

                toggledUser.save();
                ourUser.save();
                friendshipStatus = true;

            }

            return res.json(200, {
                message: "Request Successfull!",
                data: {
                    friendshipStatus: friendshipStatus
                }
            })

        }

        // req.flash('success' , 'Friend Updated !');
        // return res.redirect('back');

    } catch (err) {

        // console.log("ERROR : " , err);
        // req.flash('error' , "Cant Add / Remove Friend !");
        // return res.redirect('back');
        console.log(err);
        console.log("Error Toggling Fried")
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }

}