import { loginAdmin, registerAdmin } from "../services/AdminService.js";


export const signup = async (req, res) => {
    try {
 
       const{name, email, username, password, confirm_password} = req.body
      const result = await registerAdmin({name, email, username, password, confirm_password});
  
      if (result.error) {
        return res.status(result.error.status).json({ message: result.error.message, status: result.error.status });
      }
  
      return res.status(201).json({ message: 'Signup successful. You can now log in.' });
    } catch (error) {
      console.error('Signup error:', error);
      return res.status(500).json({ message: 'Internal server error.', status: 500 });
    }
  };
  


  export const login = async (req, res) => {
    try {
      const result = await loginAdmin(req.body);
      if (result.error) {
        return res.status(result.error.status).json({ message: result.error.message, status: result.error.status });
      }
  
      return res.status(200).json({ message: 'Login successful.', token: result.token });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Internal server error.', status: 500 });
    }
  };