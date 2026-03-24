import foodModels from "../models/foodModels.js";
import fs from 'fs'

// add food items

const addFood = async (req, res) => {
    // multer-storage-cloudinary ইমেজ পাথটি req.file.path এ দেয়
    let image_filename = req.file.path; 

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename // এখন এটি সরাসরি Cloudinary-র লিঙ্ক সেভ করবে
    })
    try {
        await food.save();
        res.json({success: true, message: "Food Added Successfully"})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: "Error adding food"})
    }
}
// all Food List

const listFood = async (req,res)=>{
    try {
        const foods = await foodModels.find({})
        res.json({success:true,data:foods})
    } catch (error) {
        console.log(error)
        res.json({success:false, massage:"Error"})
    }
}

// remove food item

const removeFood  = async(req,res)=>{
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({success:false,message:"Food id is required"})
        }

        const food = await foodModels.findById(id);

        if (!food) {
            return res.status(404).json({success:false,message:"Food item not found"})
        }

        const imagePath = `uplodes/${food.image}`;

        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath)
        }

        await foodModels.findByIdAndDelete(id)
        res.json({success:true,message:"Food Removed"})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,message:"Error removing food item"})
    }
}

export {addFood,listFood,removeFood} 
