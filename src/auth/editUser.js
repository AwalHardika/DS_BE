import { request, response } from "express";
import bcrypt from "bcryptjs";
import db from "../conn";
import path from "path";
import fs from "fs";

async function editUser(req = request, res = response) {
    try {
        const userId = req.userId
        const { username, email, password, imageProfile } = req.body;

        // Cari user berdasarkan ID
        const user = await db.user.findUnique({
            where: { id: userId }
        });

        let newImgProfile = user.imageProfile

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }
        let emailCase = email.toLowerCase()
        let passwordHash = user.password
        if (password) {
            passwordHash = await bcrypt.hash(password, 10)
        }
        // Validasi email baru jika berbeda dari email lama
        if (emailCase !== user.email) {
            const findUser = await db.user.findUnique({
                where: { email: emailCase }
            });

            if (findUser) {
                return res.status(400).json({
                    status: false,
                    message: "Email already exists"
                });
            }


        }



        // Update image profile jika diberikan
        if (imageProfile) {
            const mimeType = imageProfile.match(/data:(image\/\w+);base64,/);

            if (!mimeType) {
                return res.status(400).json({
                    status: false,
                    message: "Invalid image type"
                });
            }

            const mime = mimeType[1];
            const ekstensi = mime.split('/')[1];

            const base64data = imageProfile.replace(/^data:image\/\w+;base64,/, "");
            const buffer = Buffer.from(base64data, 'base64');

            const imagePath = path.join(__dirname, "../../uploads/profile", `${user.email}-profile.${ekstensi}`);
            const fileName = `${user.email}-profile.${ekstensi}`;

            // Hapus file lama jika ada
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }

            // Simpan file baru
            fs.writeFileSync(imagePath, buffer);

            newImgProfile = fileName;
        }

        // Simpan perubahan ke database
        const updatedUser = await db.user.update({
            where: { id: userId },
            data: {
                username,
                username,
                email: emailCase,
                password: passwordHash,
                imageProfile: newImgProfile
            }
        });

        res.status(200).json({
            status: true,
            message: "User updated successfully",
            data: updatedUser
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: "Internal server error",
            error
        });
    }
}

export {
    editUser
};
