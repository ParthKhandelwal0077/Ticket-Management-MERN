import { useEffect, useState } from 'react'
import NavBar from './NavBar'
import { Link, Outlet } from 'react-router-dom'
import QuestionMark from './QuestionMark'
const scrambleText = (text, setScrambledText) => {
  let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let iterations = 0;
  let interval = setInterval(() => {
    setScrambledText(text.split('').map((char, index) => {
      if (index < iterations) return char;
      return chars[Math.floor(Math.random() * chars.length)];
    }).join(''));
    
    if (iterations >= text.length) clearInterval(interval);
    iterations++;
  }, 70);
};

const Welcome = () => {
  const [scrambledText, setScrambledText] = useState("Welcome to Ask Us");

  useEffect(() => {
    scrambleText("Welcome to Ask Us", setScrambledText);
  }, []);

  return (
    <div className="min-h-screen bg-primary">
      <NavBar />
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-64px)] space-y-6 px-4">
        <div className="w-full h-[50vh] relative">
          <QuestionMark />
        </div>
        <h1 className="text-4xl font-bold text-red-800">
          {scrambledText.split(' ').map((word, index) => (
            word === "Ask" ? (
              <span key={index} className="text-white">{word}</span>
            ) : (
              <span key={index} className="text-red-800">{word} </span>
            )
          ))}
        </h1>
        <p className="text-lg text-white text-center max-w-2xl">
          AskUs is a platform for users to raise queries and get instant solutions from our agents.
        </p>
        <div className="flex justify-center items-center space-x-4 bg-gray-500 rounded-lg p-2">
          <Link to="/auth/loginUser" className="text-white hover:text-red-300 transition-opacity">Login as User</Link>
          <span className="text-red-800">|</span>
          <Link to="/auth/registerUser" className="text-white hover:text-red-300 transition-opacity">Register as User</Link>
        </div>
      </div>
      <Outlet />
    </div>
  )
}

export default Welcome;
