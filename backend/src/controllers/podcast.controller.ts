import Podcast, { IPodcast } from '../models/Podcast'
import Episode from '../models/Episode'
import { Request, Response, NextFunction } from 'express'
import mongoose, { Types } from 'mongoose'
import { uploadMedia, CloudinaryUploadResult } from '../utils/uploadMedia'
import { z } from 'zod'
import logger from '../utils/logger'
import { Category } from '../models/Category'
// import "../types/express";

const createPodcastSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(1, 'Description is required'),
  category: z.string().refine((val) => mongoose.isValidObjectId(val), {
    message: 'Invalid category ID',
  }),
  station: z
    .string()
    .refine((val) => !val || mongoose.isValidObjectId(val), {
      message: 'Invalid station ID',
    })
    .optional(),
  coverImage: z.string().optional(),
})

const updatePodcastSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).optional(),
  category: z
    .string()
    .refine((val) => !val || mongoose.isValidObjectId(val), {
      message: 'Invalid category ID',
    })
    .optional(),
  station: z
    .string()
    .refine((val) => !val || mongoose.isValidObjectId(val), {
      message: 'Invalid station ID',
    })
    .optional(),
  coverImage: z.string().optional(),
})

export const createPodcast = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validatedData = createPodcastSchema.parse(req.body)

    const category = await Category.findById(validatedData.category)
    if (!category || category.categoryType !== 'podcast') {
      res
        .status(400)
        .json({ error: 'Invalid or non-podcast category selected' })
      return
    }

    let uploadedCoverImage: string | undefined = validatedData.coverImage
    if (req.file) {
      const uploaded = (await uploadMedia(
        req.file,
        'podcasts/covers'
      )) as CloudinaryUploadResult
      uploadedCoverImage = uploaded.secure_url
    } else if (validatedData.coverImage?.startsWith('data:')) {
      const uploaded = (await uploadMedia(
        validatedData.coverImage,
        'podcasts/covers'
      )) as CloudinaryUploadResult
      uploadedCoverImage = uploaded.secure_url
    }
    if (
      !validatedData.station ||
      !mongoose.Types.ObjectId.isValid(validatedData.station)
    ) {
       res.status(400).json({ error: 'Invalid or missing station ID' })
       return
    }

    const userId = req.user?.id;
    if (!userId) {
       res.status(401).json({ error: 'User not authenticated' })
       return
    }

    const podcast = await Podcast.create({
      ...validatedData,
      coverImage: uploadedCoverImage || '',
    })

    logger.info({
      message: 'Podcast created',
      podcastId: podcast._id,
      title: validatedData.title,
    })

    res.status(201).json({ message: 'Podcast created successfully', podcast })
  } catch (error) {
    console.error('Error creating podcast:', error)
    res.status(500).json({ error: 'Failed to create podcast' })
  }
}

export const getAllPodcasts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category, page = '1', limit = '10', search } = req.query
    const query: any = {}

    if (category && mongoose.isValidObjectId(category)) {
      query.category = new Types.ObjectId(category as string)
    }
    if (search) {
      query.title = { $regex: search as string, $options: 'i' }
    }

    const pageNum = parseInt(page as string, 10)
    const limitNum = parseInt(limit as string, 10)

    const podcasts = await Podcast.find(query)
      .select(
        'title description coverImage station category createdBy isActive'
      )
      .populate('createdBy', 'name')
      .populate('station', 'name')
      .populate('category', 'name')
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean()

    const total = await Podcast.countDocuments(query)

    res.status(200).json({
      podcasts,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    })
  } catch (error) {
    console.error('Error fetching podcasts:', error)
    res.status(500).json({ error: 'Failed to fetch podcasts' })
  }
}

export const getPodcastById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ error: 'Invalid podcast ID' })
      return
    }

    const podcast = await Podcast.findById(id)
      .select(
        'title description coverImage station category createdBy episodes isActive'
      )
      .populate('createdBy', 'name')
      .populate('station', 'name')
      .populate('category', 'name')
      .populate({
        path: 'episodes',
        select:
          'title description audioUrl duration publishedDate isActive episodeNumber tags',
      })
      .lean()

    if (!podcast) {
      res.status(404).json({ error: 'Podcast not found' })
      return
    }

    res.status(200).json(podcast)
  } catch (error) {
    console.error('Error fetching podcast:', error)
    res.status(500).json({ error: 'Failed to fetch podcast' })
  }
}

export const updatePodcast = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const validatedData = updatePodcastSchema.parse(req.body)

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ error: 'Invalid podcast ID' })
      return
    }

    const podcast = (await Podcast.findById(id)) as IPodcast | null
    if (!podcast) {
      res.status(404).json({ error: 'Podcast not found' })
      return
    }

    let uploadedCoverImage: string | undefined = validatedData.coverImage
    if (req.file) {
      const uploaded = (await uploadMedia(
        req.file,
        'podcasts/covers'
      )) as CloudinaryUploadResult
      uploadedCoverImage = uploaded.secure_url
    } else if (validatedData.coverImage?.startsWith('data:')) {
      const uploaded = (await uploadMedia(
        validatedData.coverImage,
        'podcasts/covers'
      )) as CloudinaryUploadResult
      uploadedCoverImage = uploaded.secure_url
    }

    const updatedPodcast = await Podcast.findByIdAndUpdate(
      id,
      {
        ...validatedData,
        coverImage: uploadedCoverImage || podcast.coverImage,
      },
      { new: true, runValidators: true }
    )

    if (!updatedPodcast) {
      res.status(404).json({ error: 'Podcast not found' })
      return
    }

    logger.info({
      message: 'Podcast updated',
      podcastId: updatedPodcast._id,
      title: validatedData.title || updatedPodcast.title,
    })
    res
      .status(200)
      .json({
        message: 'Podcast updated successfully',
        podcast: updatedPodcast,
      })
  } catch (error) {
    console.error('Error updating podcast:', error)
    res.status(500).json({ error: 'Failed to update podcast' })
  }
}

export const deletePodcast = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ error: 'Invalid podcast ID' })
      return
    }

    const podcast = (await Podcast.findById(id)) as IPodcast | null
    if (!podcast) {
      res.status(404).json({ error: 'Podcast not found' })
      return
    }

    await Episode.deleteMany({ podcast: podcast._id })

    await Podcast.findByIdAndDelete(id)

    logger.info({
      message: 'Podcast deleted',
      podcastId: id,
    })
    res
      .status(200)
      .json({ message: 'Podcast and associated episodes deleted successfully' })
  } catch (error) {
    console.error('Error deleting podcast:', error)
    res.status(500).json({ error: 'Failed to delete podcast' })
  }
}

export const togglePodcastStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ error: 'Invalid podcast ID' })
      return
    }

    const podcast = (await Podcast.findById(id)) as IPodcast | null
    if (!podcast) {
      res.status(404).json({ error: 'Podcast not found' })
      return
    }

    podcast.isActive = !podcast.isActive
    const updatedPodcast = await podcast.save()

    logger.info({
      message: `Podcast status toggled to ${podcast.isActive}`,
      podcastId: podcast._id,
    })
    res.status(200).json({
      message: `Podcast is now ${
        updatedPodcast.isActive ? 'active' : 'inactive'
      }`,
      podcast: updatedPodcast,
    })
  } catch (error) {
    console.error('Error toggling podcast status:', error)
    res.status(500).json({ error: 'Failed to toggle podcast status' })
  }
}
