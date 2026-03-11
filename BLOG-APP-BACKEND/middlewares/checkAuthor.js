import { UserTypeModel } from '../models/UserModel.js';

export const checkAuthor = async (req, res, next) => {
    // get author id from body or params
    const aid = req.body?.author || req.params?.authorId;

    // SECURITY: Ensure the logged-in user is the same as the author ID provided
    if (req.user.role === "AUTHOR" && aid !== req.user.userId) {
        return res.status(403).json({ message: "Forbidden: You can only modify your own content" });
    }

    try {
        // verify author exists and is active
        let author = await UserTypeModel.findById(aid);
        if (!author) {
            return res.status(404).json({ message: "Invalid Author_Id: Account not found" });
        }
        if (author.role !== "AUTHOR") {
            return res.status(403).json({ message: "Access Denied: User is not registered as an author" });
        }
        if (author.isActive === false) {
            return res.status(403).json({ message: "Access Denied: Author account is deactivated" });
        }

        // call next middleware
        next();
    } catch (err) {
        next(err);
    }
}