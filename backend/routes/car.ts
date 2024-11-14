import { Request, Response, Router } from "express";
import authMiddleware from "../middleware/jwt.strategy";
import { Car } from "../model/Car";
import upload from "../middleware/upload";

const router = Router();
interface AuthRequest extends Request {
  userId?: string;
}
// Create Car
router.post(
  "/",
  authMiddleware,
  upload.array("images", 10),
  async (req: AuthRequest, res: Response) => {
    try {
      const { title, description, tags } = req.body;
      const images = req.files
        ? (req.files as Express.Multer.File[]).map((file) => file.path)
        : [];

      const car = new Car({
        user: req.userId,
        title,
        description,
        tags: tags ? tags.split(",") : [],
        images, // Store image URLs from Cloudinary
      });

      await car.save();
      res.status(201).json(car);
    } catch (error) {
      console.log(error);
      
      res.status(500).json({ error: "Server error" });
    }
  }
);

// List Cars
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  const cars = await Car.find({ user: req.userId });
  res.send(cars);
});

// Get Car Details
router.get("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  const car = await Car.findOne({ _id: req.params.id, user: req.userId });
  if (!car) res.status(404).send("Car not found");
  res.send(car);
});

// Update Car
router.patch(
  "/:id",
  authMiddleware,
  upload.array("images", 10),
  async (req: AuthRequest, res: Response) => {
    try {
      const { title, description, tags } = req.body;
      const images = req.files
        ? (req.files as Express.Multer.File[]).map((file) => file.path)
        : [];

      const updatedCar = await Car.findOneAndUpdate(
        { _id: req.params.id, user: req.userId },
        { title, description, tags: tags ? tags.split(",") : [], images },
        { new: true }
      );

      if (!updatedCar) res.status(404).json({ error: "Car not found" });
      res.json(updatedCar);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Delete Car
router.delete(
  "/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    await Car.deleteOne({ _id: req.params.id, user: req.userId });
    res.status(204).send();
  }
);

export const carRoute = router;
