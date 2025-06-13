import User from "../models/User.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { generateToken } from "../utils/generateToken.js";

// @desc    Register new user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json(new ApiResponse(false,400,"User already exists"));

    const user = new User({ username, password, role });
    await user.save();

    res.status(201).json(new ApiResponse(true,201,"Register Successfull",{  user: { id: user._id, username: user.username, role: user.role } }));
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json(new ApiResponse(false,401,"Invalid credentials")
        );

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json(new ApiResponse(false,401,"Invalid credentials"));

    const token = generateToken(user);
    return res.status(200).json(new ApiResponse(true,200,"Login Successfull",{ token, user: { id: user._id, username: user.username, role: user.role } })
        
        );
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
