import { Request, Response } from 'express'
import User, { IUser, UserRole } from '../models/User'
import mongoose from 'mongoose'
import crypto from 'crypto'

const ITEMS_PER_PAGE = 20

// Get paginated list of users (admin only)
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const roleFilter = req.query.role as UserRole | undefined

    const query: any = {}
    if (roleFilter) query.role = roleFilter

    const totalUsers = await User.countDocuments(query)
    const users = await User.find(query)
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .select('-password -refreshToken -resetPasswordToken -verificationToken') // don't send sensitive info
      .sort({ createdAt: -1 })

    res.status(200).json({
      data: users,
      page,
      totalPages: Math.ceil(totalUsers / ITEMS_PER_PAGE),
      totalUsers,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch users.' })
  }
}

// Get single user by ID
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: 'Invalid user ID.' })
      return
    }

    const user = await User.findById(userId).select(
      '-password -refreshToken -resetPasswordToken -verificationToken'
    )
    if (!user) {
      res.status(404).json({ message: 'User not found.' })
      return
    }

    res.status(200).json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch user.' })
  }
}

// Update user (role, isActive, name, email etc.)
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params
    const { name, email, role, isActive } = req.body

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: 'Invalid user ID.' })
      return
    }

    // Validate role if provided
    if (role && !Object.values(UserRole).includes(role)) {
      res.status(400).json({ message: 'Invalid user role.' })
      return
    }

    const updateData: Partial<IUser> = {}
    if (name) updateData.name = name
    if (email) updateData.email = email.toLowerCase()
    if (role) updateData.role = role
    if (typeof isActive === 'boolean') updateData.isActive = isActive

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select('-password -refreshToken -resetPasswordToken -verificationToken')
    if (!updatedUser) {
      res.status(404).json({ message: 'User not found.' })
      return
    }

    res.status(200).json(updatedUser)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to update user.' })
  }
}

// Delete user (or soft delete by setting isActive = false)
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: 'Invalid user ID.' })
      return
    }

    // Option 1: Hard delete
    // const deletedUser = await User.findByIdAndDelete(userId);

    // Option 2: Soft delete by deactivating account
    const deletedUser = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    )

    if (!deletedUser) {
      res.status(404).json({ message: 'User not found.' })
      return
    }

    res.status(200).json({ message: 'User deactivated successfully.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to deactivate user.' })
  }
}

// Lock user account manually (admin can lock user)
export const lockUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: 'Invalid user ID.' })
      return
    }

    const lockUntil = new Date(Date.now() + 15 * 60 * 1000) // Lock for 15 minutes

    const user = await User.findByIdAndUpdate(
      userId,
      { lockUntil, failedLoginAttempts: 5 },
      { new: true }
    )

    if (!user) {
      res.status(404).json({ message: 'User not found.' })
      return
    }

    res.status(200).json({ message: 'User account locked.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to lock user.' })
  }
}

// Unlock user account manually (admin can unlock user)
export const unlockUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: 'Invalid user ID.' })
      return
    }

    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({ message: 'User not found.' })
      return
    }

    // Use your model method or reset here
    await user.resetFailedLogins()

    res.status(200).json({ message: 'User account unlocked.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to unlock user.' })
  }
}

// Admin initiated password reset (generate reset token and send email)
export const adminResetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: 'Invalid user ID.' })
      return
    }

    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({ message: 'User not found.' })
      return
    }

    // Generate a reset token (random string)
    const resetToken = crypto.randomBytes(32).toString('hex')

    // Set reset token and expiry (e.g. 1 hour)
    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000)
    await user.save()

    // TODO: Send email with resetToken link to user.email

    res.status(200).json({
      message: 'Password reset token generated and email sent (simulate).',
      resetToken, // for testing purposes; remove in production
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to generate reset token.' })
  }
}

// Search users by email or name
export const searchUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { query } = req.query
    if (!query || typeof query !== 'string') {
      res.status(400).json({ message: 'Query parameter required.' })
      return
    }

    // Simple case-insensitive search for email or name
    const regex = new RegExp(query, 'i')

    const users = await User.find({
      $or: [{ email: regex }, { name: regex }],
    })
      .limit(50)
      .select('-password -refreshToken -resetPasswordToken -verificationToken')

    res.status(200).json({ results: users })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Search failed.' })
  }
}

// Reactivate a deactivated user account
export const reactivateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: 'Invalid user ID.' })
      return
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: true },
      { new: true }
    )

    if (!user) {
      res.status(404).json({ message: 'User not found.' })
      return
    }

    res.status(200).json({ message: 'User account reactivated.', user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to reactivate user.' })
  }
}

// Promote a user to Manager role
export const promoteToManager = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: 'Invalid user ID.' })
      return
    }

    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({ message: 'User not found.' })
      return
    }

    user.role = UserRole.MANAGER
    await user.save()

    res.status(200).json({ message: 'User promoted to Manager.', user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to promote user.' })
  }
}
