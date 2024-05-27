import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import User from '../../../../models/user';
import jwt from 'jsonwebtoken';

export async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            await connectMongoDB(); 

            const { displayName, pictureUrl, userId, email, password } = await req.json();

            const data = {
                name: userId,
                displayName: displayName,
                picture: pictureUrl,
            };

            if (email) data.email = email;
            if (password) data.password = password;

            let user = await User.findOneAndUpdate({ name: userId }, data, { new: true, upsert: true });
            if (user) {
                // console.log("userAndUpdate ", user);
            } else {
                user = new User(data);
                await user.save();
            }

            // let payload = {
            //     user
            // }
            // let token = await  jwt.sign(payload, "jwtsecret", {expiresIn: "1d"}, (err, token) => {
            //     if (err) {
            //         throw err;
            //     } 
            //     return NextResponse.json({ token, payload }); 
            // })

            let payload = { user };
    
            return new Promise((resolve, reject) => {
                jwt.sign(payload, "jwtsecret", { expiresIn: "1d" }, (err, token) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(NextResponse.json({ token, payload }));
                    }
                });
            });

            return NextResponse.json(payload); 
        } catch (error) {
            console.error(error);
            return NextResponse.json({ message: "An error occurred while creating the profile" }, { status: 500 });
        }
    } else if (req.method === 'GET') {
        try {
            await connectMongoDB();
            const usersWithDisplayName = await User.find({ displayName: { $exists: true }});
            console.log("usersWithDisplayName",usersWithDisplayName);
            
            return NextResponse.json(usersWithDisplayName);
        } catch (error) {
            console.error(error);
            return NextResponse.json({ message: "An error occurred while fetching the users" }, { status: 500 });
        }
    } else {
        return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
    }
}

export { handler as GET, handler as POST };
