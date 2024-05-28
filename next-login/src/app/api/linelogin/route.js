import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import User from '../../../../models/user';
import jwt from 'jsonwebtoken';

export async function loginLine(req) {
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
            } else {
                user = new User(data);
                await user.save();
            }
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

        } catch (error) {
            console.error(error);
            return NextResponse.json({ message: "An error occurred while creating the profile" }, { status: 500 });
        }
    } else if (req.method === 'GET') {
        try {
            await connectMongoDB();
            const usersWithDisplayName = await User.find({ displayName: { $exists: true }});
            
            return NextResponse.json(usersWithDisplayName);
        } catch (error) {
            console.error(error);
            return NextResponse.json({ message: "An error occurred while fetching the users" }, { status: 500 });
        }
    } else {
        return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
    }
}

export { loginLine as GET, loginLine as POST };
