import { Webhook } from 'svix';
import User from "../models/User.js"

// API Controller Function to Manage Clerk User with database

export const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
        const payload = req.body instanceof Buffer ? req.body.toString('utf8') : JSON.stringify(req.body);
        await whook.verify(payload, {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        })

        const body = typeof payload === 'string' ? JSON.parse(payload) : req.body;
        const { data, type } = body

        switch (type) {
            case 'user.created': {
                const userData = {
                    _id: data.id,
                    email: data.email_address[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imageUrl: data.image_url,
                }
                await User.create(userData)
                res.status(201).json({
                    message: "User Created Successfully",
                    success: true,
                })
                break
            }

            case 'user.updated': {
                const userData ={
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imageUrl: data.image_url,
                }
                await User.findByIdAndUpdate(data.id, userData)
                res.status(200).json({
                    message: "User Updated Successfully",
                    success: true,
                })
                break;
            }

            case 'user.deleted': {
                await User.findByIdAndDelete(data.id)
                res.status(200).json({
                    message: "User Deleted Successfully",
                    success: true,
                })
                break;
            }

            default:
                res.status(400).json({
                    message: "Invalid Webhook Type",
                    success: false,
                })
        }
    } catch (error) {
        res.json({success : false, message: error.message})
    }
}