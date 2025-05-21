import { Request, Response } from "express";
import { Author } from "../models/Author";
import { AuthenticatedRequest } from "../interfaces/author"; // Adjust the path as needed

/** ===============================
 *        CREATE AUTHOR
================================= */
export const createAuthor = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, bio, avatar } = req.body;

    const existing = email ? await Author.findOne({ email }) : null;
    if (existing) {
      res.status(400).json({ message: "Author with this email already exists." });
      return;
    }

    const newAuthor = await Author.create({
      name,
      email,
      bio,
      avatar,
      role: "author",
    });

    res.status(201).json({ message: "Author created successfully", author: newAuthor });
  } catch (error) {
    res.status(500).json({ message: "Error creating author", error });
  }
};

/** ===============================
 *        GET ALL AUTHORS
================================= */
export const getAllAuthors = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const authors = await Author.find();
    res.status(200).json(authors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching authors", error });
  }
};

/** ===============================
 *        GET SINGLE AUTHOR
================================= */
export const getAuthorById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) {
      res.status(404).json({ message: "Author not found" });
      return;
    }
    res.status(200).json(author);
  } catch (error) {
    res.status(500).json({ message: "Error fetching author", error });
  }
};

/** ===============================
 *        UPDATE AUTHOR
================================= */
export const updateAuthor = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, bio, avatar } = req.body;
    const updated = await Author.findByIdAndUpdate(
      req.params.id,
      { name, bio, avatar },
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ message: "Author not found" });
      return;
    }

    res.status(200).json({ message: "Author updated", author: updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating author", error });
  }
};

/** ===============================
 *        DELETE AUTHOR
================================= */
export const deleteAuthor = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deleted = await Author.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: "Author not found" });
      return;
    }
    res.status(200).json({ message: "Author deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting author", error });
  }
};

/** ===============================
 *        VERIFY AUTHOR
================================= */
export const verifyAuthor = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const author = await Author.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );

    if (!author) {
      res.status(404).json({ message: "Author not found" });
      return;
    }

    res.status(200).json({ message: "Author verified", author });
  } catch (error) {
    res.status(500).json({ message: "Error verifying author", error });
  }
};

/** ===============================
 *    GET CURRENT AUTHOR PROFILE
================================= */
export const getCurrentAuthorProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const authReq = req as AuthenticatedRequest;

  try {
    const author = await Author.findById(authReq.user?.id);
    if (!author) {
      res.status(404).json({ message: "Author not found" });
      return;
    }
    res.status(200).json(author);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error });
  }
};
