import React from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();
  const signUp = async (e) => {
    e.preventDefault();
    //Getting the values from the input
    const user = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };
    //Creating a new user
    try {
      await axios.post('/api/auth/signUp', user);
      toast.success('Sign up Successful!');
      //Clearing out the inputs
      e.target.name.value = '';
      e.target.email.value = '';
      e.target.password.value = '';
      /* if its successful go to login */
      navigate('/auth/signIn');
    } catch (error) {
      console.log(error);
      toast.error('Sign up Failed!');
    }
  };

  return (
    <div className="signup">
      <h1 className="title">Sign Up</h1>
      <form className="form" onSubmit={signUp}>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" placeholder="Name" required />
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          name="email"
          placeholder="Email"
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      <Link className="singUp-link" to="/auth/signIn">
        Click Here To Sign In
      </Link>
    </div>
  );
};

export default SignUp;
